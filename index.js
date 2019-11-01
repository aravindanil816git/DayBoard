
renderBoard();

function drag(event){
    if(event.dataTransfer)
        event.dataTransfer.setData("text",event.target.id);
}

function allowDrop(evt){
    evt.preventDefault();
}

function drop(evt){
    if(evt.target.dataset.status){
        evt.preventDefault();
        let taskEle = evt.dataTransfer.getData("text"); 
        let title = document.querySelector("#"+taskEle+" .status");
        let status = evt.target.dataset.status;

        title.innerHTML = status;
        evt.target.appendChild(document.getElementById(taskEle));
        updateToSessionStorage(taskEle,status);
    }
   
}

function addNewTask(){
    const taskName = document.getElementById('task-txt').value;
    let taskID  = 'task_'+1;
     if(sessionStorage.getItem('tasks')){
        taskID  = 'task_' + (JSON.parse(sessionStorage.getItem('tasks')).length + 1);
     }
    if(taskName){
        let taskObj = {
            'id': taskID,
            'name': taskName,
            'status':'new'
        }
        createTaskElement(taskName,'New',taskID);
        addToSessionStorage(taskObj)
    }
}

function removeTask(evt){
    if(evt.target.dataset.taskRel){
        let taskID = evt.target.dataset.taskRel;
        removeFromSessionStrg(taskID);
        document.getElementById(taskID).remove();
        
    }
}

function editTask(evt){
    if(evt.target.dataset.taskRel){
        let taskID = evt.target.dataset.taskRel;
        let task = document.querySelector('#'+ taskID);
        task.classList.remove('noedit');
        task.classList.add('edit');
        let taskName = document.querySelector('#'+ taskID + ' .task-title').textContent;
        document.querySelector('#'+ taskID + ' .edit-txt').value = taskName;
        
    }
}

function saveTask(evt){
    let el = this;
    let taskID = el.dataset.taskRel;
    let newTaskName = document.querySelector('#'+ taskID + ' .edit-txt').value;
    if(newTaskName){
        updateToSessionStorage(taskID,'',newTaskName);
        document.querySelector('#'+ taskID + ' .task-title').innerHTML = newTaskName;
        cancelorSaveTask(this,taskID);
    }
    else
        alert('Please enter valid input');
}

function cancelorSaveTask(evt,taskID){
    taskID = taskID ? taskID: evt.target.dataset.taskRel;
    let task = document.querySelector('#'+ taskID);
    task.classList.remove('edit');
    task.classList.add('noedit');
}

function createTaskElement(taskName,taskStatus,taskID){
    if(taskStatus){
    let task = document.createElement('div');
    task.classList .add('task', 'noedit');
    task.addEventListener('dragstart',drag,false);
    task.id = taskID;
    task.draggable = true;

    let title =document.createElement('h3');
    title.className = 'task-title';
    title.innerHTML =  taskName;

    let editTxt =document.createElement('input');
    editTxt.type = 'text';
    editTxt.className = 'edit-txt';
    editTxt.placeholder = 'Type a name for your task..';

    let status = document.createElement('span');
    status.className='status';
    status.textContent =taskStatus;
    
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.dataset.taskRel = taskID;
    editBtn.addEventListener('click',editTask,false);

    
    let dltBtn = document.createElement('button');
    dltBtn.textContent = 'Delete';
    dltBtn.addEventListener('click',removeTask,false);
    dltBtn.dataset.taskRel = taskID;

    let noEditBtns = document.createElement('div');
    noEditBtns.classList.add('no-edit-controls');
    noEditBtns.appendChild(editBtn);
    noEditBtns.appendChild(dltBtn);


    let saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.dataset.taskRel = taskID;
    saveBtn.addEventListener('click',saveTask,false);


    let canclBtn = document.createElement('button');
    canclBtn.textContent = 'Cancel';
    canclBtn.dataset.taskRel = taskID;
    canclBtn.addEventListener('click',cancelorSaveTask,false);

    let editBtns = document.createElement('div');
    editBtns.classList.add('edit-controls');
    editBtns.appendChild(saveBtn);
    editBtns.appendChild(canclBtn);


    task.appendChild(status);
    task.appendChild(title);
    task.appendChild(editTxt);
    task.appendChild(editBtns);
    task.appendChild(noEditBtns);


    switch(taskStatus.toLowerCase()){
        case 'new':
            document.querySelector('.new.task-col').appendChild(task);
            break;
        case 'active':
            document.querySelector('.active.task-col').appendChild(task);
            break;
        case 'completed':
            document.querySelector('.completed.task-col').appendChild(task);
            break;
    }
    
    }
}

function addToSessionStorage(taskObj){
    let taskArray  = [];
    if(sessionStorage.getItem('tasks')){
        taskArray  = JSON.parse(sessionStorage.getItem('tasks'));
    }
    taskArray.push(taskObj);
    sessionStorage.setItem('tasks',JSON.stringify(taskArray));
}

function updateToSessionStorage(taskID,newStatus,newName){
    if(taskID){
        let taskArray  = [];
        if(sessionStorage.getItem('tasks')){
            taskArray  = JSON.parse(sessionStorage.getItem('tasks'));
            let taskIndex = taskArray.findIndex(x => x.id===taskID);
            if(taskIndex < 0){
                alert('Error occured while saving');
                return;
            }
            taskArray[taskIndex].status  = newStatus ? newStatus: taskArray[taskIndex].status;
            taskArray[taskIndex].name  = newName ? newName: taskArray[taskIndex].name;
            sessionStorage.setItem('tasks',JSON.stringify(taskArray));
        };
    }   
}

function removeFromSessionStrg(taskID){
    if(taskID){
        let taskArray  = [];
        if(sessionStorage.getItem('tasks')){
            taskArray  = JSON.parse(sessionStorage.getItem('tasks'));
            let taskIndex = taskArray.findIndex(x => x.id===taskID);
            if(taskIndex < 0){
                alert('Error occured while saving');
                return;
            }
            taskArray.splice(taskIndex,1);
            sessionStorage.setItem('tasks',JSON.stringify(taskArray));
        };
    }   
}

function renderBoard(){
    let title = document.querySelector('.dayboard-title h1');
    let date = new Date();
    title.innerHTML = title.innerHTML + ' - ' + (date.getFullYear() + "/"+ date.getMonth() + "/"+date.getDate());
    if(sessionStorage.getItem('tasks')){
        let taskArray  = JSON.parse(sessionStorage.getItem('tasks'));
        taskArray.forEach(function(task) {
            createTaskElement(task.name,task.status,task.id)
        }, this);
    }
}