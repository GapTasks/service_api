const express = require('express');
const handlers = require('./tasks.handlers');

const tasksAPi = express.Router();

tasksAPi.post('/tasks', handlers.addTask);
tasksAPi.get('/tasks', handlers.getAllTasks);
tasksAPi.get('/tasks/:id', handlers.getTask);
tasksAPi.get('/search_tasks', handlers.searchTasks);
tasksAPi.patch('/tasks/:id', handlers.updateTask);
tasksAPi.delete('/tasks/:id', handlers.deleteTask);

module.exports = tasksAPi;