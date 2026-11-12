import { addTask, toggleTask, removeTask, countPending } from './tasks.js';

const storageKey = 'devops-fase1-tarefas';
const form = document.querySelector('#task-form');
const titleInput = document.querySelector('#task-title');
const list = document.querySelector('#task-list');
const summary = document.querySelector('#summary');

function loadTasks() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value.filter(task =>
      task && typeof task.id === 'string' && typeof task.title === 'string' && typeof task.done === 'boolean'
    ) : [];
  } catch { return []; }
}

let tasks = loadTasks();

function render() {
  list.replaceChildren();
  summary.textContent = `${countPending(tasks)} tarefa(s) pendente(s)`;
  for (const task of tasks) {
    const item = document.createElement('li');
    if (task.done) item.classList.add('done');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.setAttribute('aria-label', `Concluir ${task.title}`);
    checkbox.addEventListener('change', () => update(toggleTask(tasks, task.id)));
    const label = document.createElement('span');
    label.textContent = task.title;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Excluir';
    remove.setAttribute('aria-label', `Excluir ${task.title}`);
    remove.addEventListener('click', () => update(removeTask(tasks, task.id)));
    item.append(checkbox, label, remove);
    list.append(item);
  }
}

function update(nextTasks) {
  tasks = nextTasks;
  localStorage.setItem(storageKey, JSON.stringify(tasks));
  render();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  try {
    update(addTask(tasks, titleInput.value));
    form.reset();
    titleInput.focus();
  } catch (error) { titleInput.setCustomValidity(error.message); titleInput.reportValidity(); }
});
titleInput.addEventListener('input', () => titleInput.setCustomValidity(''));
render();
