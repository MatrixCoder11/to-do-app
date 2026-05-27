const DB_URL = 'https://todos-ca745-default-rtdb.firebaseio.com/todos';

const list               = document.getElementById('todo-list');
const itemCountSpan      = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const loader             = document.getElementById('loader');
const errorBox           = document.getElementById('error-box');

let todos = [];

function showLoader(on) {
  loader.classList.toggle('d-none', !on);
}
function showError(msg) {
  if (msg) {
    errorBox.textContent = '⚠️ ' + msg;
    errorBox.classList.remove('d-none');
  } else {
    errorBox.classList.add('d-none');
  }
}

function renderTodo(todo) {
  const checkedAttr = todo.done ? 'checked' : '';
  const textClass   = todo.done
    ? 'text-success text-decoration-line-through'
    : '';
  return `
    <li class="list-group-item" id="item-${todo.id}">
      <input
        type="checkbox"
        class="form-check-input me-2"
        id="cb-${todo.id}"
        ${checkedAttr}
        onchange="checkTodo('${todo.id}')"
      />
      <label for="cb-${todo.id}">
        <span class="${textClass}">${todo.text}</span>
      </label>
      <button
        class="btn btn-danger btn-sm float-end"
        onclick="deleteTodo('${todo.id}')"
      >delete</button>
    </li>`;
}

function render() {
  list.innerHTML = todos.map(renderTodo).join('');
  itemCountSpan.textContent      = todos.length;
  uncheckedCountSpan.textContent = todos.filter(t => !t.done).length;
}

async function loadTodos() {
  showLoader(true);
  showError(null);
  try {
    const res  = await fetch(`${DB_URL}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data) {
      todos = Object.entries(data).map(([id, val]) => ({ id, ...val }));
    } else {
      todos = [];
    }
    render();
  } catch (err) {
    showError('Не вдалося завантажити дані: ' + err.message);
  } finally {
    showLoader(false);
  }
}

async function addTodo(todoData) {
  const res = await fetch(`${DB_URL}.json`, {
    method:  'POST',
    body:    JSON.stringify(todoData),
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json(); 
  return data.name;             
}

async function newTodo() {
  const text = prompt('Введіть нову справу:');
  if (!text || !text.trim()) return;

  showLoader(true);
  showError(null);
  try {
    const todoData = { text: text.trim(), done: false };
    const id       = await addTodo(todoData);   
    todos.push({ id, ...todoData });
    render();
  } catch (err) {
    showError('Не вдалося додати справу: ' + err.message);
  } finally {
    showLoader(false);
  }
}

async function deleteTodo(id) {
  showLoader(true);
  showError(null);
  try {
    const res = await fetch(`${DB_URL}/${id}.json`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    todos = todos.filter(t => t.id !== id);
    render();
  } catch (err) {
    showError('Не вдалося видалити справу: ' + err.message);
  } finally {
    showLoader(false);
  }
}

async function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  const newDone = !todo.done;
  showLoader(true);
  showError(null);
  try {
    const res = await fetch(`${DB_URL}/${id}.json`, {
      method:  'PATCH',
      body:    JSON.stringify({ done: newDone }),
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    todo.done = newDone;
    render();
  } catch (err) {
    showError('Не вдалося оновити справу: ' + err.message);
  } finally {
    showLoader(false);
  }
}

loadTodos();
