const projectsContainer = document.querySelector('[data-projects]');
const newProjectForm = document.querySelector('[data-new-project-form]');
const newProjectInput = document.querySelector('[data-new-project-input]');
const deleteProjectButton = document.querySelector('[data-delete-project-button]');
const projectDisplayContainer = document.querySelector('[data-project-display-container]');
const projectTitleElement = document.querySelector('[data-project-title]');
const tasksContainer = document.querySelector('[data-tasks-container]');
const taskTemplate = document.getElementById('task-template');
const newTaskForm = document.querySelector('[data-new-task-form]');
const newTaskInput = document.querySelector('[data-new-task-input]');
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]');
const projectBtnContainer = document.querySelector('[data-project-button-container]');

const addProjectBtn = document.querySelector('[data-add-project-button]');
const projectModal = document.querySelector('[data-project-bg-modal]');
const closeProjectFormBtn = document.querySelector('[data-close-project-btn]');

const addTaskBtn = document.querySelector('[data-add-task-button]');
const taskModal = document.querySelector('[data-task-bg-modal]');
const closeTaskFormBtn = document.querySelector('[data-close-task-btn]');
const navProjects = document.querySelector('[data-nav-projects]');
const navAddProjectBtn = document.querySelector('[data-nav-add-project]');
const startHeadingContainer = document.querySelector('[data-start-heading]');
const deleteBtnsContainer = document.querySelector('[data-delete-btns-container]');




//const LOCAL_STORAGE_PROJECT_KEY = 'tasks.projects';
//const LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY = 'tasks.selectedProjectId';
//let projects = JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let projects = [];
//let selectedProjectId = localStorage.getItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY);
let selectedProjectId = null;
let projectsDisplayed = false;






// IDENTIFY THE CURRENT PROJECT WHEN PROJECT IS CLICKED
projectsContainer.addEventListener('click', e => {     // when the user clicks on the projects container:
    if (e.target.tagName.toLowerCase() === 'li') {   // if the user selects a list element (project) 
        selectedProjectId = e.target.dataset.projectId;   // update the selectedProjectId assignment to equal the same data set id as the list item that has been clicked
        //saveAndRender();          // save and update 
        addTaskBtn.style.display = '';
        deleteBtnsContainer.style.display = '';
        render();
    };
});


// UPDATE THE "COMPLETE" STATUS OF THE TASKS IN THE CURRENT PROJECT WHEN THEY ARE CHECKED
tasksContainer.addEventListener('click', e => {     // focus on the thing the user clicks in the task container
    if (e.target.tagName.toLowerCase() === 'input') {     // if the user has clicked the input text box
    let selectedProject;
    if (projects.length == 1) {
        selectedProject = projects[0];
        selectedProjectId = selectedProject.id;
    } else {
        selectedProject = projects.find(project => project.id === selectedProjectId)   // search the projects array for the current project (the object with an id that matches the currently known selectedProjectId)
    };
    const selectedTask = selectedProject.tasks.find(task => task.id === e.target.id);   // then find the task in the current project that matches the task the user has clicked on 
    selectedTask.complete = e.target.checked;  // assign the task object's 'complete' property to 'true' while checking the box             
    //save();   
    };
});

// CLEAR COMPLETED TASKS
clearCompleteTasksButton.addEventListener('click', e => {
    let selectedProject;
    if (projects.length == 1) {
        selectedProject = projects[0];
        selectedProjectId = selectedProject.id;
    } else {
        selectedProject = projects.find(project => project.id === selectedProjectId)   // search the projects array for the current project (the object with an id that matches the currently known selectedProjectId)
    };          
    selectedProject.tasks = selectedProject.tasks.filter(task => !task.complete);   // transform the task array of the current project to a new array that only includes task that are not complete (AKA task objects with complete property set to "false")
    //saveAndRender();  // save and update page
    render();
});


// DELETE PROJECT
deleteProjectButton.addEventListener('click', e => {   // when the delete button is clicked
    projects = projects.filter(project => project.id !== selectedProjectId); // transform the projects array to a new array that includes every project except for the currently selected one
    selectedProjectId = null; // the selected project was just removed, so make the selectedProjectId stands by (until a project is clicked again)
    if (projects.length < 1) {
        addTaskBtn.style.display = 'none';
        deleteBtnsContainer.style.display = 'none';
    };
    //saveAndRender();  // save and update page
    render();
});


// UPDATE PROJECTS ARRAY WHEN NEW PROJECT IS ENTERED BY USER
newProjectForm.addEventListener('submit', e => {   // when new project is submitted
    e.preventDefault();
    const projectName = newProjectInput.value;   // create variable to store user text box input. (User input, AKA 'newProject Input' is selected for with the other DOM selectors)
    if (projectName == null || projectName === '') return;  // if user doesn't enter anything, do nothing
    const project = createProject(projectName);   // invoke 'project factory' createProject to create project object that will be stored in the selected project array
    selectedProjectId = project.id;
    newProjectInput.value = null;
    projects.push(project);   // add project to array of projects
    addTaskBtn.style.display = '';
    deleteBtnsContainer.style.display = '';
    //saveAndRender();   // store new data and update page display w/ new project
    projectModal.style.display = 'none';
    projectsContainer.style.display = 'none';
    projectsDisplayed = false;
    
    render();
});


// UPDATE TASKS ARRAY OF CURRENT PROJECT WHEN NEW TASK IS ENTERED
newTaskForm.addEventListener('submit', e => {      // when new task is submitted
    e.preventDefault();
    const taskName = newTaskInput.value;   // create variable to store the submitted textbox value (name of the new task).
    if (taskName == null || taskName === '') return  // if user doesn't enter anything (or if they enter an empty string) do nothing
    const task = createTask(taskName)    // invoke 'task factory' createTask to create a new task object that will be stored in the selected project's task array
    console.log(task);
    newTaskInput.value = null  // reset the value of the text box
    let selectedProject;
    if (projects.length == 1) {
        selectedProject = projects[0];
        selectedProjectId = selectedProject.id;
    } else {
        selectedProject = projects.find(project => project.id === selectedProjectId)   // search the projects array for the current project (the object with an id that matches the currently known selectedProjectId)
    };
    selectedProject.tasks.push(task);        // add new task object to current project's task array
    //saveAndRender();        // store new data and update page display w/ new tasks
    taskModal.style.display = 'none';
    render();
});


// PROJECT OBJECT FACTORY
function createProject(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }    // each project will have a unique id (also explained in task factory below), a name property, and an array (that will be filled w/ task objects)
};


// TASK OBJECT FACTORY
function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false } // when dynamically creating task from user input, assign task unique string id using Date.now(). This id will be used to access task object later. Also give task a name property and "complete" property to store completion status
};



//function saveAndRender() {     
//    save();
//    render();
//};


// SAVE UPDATES TO LOCAL STORAGE
//   function save() {
//    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(projects));  
//    localStorage.setItem(LOCAL_STORAGE_SELECTED_PROJECT_ID_KEY, selectedProjectId);
//};


// CLEAR OLD HTML AND UPDATE PAGE WITH NEW HTML
function render() {
    clearElement(projectsContainer);  // remove all current project html (which is theoretically not up to date with the current projects array)
    renderProjects();  // create new html that is up to date with projects array

    let selectedProject;


    if (projects.length == 1) {
        selectedProject = projects[0];
        selectedProjectId = selectedProject.id;
    } else {
        selectedProject = projects.find(project => project.id === selectedProjectId)   // search the projects array for the current project (the object with an id that matches the currently known selectedProjectId)
    };



    if (selectedProjectId == null) {  // if there is no currently selected project (because it was just deleted, for example)
        projectDisplayContainer.style.display = 'none';  // do not display the project display container (which contains the tasks)
        projectTitleElement.innerText = '';
        if (projects.length < 1) {
            clearElement(tasksContainer);
        }
    } else {  // if there IS a currently selected project
        projectDisplayContainer.style.display = '';  // display the tasks of the currently selected project
        projectTitleElement.innerText = selectedProject.name; // add a heading for the currently selected project
        clearElement(tasksContainer);  // remove all current task html (which is theoretically not up to date with the current project's task array)
        renderTasks(selectedProject); // create new html for the tasks of the up to date current project's task array
    };


    moveProjectButton();
};


// ADD HTML FOR EACH PROJECT IN PROJECT ARRAY
function renderProjects() {
    projects.forEach(project => {   // for each project in the projects array:
        const projectElement = document.createElement('li');   // create an html list element
        projectElement.dataset.projectId = project.id;     //   give the list element a new data attribute - data-project-id - that is set to the current project object's unique id property. will look something like " data-project-id = '0579075'  " in the html
        projectElement.classList.add('project-name');     // give the list element (and therefore all project list elements) a class of 'project-name'
        projectElement.innerText = project.name;   // set the text of the list element equal to the name property of the current project object
        if (project.id === selectedProjectId) {         // while we are going through each project object in the projects array, IF the project object is the currently selected project:
            projectElement.classList.add('active-project');  // give the list element a class of "active-project". Will use this to style the current project.
        };
        projectElement.addEventListener('click', () => {
            projectsContainer.style.display = 'none';
            projectsDisplayed = false;
        });
        projectsContainer.appendChild(projectElement); // add the list element to the projects container
    });
};


function renderTasks(selectedProject) {
    selectedProject.tasks.forEach(task => {    // for each task within the current project's array of tasks:
        const taskElement = document.importNode(taskTemplate.content, true);   // create an html element that has the structure of the html task template 
        const checkbox = taskElement.querySelector('input'); // select for the checkbox element within the task template
        checkbox.id = task.id;   // set the reference for the checkbox to the current task
        checkbox.checked = task.complete;   // if the task object is complete, check the checkbox
        const label = taskElement.querySelector('label');    // select for the label element within the task element
        label.htmlFor = task.id;    // set the reference for the label to the current task
        label.append(task.name);    // set the text of the label to equal to the task object name 
        tasksContainer.appendChild(taskElement);    // add the new taskElement to the tasks container
    });
};


// CLEAR THE HTML OF PROJECT OR TASK CONTAINER
function clearElement(element) {   // take an element (in our case either the project container or task container):
    while (element.firstChild) {     // for each first child the element has
        element.removeChild(element.firstChild);   // remove that child
    };
};




// LOAD THE NEW PROJECT FORM
function loadProjectForm() {
    projectModal.style.display = 'none'; // by default, hide the modal the project form
    addProjectBtn.addEventListener('click', displayProjectModal);
    navAddProjectBtn.addEventListener('click', displayProjectModal);
};

function displayProjectModal() {
    projectModal.style.display = 'flex'; // load the project form modal
};


// CLOSE THE PROJECT FORM
function closeProjectForm() {
    closeProjectFormBtn.addEventListener('click', function() {
        projectModal.style.display = 'none';
    });
};


function loadTaskForm() {
    taskModal.style.display = 'none';
    addTaskBtn.addEventListener('click', function() {
        taskModal.style.display = 'flex';
    });
};

function closeTaskForm() {
    closeTaskFormBtn.addEventListener('click', () => {
        taskModal.style.display = 'none';
    });
};

function moveProjectButton() {
    if (projects.length > 0 && projectBtnContainer.contains(addProjectBtn)) { // if there are existing projects and main add project button is currently displayed (will happen after first project)
        projectBtnContainer.removeChild(addProjectBtn);  // hide the add project button 
        projectsContainer.appendChild(navAddProjectBtn);
        startHeadingContainer.style.display = 'none';
        return;
    } else if (projects.length < 1 && !projectBtnContainer.contains(addProjectBtn)) {   // if there are no projects and main add project button is not dispayed (this will only happen if projects have been deleted)
        projectBtnContainer.appendChild(addProjectBtn);
        projectsContainer.appendChild(navAddProjectBtn);
        return;
    } else {
        projectsContainer.appendChild(navAddProjectBtn);
    };
};


function displayProjects() {
    navProjects.addEventListener('click', () => {
        if (!projectsDisplayed) {
        projectsContainer.style.display = '';
        projectsDisplayed = true;
        } else if (projectsDisplayed) {
            projectsContainer.style.display = 'none';
            projectsDisplayed = false;
        };
    });
};


addTaskBtn.style.display = 'none';
deleteBtnsContainer.style.display = 'none';
projectsContainer.style.display = 'none';
//projectsContainer.style.display = 'none';
render();
loadProjectForm();
loadTaskForm();
closeProjectForm();
closeTaskForm();
displayProjects();
