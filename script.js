// Copyright (c) 2025 Paulina Zabielska
// All rights reserved. This code cannot be used, copied, modified, or distributed for commercial purposes without the author's permission.

document.addEventListener("DOMContentLoaded", function() {
    loadTasks(); 
    loadTitle(); 

    // Add event listener for Enter key press
    let taskInput = document.getElementById("taskInput");
    taskInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            addTask();

            // Prevents form submission (default action for Enter in forms)
            event.preventDefault(); 
        }
    });
});

// Function to add a task
function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText === "") return;

    // Retrieve tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: false });

    // Save the updated task list in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";

    loadTasks();
}

// Function to load tasks
function loadTasks() {
    let taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; 

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task, index) => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        if (task.completed) li.classList.add("bg-light", "text-decoration-line-through");

        // Add task text
        let taskText = document.createElement("span");
        taskText.textContent = task.text;
        li.appendChild(taskText);

        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "";
        deleteBtn.classList.add("btn", "btn-sm", "btn-close");
        deleteBtn.onclick = (e) => {

            // Prevents click propagation (to avoid marking task as completed)
            e.stopPropagation(); 
            removeTask(index);
        };

        // Click event to toggle task completion
        li.addEventListener("click", () => toggleTask(index));

        // Add delete button to the task item
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Function to toggle task completion
function toggleTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

// Function to remove a task
function removeTask(index) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index, 1); // Remove task
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks(); 
}

// Function to export tasks to a JSON file
function exportToJson() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Retrieve list title (if set)
    let listTitle = localStorage.getItem("listTitle") || "ToDoList"; 

    // Create an export object containing title and tasks
    let exportData = {
        listTitle: listTitle,
        tasks: tasks
    };

    let blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Use list title as filename
    link.download = `${listTitle}.json`; 
    link.click();
}

// Function to import tasks from a JSON file
function importFromJson(event) {
    let file = event.target.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.onload = function(e) {
        try {
            let importedData = JSON.parse(e.target.result); // Parse file data

            // If the file contains a title, update the list title in localStorage
            let importedTitle = importedData.listTitle || "ToDoList";
            localStorage.setItem("listTitle", importedTitle);
            document.getElementById("listTitle").textContent = importedTitle;

            // Save imported tasks to localStorage
            localStorage.setItem("tasks", JSON.stringify(importedData.tasks || []));
            
            loadTasks();
        } catch (error) {
            console.error("Błąd podczas importowania danych:", error);
        }
    };
    // Read file content
    reader.readAsText(file); 
}

// Function to save a new list title after editing
function saveTitle() {
    let listTitle = document.getElementById("listTitle");
    let newTitle = listTitle.textContent.trim();

    if (newTitle !== "") {

        // Save new title to localStorage
        localStorage.setItem("listTitle", newTitle); 
    } else {

        // If the title is empty, set a default title
        listTitle.textContent = "ToDoList"; 
        localStorage.setItem("listTitle", "ToDoList");
    }
}

// Function to load the list title on page load
function loadTitle() {
    let listTitle = document.getElementById("listTitle");
    let savedTitle = localStorage.getItem("listTitle");

    if (savedTitle) {
        listTitle.textContent = savedTitle;
    } else {
        listTitle.textContent = "ToDoList"; // Default title if none is stored
    }
}
