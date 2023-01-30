const bkImage : Element | null = document.querySelector('.bk-image')
const body : HTMLBodyElement | null = document.querySelector('body')
const icon : Element | null = document.querySelector('.icon')
const tasksList : Element | null = document.querySelector('.tasks-list')
const itemsLeft : Element | null = document.querySelector('.items-left')
const clearCompletedBtn : Element | null = document.querySelector('.clear-completed-btn')
const activeBtn : Element | null = document.querySelector('.active-btn')
const completedBtn : Element | null = document.querySelector('.completed-btn')
const allBtn : Element | null = document.querySelector('.all-btn')
const filters : Element | null = document.querySelector('.filters')


// if prefers dark mode:
if (!window.matchMedia || window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark')
}

// on load determine which picture to choose for background
modifyBk()

// on load calculate active tasks
let initialTaskAmount: any = calculateActiveTasks()
sessionStorage.setItem('id', initialTaskAmount)

// update background
window.addEventListener('resize', e=>{
    modifyBk()
    modifyFiltersPosition(e)
})

document.addEventListener('click', e=>{
    // check task as completed/active if clicked
    checkTaskOnClick(e.target)
    // check if person clicked on delete
    deleteTaskOnClick(e.target)
    // check if wants to clear completed
    clearCompleted(e.target)
    // check if person clicked on filters
    filtersClicked(e.target)
    // if person clicked to change mode
    changeMode(e.target)
})

document.addEventListener('keypress', e=>{
    if (e.key === 'Enter'){
        let inputField : Element | null = document.querySelector('.new-todo')
        let taskText = ""
        if(this.inputField.value.length > 0){
            taskText = this.inputField.value
            createNewListItemInDom(taskText)
            this.inputField.value = ""
        }
        // recalculate active tasks
        calculateActiveTasks()
        // refresh filter
        let filterBtn = document.querySelector('.active')
        filter(filterBtn)
    }
})



function changeMode(eventTarget){
    if (eventTarget == icon){
        this.body.classList.toggle('dark')
        this.body.classList.toggle('light')
    }
    modifyBk()
}

function filtersClicked(eventTarget){
    if (eventTarget.closest('ul') == filters){
        if (eventTarget == activeBtn || 
            eventTarget == completedBtn || 
            eventTarget == allBtn){
            filter(eventTarget)
        }
    }
}

function filter(filterBtn){
    let previousActiveFilter : Element | null = document.querySelector('.active')
    this.previousActiveFilter.classList.remove('active')
    // unhide all hidden tasks
    let tasksToUnhide = document.querySelectorAll('.hidden')
    tasksToUnhide.forEach( task =>{
        task.classList.remove('hidden')
    })

    filterBtn.classList.add('active')
    let tasksClassToHide = ""
    switch (filterBtn) {
        case activeBtn:
            tasksClassToHide = '.checked'
            break;
        case completedBtn:
            tasksClassToHide='.list-item:not(.checked)'
            break;
        case allBtn:
            tasksClassToHide = ''
            break;
    }

    if (tasksClassToHide.length > 0){
    let tasksToHide = document.querySelectorAll(tasksClassToHide)
        tasksToHide.forEach(task =>{
            if (!task.classList.contains('hidden')){
                task.classList.add('hidden')
            }
        })
    }   
}

function checkTaskOnClick(eventTarget){
    if (eventTarget.closest('ul') == tasksList){
        let allTasks = document.querySelectorAll('.list-item')
        allTasks.forEach(task =>{
            if (eventTarget.closest('li') == task){
                task.classList.toggle('checked')
                let ariaStatus = this.task.firstElementChild.getAttribute('aria-checked')
                ariaStatus == 'true' ? ariaStatus = 'false' : ariaStatus = 'true'
                this.task.firstElementChild.setAttribute('aria-checked', ariaStatus)
            }
        })
        // recalculate active tasks
        calculateActiveTasks()
        // refresh filter
        let filterBtn = document.querySelector('.active')
        filter(filterBtn)
    }
}

function calculateActiveTasks(){
    let activeTasks = document.querySelectorAll('.list-item:not(.checked)').length
    this.itemsLeft.innerText = `${activeTasks} items left`
    return activeTasks
}

function deleteTaskOnClick(eventTarget){
    let closestBtn = eventTarget.closest('button')
    if (closestBtn && closestBtn.classList.contains('delete-btn')){
        closestBtn.parentElement.remove()
   }
   calculateActiveTasks()
}

function clearCompleted(eventTarget){
    if (eventTarget == clearCompletedBtn){
        let checkedTasks = document.querySelectorAll('.checked')
        checkedTasks.forEach(task =>{
            task.remove()
        })
    }
}

function createNewListItemInDom(taskText){
    let newId = this.sessionStorage.getItem('id') + 1
    sessionStorage.setItem('id', newId)
    let newListItem = document.createElement('li')
    newListItem.classList.add('list-style')
    newListItem.classList.add('list-item')
    newListItem.setAttribute('draggable', 'true')
    newListItem.setAttribute('ondragstart', 'drag(event)')
    newListItem.setAttribute('ondragover', 'allowDrop(event)')
    newListItem.setAttribute('ondrop', 'drop(event)')
    newListItem.setAttribute('id', `task${newId}`)
    let checkbox = document.createElement('div')
    checkbox.classList.add('checkbox')
    checkbox.setAttribute('role', 'checkbox')
    checkbox.setAttribute('aria-label', taskText)
    let innerShape = document.createElement('div')
    innerShape.classList.add('inner-shape')
    let checkIcon = document.createElement('img')
    checkIcon.setAttribute('src', './images/icon-check.svg')
    checkIcon.setAttribute("alt", 'check symbol')
    checkbox.appendChild(innerShape)
    checkbox.appendChild(checkIcon)
    let p = document.createElement('p')
    let newText = document.createTextNode(taskText)
    p.appendChild(newText)
    let button = document.createElement('button')
    button.classList.add('delete-btn')
    let crossIcon = document.createElement('img')
    crossIcon.setAttribute("src", './images/icon-cross.svg')
    crossIcon.setAttribute("alt", 'cross-icon')
    button.appendChild(crossIcon)
    newListItem.appendChild(checkbox)
    newListItem.appendChild(p)
    newListItem.appendChild(button)
    this.tasksList.insertBefore(newListItem, this.tasksList.firstChild)
}

function modifyBk(){
    let mode = this.body.getAttribute('class')
    mode == '' ? mode = 'light' : mode = 'dark'
    let iconMode = ""
    mode == 'dark' ? iconMode = 'sun' : iconMode = 'moon' 
    let device = ""
    window.innerWidth > 800 ? device = 'desktop' : device = 'mobile'
    this.bkImage.setAttribute('src', `./images/bg-${device}-${mode}.jpg`)
    this.icon.setAttribute('src', `./images/icon-${iconMode}.svg`)
    this.icon.setAttribute('alt', `${iconMode} icon`)
    modifyFiltersPosition(device)
}

function  modifyFiltersPosition(device){
    let containerToAppendFilters
    if (device == 'desktop'){
        containerToAppendFilters = document.querySelector('.tasks-list .list-style:not(.list-item)')
        this.filters.classList.remove('list-style')
        containerToAppendFilters.insertBefore(filters, containerToAppendFilters.lastElementChild)
    } 
    if (device == 'mobile'){
        containerToAppendFilters = document.querySelector('main')
        this.filters.classList.add('list-style')
        containerToAppendFilters.insertBefore(filters, containerToAppendFilters.lastElementChild)
    }
}

// drag and drop item
function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    let allTasks = document.querySelectorAll('.list-item')
    ev.dataTransfer.setData("text", ev.target.id);
    document.addEventListener('drag', (event) => {
        allTasks.forEach(task=>{
            let heightDifference = event.clientY - task.getBoundingClientRect().top
            if (heightDifference < 100 && heightDifference > 0){
                let movedItemWillDropOnTopThisTask = document.querySelector('.add-draged-item-ontop')
                if (movedItemWillDropOnTopThisTask && movedItemWillDropOnTopThisTask != task ){
                    movedItemWillDropOnTopThisTask.classList.remove('add-draged-item-ontop')
                }
                task.classList.add('add-draged-item-ontop')
            }
        })
    })
}

function drop(ev) {
    ev.preventDefault();
    var dragedItemId = ev.dataTransfer.getData("text");
    let draggedItem = document.querySelector(`#${dragedItemId}`)
    ev.target.closest('li').parentElement.insertBefore(draggedItem, ev.target.closest('li'));
    this.document.querySelector('.add-draged-item-ontop').classList.remove('add-draged-item-ontop')
}
