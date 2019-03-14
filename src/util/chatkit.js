
const Chatkit = require('@pusher/chatkit-server');
const config = require('config');
const chatkitConfig = config.get("chatkit")
const tasks = require('../model/task.model');

const chatkit = new Chatkit.default({
    instanceLocator: chatkitConfig.instanceLocator,
    key: chatkitConfig.key,
})


async function createChatkitUser({userId, name, customData}){
    return chatkit.createUser({
        id: userId,
        name: name,
    })
}

async function getUser({userId}, callback){
    return chatkit.getUser({
        id: userId,
      })
}

async function createRoom({userId, taskId, customData}){
    return chatkit.createRoom({
        creatorId: userId,
        name: taskId,
        customData: customData,
      })
}

async function getRoom({roomId}){
  return chatkit.getRoom({
    roomId: roomId,
  })
}

async function addUsersToRoom({roomId, users}){
  return chatkit.addUsersToRoom({
    roomId: roomId,
    userIds: users
  })
}

async function deleteRoom({roomId}){
  return chatkit.deleteRoom({
    id: roomId
  })
}

async function sendMessage({userId, roomId, text}){
  let task = await tasks.find({ id: roomId });
  const chatRoomId = task[0].chatRoomId;
  return chatkit.sendSimpleMessage({
    userId: userId,
    roomId: chatRoomId,
    text: text,
  })
}

async function fetchMessagesFromRoom({room}, limit=10){
  let task = await tasks.find({ id: room });
  const chatRoomId = task[0].chatRoomId;
  return chatkit.fetchMultipartMessages({
    roomId: chatRoomId,
    limit: limit,
  })
}

module.exports = {
    createChatkitUser,
    getUser,
    createRoom,
    addUsersToRoom,
    getRoom,
    deleteRoom,
    sendMessage,
    fetchMessagesFromRoom
}