
const Chatkit = require('@pusher/chatkit-server');
const config = require('config');
const chatkitConfig = config.get("chatkit")

const chatkit = new Chatkit.default({
    instanceLocator: chatkitConfig.instanceLocator,
    key: chatkitConfig.key,
})


function createChatkitUser({userId, name, customData}){
    return chatkit.createUser({
        id: userId,
        name: name,
    })
}

function getUser({userId}, callback){
    return chatkit.getUser({
        id: userId,
      })
}

function createRoom({userId, taskId, customData}){
    return chatkit.createRoom({
        creatorId: userId,
        name: taskId,
        customData: customData,
      })
}

function getRoom({roomId}){
  return chatkit.getRoom({
    roomId: roomId,
  })
}

function addUsersToRoom({roomId, users}){
  return chatkit.addUsersToRoom({
    roomId: roomId,
    userIds: users
  })
}

function deleteRoom({roomId}){
  chatkit.deleteRoom({
    id: roomId
  })
}

function sendMessage({userId, roomId, text}){
  chatkit.sendSimpleMessage({
    userId: userId,
    roomId: roomId,
    text: text,
  })
}

function fetchMessagesFromRoom({roomId}, limit=10){
  chatkit.fetchMultipartMessages({
    roomId: room.id,
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