document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    // Initialize the application
    init();

    addTaskButton.addEventListener('click', handleAddTask);

    // Load tasks from local storage and render them
    function init() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => addTaskToDOM(task));
    }

    // Get tasks from local storage
    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Save tasks to local storage
    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Handle the Add Task button click
    function handleAddTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Task cannot be empty');
            return;
        }

        const task = createTask(taskText);
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        saveTasksToLocalStorage(tasks);
        addTaskToDOM(task);
        taskInput.value = '';
    }

    // Create a new task object
    function createTask(text) {
        return {
            id: Date.now(),
            text: text,
            completed: false
        };
    }

    // Add a task to the DOM
    function addTaskToDOM(task) {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.setAttribute('data-id', task.id);

        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        taskItem.appendChild(taskText);

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const completeButton = createActionButton('Complete', handleCompleteTask);
        const editButton = createActionButton('Edit', handleEditTask);
        const deleteButton = createActionButton('Delete', handleDeleteTask);

        taskActions.appendChild(completeButton);
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    }

    // Create an action button
    function createActionButton(text, eventHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', eventHandler);
        return button;
    }

    // Handle task completion
    function handleCompleteTask(event) {
        const taskItem = event.target.closest('.task-item');
        const taskId = parseInt(taskItem.getAttribute('data-id'));
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === taskId);
        task.completed = !task.completed;
        saveTasksToLocalStorage(tasks);
        taskItem.classList.toggle('completed');
        event.target.textContent = task.completed ? 'Incomplete' : 'Complete';
    }

    // Handle task editing
    function handleEditTask(event) {
        const taskItem = event.target.closest('.task-item');
        const taskId = parseInt(taskItem.getAttribute('data-id'));
        const tasks = getTasksFromLocalStorage();
        const task = tasks.find(t => t.id === taskId);
        const newText = prompt('Edit task', task.text);
        if (newText !== null && newText.trim() !== '') {
            task.text = newText.trim();
            saveTasksToLocalStorage(tasks);
            taskItem.querySelector('span').textContent = task.text;
        }
    }

    // Handle task deletion
    function handleDeleteTask(event) {
        const taskItem = event.target.closest('.task-item');
        const taskId = parseInt(taskItem.getAttribute('data-id'));
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasksToLocalStorage(tasks);
        taskList.removeChild(taskItem);
    }
});
