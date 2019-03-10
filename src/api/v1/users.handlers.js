const UserModel = require('../../model/user.model');
const AuthModel = require('../../model/auth.model');
const { hash } = require('./auth.handlers');
const response = require('./response');
const status = require('http-status');
const logger = require('winstonson')(module);
const crypto = require('crypto');
const config = require('config');
const _config = config.get('security');

module.exports = {
    getUser,
    addNewUser,
    updateUser,
    deleteUser,
    prepUserResponse
};

function generateResourceUrl(user) {
    return `http://localhost:8080/api/v1/users/${user.id}`;
}

function prepUserResponse(user) {
    let self = generateResourceUrl(user);
    user._links = {
        self,
        tasks: self + '/tasks',
        goals: self + '/goals',
        objectives: self + '/objectives'
    };
}

async function addNewUser(req, res) {
    try {
        if (!req.body.username || !req.body.password) {
            return response.sendErrorResponse(res, status.BAD_REQUEST, 'Missing username and/or password');
        }
        logger.trace('Verifying user does not already exist');
        let users = await UserModel.find({ username: req.body.username });
        if (users.length > 0) {
            return response.sendOkResponse(res, status.OK, 'User already exists', user);
        }
        logger.trace('Adding new user with username ' + req.body.username);
        let user = new UserModel.User(req.body);
        user.lastLogin = Date.now();
        user = await UserModel.merge(user);
        logger.trace('Added user. Generating authentication entry');
        let salt = crypto.randomBytes(8).toString('hex');
        let algo = _config.hashAlgo;
        let h = hash(algo, salt, req.body.password);
        await AuthModel.merge(new AuthModel.AuthInfo({ user: user.id, salt, algo, hash: h }));
        logger.trace('Authentication entry added. Preparing response');
        prepUserResponse(user);
        return response.sendOkResponse(res, status.CREATED, 'Successfully created new user', user);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to create a new user');
    }
}

async function getUser(req, res) {
    try {
        logger.trace('Retrieving user');
        let users = await UserModel.find({ id: req.params.id });
        if (users.length === 0) {
            return response.sendErrorResponse(res, status.NOT_FOUND, 'Failed to find user');
        }
        let user = users[0];
        prepUserResponse(user);
        return response.sendOkResponse(res, status.OK, 'Successfully found user', user);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to retrieve user');
    }
}

async function updateUser(req, res) {
    try {
        logger.trace('Updating user information for user ' + req.params.id);
        req.body.id = req.params.id;
        let updatedUser = await UserModel.merge(req.body);
        logger.trace('User updated. Preparing and sending response');
        prepUserResponse(updatedUser);
        return response.sendOkResponse(res, status.OK, 'Successfully saved user', updatedUser);
    } catch (err) {
        return response.sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to update user');
    }
}

async function deleteUser(req, res) {
    try {
        logger.trace('Removing user ' + req.params.id);
        let removed = await UserModel.remove({ id: req.params.id });
        if (!removed) {
            logger.warn('Failed to remove user: could not find user with id ' + req.params.id);
            return response.sendOkResponse(res, status.NOT_FOUND, 'Failed to find user to remove');
        }
        logger.trace('Removed user');
        return response.sendOkResponse(res, status.OK, 'Successfully removed user');
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, status.INTERNAL_SERVER_ERROR, 'Failed to remove user');
    }
}
