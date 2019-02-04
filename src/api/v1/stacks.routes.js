const express = require('express');
const handlers = require('./stacks.handlers');

const stacksApi = express.Router();

stacksApi.post('/stacks', handlers.addStack);
stacksApi.get('/stacks/:id?', handlers.getStack);
stacksApi.patch('/stacks/:id', handlers.updateStack);
stacksApi.delete('/stacks/:id', handlers.deleteStack);

module.exports = stacksApi;