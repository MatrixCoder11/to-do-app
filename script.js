
const list = document.getElementById('todo-list')
const itemCountSpan = document.getElementById('item-count')
const uncheckedCountSpan = document.getElementById('unchecked-count')
let todos = JSON.parse(localStorage.getItem('todos')) || [];


function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
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
        onchange="checkTodo(${todo.id})"
      />
      <label for="cb-${todo.id}">
        <span class="${textClass}">${todo.text}</span>
      </label>
      <button
        class="btn btn-danger btn-sm float-end"
        onclick="deleteTodo(${todo.id})"
      >delete</button>
    </li>`;
}

function render() {
  list.innerHTML = todos.map(renderTodo).join('');
  updateCounter();
}


function updateCounter() {
  itemCountSpan.textContent    = todos.length;
  uncheckedCountSpan.textContent = todos.filter(t => !t.done).length;
}

function newTodo() {
  const text = prompt('Введіть нову справу:');
  if (!text || !text.trim()) return;

  const todo = {
    id:   Date.now(),
    text: text.trim(),
    done: false,
  };
  todos.push(todo);
  save();
  render();
}


function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}


function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  save();
  render();
}


render();
