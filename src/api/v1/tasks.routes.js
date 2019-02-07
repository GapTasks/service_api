const express = require('express');
const handlers = require('./tasks.handlers');

const stacksApi = express.Router();

stacksApi.post('/tasks', handlers.addTask);
stacksApi.get('/tasks/:id?', handlers.getTask);
stacksApi.get('/search_tasks', handlers.searchTasks);
stacksApi.patch('/tasks/:id', handlers.updateTask);
stacksApi.delete('/tasks/:id', handlers.deleteTask);

module.exports = stacksApi;