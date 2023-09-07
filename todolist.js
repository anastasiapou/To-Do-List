const form = document.querySelector('form');
const input = document.querySelector('#new-task');
const dueDate = document.querySelector('#due-date');
const sortSelect = document.querySelector('#sort-select');
const showReminders = document.querySelector('#show-reminders');
const showCompleted = document.querySelector('#show-completed');
const ul = document.querySelector('#task-list');

let tasks = [];

// Load tasks from local storage
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  renderTasks();
}

// Add a new task to the list
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = input.value.trim();
  const date = dueDate.value.trim();
  if (task) {
    const newTask = {
      text: task,
      dateAdded: new Date(),
      dateDue: date ? new Date(date) : null,
      reminder: false,
      completed: false
    };
    tasks.push(newTask);
    input.value = '';
    dueDate.value = '';
    renderTasks();
    saveTasks();
  
  }
});

// Mark a task as complete or incomplete
ul.addEventListener('click', (e) => {
  if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
    const index = e.target.parentNode.parentNode.getAttribute('data-index');
    tasks[index].completed = e.target.checked;
    renderTasks();
    saveTasks();
  }
  if (e.target.tagName === 'BUTTON') {
    const index = e.target.parentNode.getAttribute('data-index');
    tasks.splice(index, 1);
    renderTasks();
    saveTasks();
  }
});

// Change the sort order
sortSelect.addEventListener('change', () => {
  renderTasks();
});

// Show/hide reminders
showReminders.addEventListener('change', () => {
  renderTasks();
});

// Show/hide completed tasks
showCompleted.addEventListener('change', () => {
  renderTasks();
});

// Render the list of tasks
function renderTasks() {
  ul.innerHTML = '';
  let sortedTasks = tasks.slice();
  switch (sortSelect.value) {
    case 'date-added':
      sortedTasks.sort((a, b) => a.dateAdded - b.dateAdded);
      break;
    case 'date-due':
      sortedTasks.sort((a, b) => a.dateDue - b.dateDue);
      break;
    case 'completion-status':
      sortedTasks.sort((a, b) => a.completed - b.completed);
      break;
  }
  sortedTasks.forEach((task, index) => {
    if (!showReminders.checked || task.reminder) {
      if (showCompleted.checked || !task.completed) {
        const li = document.createElement('li');
        li.setAttribute('data-index', index);
        li.classList.add(task.completed ? 'completed' : null);
        li.innerHTML = `
          <label>
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span>${task.text}</span>
          </label>
          <span>${task.dateDue ? task.dateDue.toLocaleDateString() : ''}</span>
          <button>Delete</button>
        `;
        ul.appendChild(li);
      }
    }
  });
}

// Save the list of tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
