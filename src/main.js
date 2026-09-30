import './style.css';

const seedTasks = [
  { id: 1, title: 'Send the first draft to Mara', done: false },
  { id: 2, title: 'Pick up a few things for dinner', done: false },
  { id: 3, title: 'Take a proper lunch break', done: true },
];

let tasks = [...seedTasks];
let activeFilter = 'all';
let nextId = 4;

const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const openCount = document.querySelector('#open-count');
const doneCount = document.querySelector('#done-count');
const emptyState = document.querySelector('#empty-state');

function renderTasks() {
  const visibleTasks = tasks.filter((task) => {
    if (activeFilter === 'open') return !task.done;
    if (activeFilter === 'done') return task.done;
    return true;
  });

  taskList.replaceChildren(...visibleTasks.map((task) => {
    const item = document.createElement('li');
    item.className = `task-row${task.done ? ' is-done' : ''}`;
    item.dataset.taskId = String(task.id);

    const toggle = document.createElement('button');
    toggle.className = 'task-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', `${task.done ? 'Mark as open' : 'Mark as done'}: ${task.title}`);
    toggle.setAttribute('aria-pressed', String(task.done));
    toggle.addEventListener('click', () => {
      task.done = !task.done;
      renderTasks();
    });

    const title = document.createElement('span');
    title.className = 'task-title';
    title.textContent = task.title;

    const remove = document.createElement('button');
    remove.className = 'task-remove';
    remove.type = 'button';
    remove.setAttribute('aria-label', `Delete: ${task.title}`);
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      renderTasks();
    });

    item.append(toggle, title, remove);
    return item;
  }));

  taskCount.textContent = String(tasks.length);
  openCount.textContent = String(tasks.filter((task) => !task.done).length);
  doneCount.textContent = String(tasks.filter((task) => task.done).length);
  emptyState.hidden = visibleTasks.length > 0;
}

document.querySelector('#add-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#new-task');
  const title = input.value.trim();
  if (!title) return;
  tasks.push({ id: nextId++, title, done: false });
  input.value = '';
  activeFilter = 'all';
  document.querySelectorAll('.filter-button').forEach((button) => {
    button.classList.toggle('selected', button.dataset.filter === 'all');
  });
  renderTasks();
  input.focus();
});

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-button').forEach((filter) => {
      filter.classList.toggle('selected', filter === button);
    });
    renderTasks();
  });
});

renderTasks();
