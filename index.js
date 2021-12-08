const express = require('express');

const server = express();

server.use(express.json());

/*
projects = [{
    "id": 0
    "title": "random-stuff"
    "tasks": ["task1", "task2"]
}] 
*/

const projects = [];

//^Middleware
function checkProjectInArray(req, res, next){
    const project = projects[req.params.index];
    console.log(project);

    if(!project){
        return res.status(400).json({error: "Project doesn't exists!"});
    }

    req.project = project;
    return next();
}

//todo-------------------------------------------------------------
server.post('/projects', (req, res) => {
    const { id, title, tasks } = req.body;
    projects.push({id, title, tasks});
    
    return res.json(projects);
})

server.post('/projects/:index/tasks', checkProjectInArray, (req, res) => {
    const { index } = req.params;
    const { task } = req.body;
    console.log("Project -> ", projects)
    projects[index].tasks.push(task);
    console.log("Task ->",task);
    return res.json(projects);
});

//*----------------------------------------------------------------
server.get('/projects/:index', checkProjectInArray, (req, res) => {
    const project = req.project;
    return res.json(project);

});

server.get('/projects/:index/tasks', checkProjectInArray, (req, res) => {
    return res.json(req.project.tasks);

});

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.delete('/projects/:index', (req, res) =>{
    const { params: {index} } = req;
    projects.splice(index, 1);
    return res.send();
});
server.listen(3000);