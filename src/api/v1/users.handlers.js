const UserModel = require('../../model/user.model');
const response = require('./response');
const status = require('http-status');
const logger = require('winstonson')(module);

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
        self
    };
}

async function addNewUser(req, res) {
    try {
        logger.trace('Adding new user with username ' + req.body.username);
        let user = await UserModel.merge(new UserModel.User(req.body));
        logger.trace('Added user. Preparing and sending response');
        prepUserResponse(user);
        return response.sendActionResponse(res, status.CREATED, 'Successfully created new user', user);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, err, 'add new user');
    }
}

async function getUser(req, res) {
    try {
        logger.trace('Retrieving user');
        let user = await UserModel.find({ id: req.params.id });
        prepUserResponse(user);
        return response.sendQueryResponse(res, status.OK, user);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, err, 'retrieve user');
    }
}

async function updateUser(req, res) {
    try {
        logger.trace('Updating user information for user ' + req.params.id);
        req.body.id = req.params.id;
        let updatedUser = await UserModel.merge(req.body);
        logger.trace('User updated. Preparing and sending response');
        prepUserResponse(updatedUser);
        return response.sendActionResponse(res, status.OK, 'Successfully saved user', updatedUser);
    } catch (err) {
        return response.sendErrorResponse(res, err, 'save user');
    }
}

async function deleteUser(req, res) {
    try {
        logger.trace('Removing user ' + req.params.id);
        let removed = await UserModel.remove({ id: req.params.id });
        if (!removed) {
            logger.warn('Failed to remove user: could not find user with id ' + req.params.id);
            return response.sendActionResponse(res, status.NOT_FOUND, 'Failed to find user to remove');
        }
        logger.trace('Removed user');
        return response.sendActionResponse(res, status.OK, 'Successfully removed user');
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, err, 'remove user');
    }
}
