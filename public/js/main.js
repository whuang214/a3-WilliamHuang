// Fetch and display todos
const updateTodos = async () => {
  const response = await fetch("/todos");
  const todosFromServer = await response.json();
  const todosList = document.getElementById("todos-list");
  todosList.innerHTML = "";

  todosFromServer.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    // Checkbox for marking completion
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = todo.completed;
    checkBox.classList.add("form-check-input", "me-2");
    checkBox.addEventListener("change", () => toggleTodo(todo.id));

    // Todo title
    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;
    titleSpan.classList.add("flex-grow-1");

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "&times;";
    deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
    deleteBtn.onclick = () => deleteTodo(todo.id);

    // Creation date
    const createdAtSpan = document.createElement("span");
    createdAtSpan.textContent = `Created at: ${new Date(
      todo.createdAt
    ).toLocaleString()}`;
    createdAtSpan.classList.add("badge", "bg-secondary", "ms-2");

    todoItem.appendChild(checkBox);
    todoItem.appendChild(titleSpan);
    todoItem.appendChild(createdAtSpan);
    todoItem.appendChild(deleteBtn);
    todosList.appendChild(todoItem);
  });
};

// Toggle todo completion status
const toggleTodo = async (id) => {
  const response = await fetch(`/todos/${id}/toggle`, { method: "POST" });
  if (response.ok) {
    updateTodos();
  }
};

// Add a new todo (taking in a title)
const addTodo = async (newTitle) => {
  const response = await fetch("/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTitle, completed: false }),
  });

  if (response.ok) {
    updateTodos();
  }
};

// delete a todo
const deleteTodo = async (id) => {
  const response = await fetch(`/todos/${id}`, { method: "DELETE" });
  if (response.ok) {
    updateTodos();
  }
};

// Form submission event listener
document.getElementById("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const newTitle = document.getElementById("input").value;

  // Call the addTodo function to submit the new title
  if (newTitle.trim() !== "") {
    addTodo(newTitle);
    document.getElementById("input").value = "";
  }
});

updateTodos();
