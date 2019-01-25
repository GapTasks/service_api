const express = require('express');
const handlers = require('./users.handlers');

const usersRouter = express.Router();

usersRouter.post('/users', handlers.addNewUser);
usersRouter.get('/users/:id', handlers.getUser);
usersRouter.patch('/users/:id', handlers.updateUser);
usersRouter.delete('/users/:id', handlers.deleteUser);

module.exports = usersRouter;
