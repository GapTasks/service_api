const express = require('express');
const handlers = require('./chat.handlers');

const chatApi = express.Router();

chatApi.get('/chat', handlers.getChatForRoom);
chatApi.post('/chat', handlers.sendChatToRoom);

//chatApi.get('/friends', handlers.getAllStacks);


module.exports = chatApi;