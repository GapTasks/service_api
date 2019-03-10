const friendship = require('../../model/friendship.model');
const userModel = require('../../model/user.model');
const logger = require('winstonson')(module);
const response = require('./response');
const httpStatus = require('http-status');

module.exports = {
    userSuggestions,
    getFriendships,
    addFriend,
    acceptFriend,
    denyFriend
};

function generateRestSuggestionResponse(search, users) {
    let self = '/user_suggestions/' + search;
    return {
        ...users,
        _links: {
            self
        }
    };
}

function generateRestResponse(friendship) {
    let self = '/frienships/' + friendship.id;
    return {
        ...friendship,
        _links: {
            self
        }
    };
}

async function  userSuggestions(req, res){
    try {
        const search = req.query.query;
        const pattern = new RegExp(`^${search}`);
        let users = await userModel.find({username: {$regex: pattern}});
        let resBody = generateRestSuggestionResponse(search, users);
        return response.sendOkResponse(res, httpStatus.CREATED, 'Successfully fetched suggestions', resBody);
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get suggestions');
    }
}

async function addFriend(req, res){
    try{
        const friend = req.body.friend;
        const username = req.user.sub;
        let newFriendship = new friendship.Friendship({friend1: username, friend2: friend, status: "initiated", initiator: username}, false);
        await friendship.merge(newFriendship)
        let resBody = generateRestResponse({newFriendship});
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully initiated friendship', resBody);
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to request friend');
    }
}

async function getFriendships(req, res){
    try{
        const username = req.user.sub;
        const friendships = await friendship.find({$or: [{friend1: username}, {friend2: username}]});
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully initiated friendship', {friendships, username});
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get friends');
    }
}

async function acceptFriend(req, res){
    try{
        const username = req.user.sub;
        const friend = req.body.friend;
        const friendship = {friend1: friend, friend2: username, status:"accepted", initiator: friend}
        const status = await friendship.merge({friendship});
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully accepted friendship', {status});
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to accept friend');
    }
}

async function denyFriend(req, res){
    try{
        const username = req.user.sub;
        const friend = req.body.friend;
        const friendship = {friend1: friend, friend2: username, status:"denied", initiator: friend}
        const status = await friendship.merge({friendship});
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully denied friendship', {status});
    }catch(err){
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to deny friend');
    }
}
/*
async function  get_user(req, res){
    try {

    }catch(err){

    }
}

async function  friends(req, res){
    try {

    }catch(err){

    }
}*/