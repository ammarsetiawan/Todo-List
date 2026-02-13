

const todos = [];
const RENDER_EVENT = 'render-todo';

//testing array todos dan menampilkan tugas
document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('todos');
  uncompletedTODOList.innerHTML = '';
 
  const completedTODOList = document.getElementById('completed-todos');
  completedTODOList.innerHTML = '';
 
  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);
    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

// berfungsi mebuat tanggal
function generateId() {
  return +new Date();
}
 //berfungsi untuk membuat object baru dari data yang sudah disediakan dari inputan (parameter function),
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    task,
    timestamp,
    isCompleted
  }
}

// kode di bawah ini berfungsi untuk mengambil dan menambahkan todo baru
function addTodo() {
  const textTodo = document.getElementById('title').value;
  const timestamp = document.getElementById('date').value;
 
  const generatedID = generateId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  todos.push(todoObject);
 
    document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// ini tuh berfungsi buat mencegah form memuat ulang
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });
  if (typeof (Storage) !== 'undefined') {
    loadDataFromStorage();
  }
});



// container todo list
// untuk merekapkan todo yang sudah dibuat
function makeTodo(todoObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = todoObject.task;
 
  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = todoObject.timestamp;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTimestamp);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${todoObject.id}`);
 
if (todoObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(todoObject.id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todoObject.id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(todoObject.id);
    });
    
    container.append(checkButton);
  }

  return container;
}

// fungsi ini digunakan untuk memindahkan todo dari rak “Yang harus dilakukan” ke “Yang sudah dilakukan”.
function addTaskToCompleted (todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;
 
  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

//  yang mana berfungsi untuk mencari todo dengan ID yang sesuai pada array todos. Agar tidak terjadi error (undefined),
function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);
 
  if (todoTarget === -1) return;
 
  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
//  mengembalikan task yang ingin di tambah lagi
function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);
 
  if (todoTarget == null) return;

   todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
//menghapus task
function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
 
  return -1;
}


const STORAGE_KEY = 'TODO_APPS';

function saveData() {
  if (typeof (Storage) !== 'undefined') {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
  
}


