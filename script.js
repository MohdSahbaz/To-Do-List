const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks
    .filter((t) => {
      if (filter === "all") return true;
      return filter === "done" ? t.done : !t.done;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task ${task.priority} ${task.done ? "done" : ""}`;

      li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div class="task-buttons">
          <button onclick="toggleDone(${index})" title="Mark as ${
        task.done ? "Undone" : "Done"
      }">
            <i class="fas ${
              task.done ? "fa-check-double" : "fa-check-circle"
            }"></i>
          </button>
          <button onclick="editTask(${index})" title="Edit Task">
            <i class="fas fa-pen-to-square"></i>
          </button>
          <button onclick="deleteTask(${index})" title="Delete Task">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;

      taskList.appendChild(li);
    });
}

function addTask() {
  const text = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (text === "") return;

  tasks.push({ text, priority, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function toggleDone(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText) {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  })
);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeToggle.innerHTML = document.body.classList.contains("light")
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
});

renderTasks();
