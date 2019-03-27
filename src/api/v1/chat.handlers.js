const logger = require('winstonson')(module);
const response = require('./response');
const httpStatus = require('http-status');
const chatkit = require('../../util/chatkit')

module.exports = {
    getChatForRoom,
    sendChatToRoom
};

async function getChatForRoom(req, res) {
    try{
        let self = "";
        const user = req.user.sub;
        const room = req.query.room
        let messages = await chatkit.fetchMessagesFromRoom({room})
        messages = messages.map((message, key)=>{
            message.isMe = req.user.sub == message.user_id
            return message;
        })
        return response.sendOkResponse(res, httpStatus.CREATED, 'Successfully got chat from room', messages);
    } catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get chat from room');
    }


}

async function sendChatToRoom(req, res) {
    let self = "";
    try{
        let self = "";
        const user = req.user.sub;
        const room = req.body.room;
        const status = await chatkit.sendMessage({userId: user, roomId: room, text: req.body.text})
        return response.sendOkResponse(res, httpStatus.CREATED, 'Successfully sent chat to room', status);
    } catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to send chat to room');
    }
}