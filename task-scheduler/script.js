const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
let db;
const request = indexedDB.open("TaskSchedulerDB", 1);

request.onupgradeneeded = function (event) {
	const db = event.target.result;
	const objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
	objectStore.createIndex("task", "task", { unique: false });
	objectStore.createIndex("priority", "priority", { unique: false });
	objectStore.createIndex("deadline", "deadline", { unique: false });
	objectStore.createIndex("completed", "completed", { unique: false });
};

request.onsuccess = function (event) {
	db = event.target.result;
	loadTasks();
};

request.onerror = function (event) {
	console.error("Database error:", event.target.errorCode);
};

function addTaskToDB(task, priority, deadline, completed = false) {
	const transaction = db.transaction(["tasks"], "readwrite");
	const objectStore = transaction.objectStore("tasks");
	const taskData = { task, priority, deadline, completed };

	objectStore.add(taskData);

	transaction.oncomplete = function () {
		console.log("Task added to the database successfully!");
		loadTasks();
	};

	transaction.onerror = function () {
		console.error("Error adding task to the database.");
	};
}
function loadTasks() {
	taskList.innerHTML = "";

	const transaction = db.transaction(["tasks"], "readonly");
	const objectStore = transaction.objectStore("tasks");

	objectStore.openCursor().onsuccess = function (event) {
		const cursor = event.target.result;
		if (cursor) {
			const task = cursor.value;
			addTaskToDOM(task.id, task.task, task.priority, task.deadline, task.completed);
			cursor.continue();
		}
	};
}
function addTaskToDOM(id, task, priority, deadline, completed) {
	const taskItem = document.createElement("div");
	taskItem.classList.add("task");
	taskItem.setAttribute("data-id", id);
	taskItem.innerHTML = `
		<p>${task}</p>
		<p>Priority: ${priority}</p>
		<p>Deadline: ${deadline}</p>
		<button class="mark-done" ${completed ? "disabled" : ""}>${completed ? "Completed" : "Mark Done"}</button>
		<button class="delete-task">Delete</button>
	`;
	if (completed) {
		taskItem.style.backgroundColor = "#f2f2f2";
	}

	taskList.appendChild(taskItem);
}
function markTaskAsDone(id) {
	const transaction = db.transaction(["tasks"], "readwrite");
	const objectStore = transaction.objectStore("tasks");
	const request = objectStore.get(id);

	request.onsuccess = function () {
		const task = request.result;
		task.completed = true;
		const updateRequest = objectStore.put(task);

		updateRequest.onsuccess = function () {
			console.log("Task marked as done in the database.");
			loadTasks();
		};
	};
}
function deleteTaskFromDB(id) {
	const transaction = db.transaction(["tasks"], "readwrite");
	const objectStore = transaction.objectStore("tasks");

	const deleteRequest = objectStore.delete(id);

	deleteRequest.onsuccess = function () {
		console.log("Task deleted from the database.");
		loadTasks();
	};

	deleteRequest.onerror = function () {
		console.error("Error deleting task from the database.");
	};
}
addTaskButton.addEventListener("click", () => {
	const task = taskInput.value;
	const priority = priorityInput.value;
	const deadline = deadlineInput.value;

	if (task.trim() === "" || deadline === "") {
		alert("Please select an upcoming date for the deadline.");
		return;
	}

	const selectedDate = new Date(deadline);
	const currentDate = new Date();

	if (selectedDate <= currentDate) {
		alert("Please select an upcoming date for the deadline.");
		return;
	}
	addTaskToDB(task, priority, deadline);
	taskInput.value = "";
	priorityInput.value = "top";
	deadlineInput.value = "";
});
taskList.addEventListener("click", (event) => {
	const taskItem = event.target.parentElement;
	const taskId = parseInt(taskItem.getAttribute("data-id"));

	if (event.target.classList.contains("mark-done")) {
		markTaskAsDone(taskId);
	}
	if (event.target.classList.contains("delete-task")) {
		deleteTaskFromDB(taskId);
	}
});
