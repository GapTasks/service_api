const tasks = require('../../model/task.model');
const logger = require('winstonson')(module);
const response = require('./response');
const httpStatus = require('http-status');

function generateRestResponse(task) {
    let self = '/tasks/' + task.id;
    return {
        ...task,
        _links: {
            self
        }
    };
}

module.exports = {
    addTask,
    deleteTask,
    completeTask,
    updateTask,
    getTask,
    getAllTasks,
    searchTasks
}

async function addTask(req, res){
    try{
        let newTask = new tasks.Task(req.body);
        await tasks.merge(newTask);
        let resBody = generateRestResponse(newTask);
        return response.sendOkResponse(res, httpStatus.CREATED, 'Successfully added new task', resBody);
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create task');
    }
}

async function deleteTask(req, res){
    try{
        await tasks.remove(req.params.id);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully removed the task');
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to remove task');
    }
}

async function completeTask(req, res){
    try{

    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to complete task');
    }
}

async function updateTask(req, res){
    try{
        req.body.id = req.params.id;
        let task = await tasks.merge(req.body);
        let resBody = generateRestResponse(task);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully updated task', resBody);
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to change task');
    }
}

async function getTask(req, res){
    try{
        let requestedID = req.params ? req.params.id : undefined
        if(!requestedID){
            return await getAllTasks(req, res);
        }
        let task = await tasks.find({ id: requestedID });
        let resBody = generateRestResponse(task);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved task', resBody);
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get task');
    }
}

async function getAllTasks(req, res){
    try{
        let allTasks = await tasks.all();
        let resBody = generateRestResponse(allTasks);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved tasks', resBody);
    }catch (err){
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get tasks');
    }
}

async function searchTasks(req, res){
    try{
        let task = await tasks.find({ ...req.params });
        let resBody = generateRestResponse(task);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved task', resBody);
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get task');
    }
}