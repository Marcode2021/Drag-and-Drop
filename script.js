const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((name, i) => {
    localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[i]));
  });
}

// Filter Arrays to remove empty items

const filterArray = function (array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) getSavedColumns();
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogList, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressList, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeList, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldList, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if necessary, or update Array value
const updateItem = function (id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = itemLists[column].children;
  if (dragging) return;
  if (!selectedColumnEl[id].textContent) {
    delete selectedArray[id];
  } else {
    selectedArray[id] = selectedColumnEl[id].textContent;
  }
  updateDOM();
};

// Add to column and reset textbox
const addToColumn = function (column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
};

// Show Add Item input box
const showInputBox = function (column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
};

// Hide Item Input Box
const hideInputBox = function (column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
};

// Allow arrays to reflect Drag and Drop items
const rebuildArrays = function () {
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
};

// When Item starts Dragging
const drag = function (e) {
  draggedItem = e.target;
  dragging = true;
};

// Column Allows for Item to Drop

const allowDrop = function (e) {
  e.preventDefault();
};

// Dropping Item in Column
const drop = function (e) {
  e.preventDefault();
  // Remove background color padding
  itemLists.forEach((column) => {
    column.classList.remove("over");
  });
  // Add item to column
  const parent = itemLists[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
};

// When Item enters column Area
const dragEnter = function (column) {
  itemLists[column].classList.add("over");
  currentColumn = column;
};

//  On Load
updateDOM();
