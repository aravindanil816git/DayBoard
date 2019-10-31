
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
        let title = document.querySelector("#"+taskEle+" .task-title .status");
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
        taskID  = 'task_' +JSON.parse(sessionStorage.getItem('tasks')).length + 1;
     }
    if(taskName){
        let taskObj = {
            'id': 'task_'+taskID,
            'name': taskName,
            'status':'new'
        }
        createTaskElement(taskName,'New',taskID);
        addToSessionStorage(taskObj)
    }
}


function createTaskElement(taskName,taskStatus,taskID){
    if(taskStatus){
    let task = document.createElement('div');
    task.classList = ['task'];
    task.addEventListener('dragstart',drag,false);
    task.id = taskID;
    task.draggable = true;

    let title =document.createElement('h5');
    title.className = 'task-title';
    

    let status = document.createElement('span');
    status.className='status';
    status.textContent =taskStatus;
    title.appendChild(status);
    title.innerHTML = title.innerHTML +' ' + taskName;
    

    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';

    
    let dltBtn = document.createElement('button');
    dltBtn.textContent = 'Delete';
    task.appendChild(title);
    task.appendChild(editBtn);
    task.appendChild(dltBtn);

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
            taskArray[taskIndex].status  = newStatus;
            taskArray[taskIndex].name  = newName ? newName: taskArray[taskIndex].name;
            sessionStorage.setItem('tasks',JSON.stringify(taskArray));
        };
    }   
}

function renderBoard(){
    if(sessionStorage.getItem('tasks')){
        let taskArray  = JSON.parse(sessionStorage.getItem('tasks'));
        taskArray.forEach(function(task) {
            createTaskElement(task.name,task.status,task.id)
        }, this);
    }
}