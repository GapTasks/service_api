const express = require('express');
const handlers = require('./friends.handlers');

const stacksApi = express.Router();

stacksApi.get('/user_suggestions', handlers.userSuggestions);
stacksApi.post('/add_friend', handlers.addFriend);
stacksApi.get('/friendships', handlers.getFriendships);
stacksApi.post('/accept_friend', handlers.acceptFriend);
stacksApi.post('/deny_friend', handlers.denyFriend);
//stacksApi.get('/friends', handlers.getAllStacks);


module.exports = stacksApi;