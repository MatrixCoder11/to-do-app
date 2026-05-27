// ───── Стан програми ─────
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// ───── Допоміжні функції ─────

/** Зберегти масив у LocalStorage */
function save() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/** Рендер одного todo → рядок HTML */
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

/** Відрендерити весь список */
function render() {
  list.innerHTML = todos.map(renderTodo).join('');
  updateCounter();
}

/** Оновити лічильники */
function updateCounter() {
  itemCountSpan.textContent    = todos.length;
  uncheckedCountSpan.textContent = todos.filter(t => !t.done).length;
}

/** Додати нову справу */
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

/** Видалити справу за id */
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

/** Перемикнути статус done */
function checkTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  save();
  render();
}

// ───── Ініціалізація ─────
render();
