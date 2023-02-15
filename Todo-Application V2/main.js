const bkImage = document.querySelector('.bk-image');
const body = document.querySelector('body');
const icon = document.querySelector('.icon');
const tasksList = document.querySelector('.tasks-list');
const itemsLeft = document.querySelector('.items-left');
const clearCompletedBtn = document.querySelector('.clear-completed-btn');
const activeBtn = document.querySelector('.active-btn');
const completedBtn = document.querySelector('.completed-btn');
const allBtn = document.querySelector('.all-btn');
const filters = document.querySelector('.filters');
let isDark = false;
// if prefers dark mode:
if (!window.matchMedia || window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark');
}
// on load determine which picture to choose for background
modifyBk();
// on load calculate active tasks
let initialTaskAmount = calculateActiveTasks();
// a string is expected so we have to convert the number
sessionStorage.setItem('id', initialTaskAmount.toString());
// update background
window.addEventListener('resize', e => {
    console.log('resize event check', e);
    // TODO: you have to send the device prop here otherwise the function won't work
    modifyFiltersPosition('');
});
document.addEventListener('click', (e) => {
    // check task as completed/active if clicked
    checkTaskOnClick(e.target);
    // check if person clicked on delete
    deleteTaskOnClick(e.target);
    // check if wants to clear completed
    clearCompleted(e.target);
    // check if person clicked on filters
    filtersClicked(e.target);
    // if person clicked to change mode
    changeMode(e.target);
});
document.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        // You have to use the HTMLInputElement type here because Elements don't have values
        let inputField = document.querySelector('.new-todo');
        let taskText = "";
        if (inputField.value.length > 0) {
            taskText = inputField.value;
            createNewListItemInDom(taskText);
            inputField.value = "";
        }
        // recalculate active tasks
        calculateActiveTasks();
        // refresh filter
        let filterBtn = document.querySelector('.active');
        filter(filterBtn);
    }
});
function changeMode(eventTarget) {
    if (eventTarget == icon) {
        console.log('Click');
        body.classList.toggle('dark');
        body.classList.toggle('light');
        modifyBk();
    }
}
function filtersClicked(eventTarget) {
    if (eventTarget.closest('ul') == filters) {
        if (eventTarget == activeBtn ||
            eventTarget == completedBtn ||
            eventTarget == allBtn) {
            filter(eventTarget);
        }
    }
}
function filter(filterBtn) {
    let previousActiveFilter = document.querySelector('.active');
    previousActiveFilter.classList.remove('active');
    // unhide all hidden tasks
    let tasksToUnhide = document.querySelectorAll('.hidden');
    tasksToUnhide.forEach(task => {
        task.classList.remove('hidden');
    });
    filterBtn.classList.add('active');
    let tasksClassToHide = "";
    switch (filterBtn) {
        case activeBtn:
            tasksClassToHide = '.checked';
            break;
        case completedBtn:
            tasksClassToHide = '.list-item:not(.checked)';
            break;
        case allBtn:
            tasksClassToHide = '';
            break;
    }
    if (tasksClassToHide.length > 0) {
        let tasksToHide = document.querySelectorAll(tasksClassToHide);
        tasksToHide.forEach(task => {
            if (!task.classList.contains('hidden')) {
                task.classList.add('hidden');
            }
        });
    }
}
function checkTaskOnClick(eventTarget) {
    if (eventTarget.closest('ul') == tasksList) {
        let allTasks = document.querySelectorAll('.list-item');
        allTasks.forEach(task => {
            if (eventTarget.closest('li') == task) {
                task.classList.toggle('checked');
                let ariaStatus = task.firstElementChild.getAttribute('aria-checked');
                ariaStatus == 'true' ? ariaStatus = 'false' : ariaStatus = 'true';
                task.firstElementChild.setAttribute('aria-checked', ariaStatus);
            }
        });
        // recalculate active tasks
        calculateActiveTasks();
        // refresh filter
        let filterBtn = document.querySelector('.active');
        filter(filterBtn);
    }
}
function calculateActiveTasks() {
    let activeTasks = document.querySelectorAll('.list-item:not(.checked)').length;
    // itemsLeft.innerText = `${activeTasks} items left`
    if (itemsLeft) {
        itemsLeft.innerHTML = `${activeTasks} items left`;
    }
    return activeTasks;
}
function deleteTaskOnClick(eventTarget) {
    let closestBtn = eventTarget.closest('button');
    if (closestBtn && closestBtn.classList.contains('delete-btn')) {
        closestBtn.parentElement.remove();
    }
    calculateActiveTasks();
}
function clearCompleted(eventTarget) {
    if (eventTarget === clearCompletedBtn) {
        let checkedTasks = document.querySelectorAll('.checked');
        checkedTasks.forEach(task => {
            task.remove();
        });
    }
}
function createNewListItemInDom(taskText) {
    let newId = sessionStorage.getItem('id') + 1;
    sessionStorage.setItem('id', newId);
    let newListItem = document.createElement('li');
    newListItem.classList.add('list-style');
    newListItem.classList.add('list-item');
    newListItem.setAttribute('draggable', 'true');
    newListItem.setAttribute('ondragstart', 'drag(event)');
    newListItem.setAttribute('ondragover', 'allowDrop(event)');
    newListItem.setAttribute('ondrop', 'drop(event)');
    newListItem.setAttribute('id', `task${newId}`);
    let checkbox = document.createElement('div');
    checkbox.classList.add('checkbox');
    checkbox.setAttribute('role', 'checkbox');
    checkbox.setAttribute('aria-label', taskText);
    let innerShape = document.createElement('div');
    innerShape.classList.add('inner-shape');
    let checkIcon = document.createElement('img');
    checkIcon.setAttribute('src', './images/icon-check.svg');
    checkIcon.setAttribute("alt", 'check symbol');
    checkbox.appendChild(innerShape);
    checkbox.appendChild(checkIcon);
    let p = document.createElement('p');
    let newText = document.createTextNode(taskText);
    p.appendChild(newText);
    let button = document.createElement('button');
    button.classList.add('delete-btn');
    let crossIcon = document.createElement('img');
    crossIcon.setAttribute("src", './images/icon-cross.svg');
    crossIcon.setAttribute("alt", 'cross-icon');
    button.appendChild(crossIcon);
    newListItem.appendChild(checkbox);
    newListItem.appendChild(p);
    newListItem.appendChild(button);
    tasksList.insertBefore(newListItem, tasksList.firstChild);
}
function modifyBk() {
    let mode = body.getAttribute('class');
    if (isDark == true) {
        document.getElementById("themeButton").style.backgroundImage = "url(images/icon-sun.svg)";
        isDark = false;
    }
    else {
        document.getElementById("themeButton").style.backgroundImage = "url(images/icon-moon.svg)";
        isDark = true;
    }
    mode === '' ? mode = 'light' : mode = 'dark';
    let iconMode = "";
    mode === 'dark' ? iconMode = 'sun' : iconMode = 'moon';
    let device = "";
    window.innerWidth > 800 ? device = 'desktop' : device = 'mobile';
    bkImage.setAttribute('src', `./images/bg-${device}-${mode}.jpg`);
    icon.setAttribute('alt', `${iconMode} icon`);
    modifyFiltersPosition(device);
}
function modifyFiltersPosition(device) {
    let containerToAppendFilters;
    if (device == 'desktop') {
        containerToAppendFilters = document.querySelector('.tasks-list .list-style:not(.list-item)');
        filters.classList.remove('list-style');
        // TODO: is this necessary?
        // containerToAppendFilters.insertBefore(filters, containerToAppendFilters.lastElementChild)
    }
    if (device == 'mobile') {
        containerToAppendFilters = document.querySelector('main');
        filters.classList.add('list-style');
        // TODO: is this necessary?
        // containerToAppendFilters.insertBefore(filters, containerToAppendFilters.lastElementChild)
    }
}
// drag and drop item
function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    let allTasks = document.querySelectorAll('.list-item');
    ev.dataTransfer.setData("text", ev.target.id);
    document.addEventListener('drag', (event) => {
        allTasks.forEach(task => {
            let heightDifference = event.clientY - task.getBoundingClientRect().top;
            if (heightDifference < 100 && heightDifference > 0) {
                let movedItemWillDropOnTopThisTask = document.querySelector('.add-draged-item-ontop');
                if (movedItemWillDropOnTopThisTask && movedItemWillDropOnTopThisTask != task) {
                    movedItemWillDropOnTopThisTask.classList.remove('add-draged-item-ontop');
                }
                task.classList.add('add-draged-item-ontop');
            }
        });
    });
}
function drop(ev) {
    ev.preventDefault();
    var dragedItemId = ev.dataTransfer.getData("text");
    let draggedItem = document.querySelector(`#${dragedItemId}`);
    ev.target.closest('li').parentElement.insertBefore(draggedItem, ev.target.closest('li'));
    document.querySelector('.add-draged-item-ontop').classList.remove('add-draged-item-ontop');
}
//# sourceMappingURL=main.js.map