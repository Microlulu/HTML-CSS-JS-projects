let isDark = false;
let input = document.getElementById("todo-input");
let todoItems = [];
let currentTodoItemsContainer = document.getElementById("current-todo-items");
let activeTasksCount = 0;
let completedTasksCount = 0;

class TodoItem {
    // This wait a text and mark it as incomplete
    // we create a class TodoItem with a tet and a status
    constructor(text) {
        this.text = text;
        this.status = "incomplete";
    }

    markAsComplete() {
        this.status = "complete";
    }
}

/** main function */
function pageOnLoad() {
    changeTheme();
    input.addEventListener("keyup", function (event) {
        // WORK WHEN YOU PRESS ENTER BUTTON
        if (event.keyCode === 13) {
            //When i write something
            let todoItem = document.getElementById("todo-input").value;
            //Add new todo is called
            addNewTodo(todoItem);
            document.getElementById("todo-input").value = '';
            showCurrentTodos();
        }
    });

}
/* Change the theme with a click switch beetween variables*/
function changeTheme() {
    document.getElementById("bottom").classList.toggle("darkBottom");
    let themeButton = document.getElementById("themeButton");
    document.getElementById("top").classList.toggle("darkTop");
    document.getElementById("input-container").classList.toggle("darkTop");
    document.getElementById("icon-check-control").classList.toggle("dark-color");
    document.getElementById("todo-input").classList.toggle("dark-color");
    document.getElementById("current-todo-items").classList.toggle("dark-color");
    document.getElementById("control-wrap").classList.toggle("dark-color");

    if (isDark == true) {
        document.getElementById("themeButton").style.backgroundImage = "url(images/icon-sun.svg)";
        isDark = false;
    }
    else {
        document.getElementById("themeButton").style.backgroundImage = "url(images/icon-moon.svg)";
        isDark = true;
    }
}

function addNewTodo(itemToAdd) {
    //check is there is a null if it isnt it push the new todo in an array
    if (itemToAdd != null && itemToAdd != '') {
        todoItems.push(new TodoItem(itemToAdd));
        // ADD 1 TO THE LIST OF ITEM WHEN A TODO IS CREATED
        activeTasksCount++;
        // show the number of items in the list
        document.getElementById("item-count").innerHTML = activeTasksCount + " items left";
        
    }
}

// a lot of items created dynamiquely
function showItemsFromArray(array, taskType) {
    // WE REFRESH THE CODE SAYING inner html = nothing
    currentTodoItemsContainer.innerHTML = "";
    // we create a loop
    for (let i = 0; i < array.length; i++) {
        // CREATE A DIV whitch gonna be a row
        let singleTodoItemDiv = document.createElement("div");
        // ADD A CLASS TO THE ITEM
        singleTodoItemDiv.classList.add("single-todo-wrap");
        singleTodoItemDiv.classList.add("row");
        // CREATE AN OTHER DIV FOR THE ICON
        let divIcon = document.createElement("div");
        if (todoItems[i].status == "complete") {
            // ADD A CLASS CROSS TO IT IF ITS COMPLETE
            singleTodoItemDiv.classList.add("crossed");
        }
        // CREATE A OTHER DIV FOR CIRCLE ITEM
        divIcon.classList.add("circle-icon");
        // ONLY CROSS IT IF CLICKED
        divIcon.onclick = function () {
            todoItems[i].markAsComplete();
            // WHEN IT'S COMPELETE REMOVE FROM THE LIST ITEM LEFT
            activeTasksCount--;
            document.getElementById("item-count").innerHTML = activeTasksCount + " items left";
            singleTodoItemDiv.classList.add("crossed");
        }
        // appendChild : CREATE A DIV INSIDE A DIV
        // CREATE A DIV FOR THE ICON
        singleTodoItemDiv.appendChild(divIcon);
        let divText = document.createElement("div");
        // CREATE AN ARRAY
        divText.innerHTML = array[i].text;
        divText.classList.add("todo-text");
        // CREATE A DIV FOR THE TEXT
        singleTodoItemDiv.appendChild(divText);
        if( taskType == "all"){
            currentTodoItemsContainer.appendChild(singleTodoItemDiv);
        }      
          if( taskType == "active" && array[i].status == "incomplete"){
            currentTodoItemsContainer.appendChild(singleTodoItemDiv);
        }
        if( taskType == "completed" && array[i].status == "complete" ){
            currentTodoItemsContainer.appendChild(singleTodoItemDiv);
        }
        
    }
}

function showCurrentTodos() {
    currentTodoItemsContainer.innerHTML = "";
    showItemsFromArray(todoItems, "all");
}

function showAllItems() {
    showItemsFromArray(todoItems, "all");
}

function showCompleteItems() {
    showItemsFromArray(todoItems, "completed");
}

function showIncompleteItems() {
    showItemsFromArray(todoItems, "active");

}


function removeTodoItem(arrayToRemoveFrom, index) {
    if (index > -1) {
        arrayToRemoveFrom.splice(index, 1);
    }
}

function clearCompleted(){
    // We create an array
    let clearedItems = [];
    //
    for(let i = 0; i < todoItems.length; i++){
        // it will keep jst the todo not completed
        if(todoItems[i].status != "complete"){
            // AND REMOVE the completed ones
            clearedItems.push(todoItems[i]);
        }
    }
    todoItems = clearedItems;
    showAllItems(todoItems, "all");
}