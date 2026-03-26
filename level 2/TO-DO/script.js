// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const editModal = document.getElementById('editModal');
const editTaskInput = document.getElementById('editTaskInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// State
let tasks = [];
let currentEditId = null;

// Initialize
document.addEventListener('DOMContentLoaded', loadTasks);

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
saveEditBtn.addEventListener('click', saveEdit);
cancelEditBtn.addEventListener('click', closeModal);
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) closeModal();
});

// Functions

// Get current date and time
function getCurrentDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return now.toLocaleDateString('en-US', options);
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: generateId(),
        text: taskText,
        completed: false,
        createdAt: getCurrentDateTime(),
        completedAt: null
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Render all tasks
function renderTasks() {
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    renderTaskList(pendingTasks, pendingList);
    renderTaskList(completedTasks, completedList);

    pendingCount.textContent = pendingTasks.length;
    completedCount.textContent = completedTasks.length;
}

// Render a single task list
function renderTaskList(taskList, container) {
    container.innerHTML = '';

    if (taskList.length === 0) {
        container.innerHTML = '<li class="empty-message">No tasks yet</li>';
        return;
    }

    taskList.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        const dateInfo = task.completed 
            ? `Created: ${task.createdAt} | Completed: ${task.completedAt}`
            : `Created: ${task.createdAt}`;

        li.innerHTML = `
            <div class="task-content">
                <div class="task-text">${escapeHtml(task.text)}</div>
                <div class="task-date">${dateInfo}</div>
            </div>
            <div class="task-actions">
                ${task.completed 
                    ? `<button class="btn btn-undo" onclick="undoTask('${task.id}')">Undo</button>`
                    : `<button class="btn btn-complete" onclick="completeTask('${task.id}')">Complete</button>`
                }
                <button class="btn btn-edit" onclick="editTask('${task.id}')">Edit</button>
                <button class="btn btn-delete" onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;

        container.appendChild(li);
    });
}

// Complete a task
function completeTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = true;
        task.completedAt = getCurrentDateTime();
        saveTasks();
        renderTasks();
    }
}

// Undo a completed task
function undoTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = false;
        task.completedAt = null;
        saveTasks();
        renderTasks();
    }
}

// Delete a task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Edit a task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        currentEditId = id;
        editTaskInput.value = task.text;
        editModal.classList.add('show');
        editTaskInput.focus();
    }
}

// Save edited task
function saveEdit() {
    const newText = editTaskInput.value.trim();
    
    if (newText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = tasks.find(t => t.id === currentEditId);
    if (task) {
        task.text = newText;
        saveTasks();
        renderTasks();
    }

    closeModal();
}

// Close modal
function closeModal() {
    editModal.classList.remove('show');
    currentEditId = null;
    editTaskInput.value = '';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

// Make functions available globally
window.completeTask = completeTask;
window.undoTask = undoTask;
window.deleteTask = deleteTask;
window.editTask = editTask;
