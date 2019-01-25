const AuthModel = require('../../model/auth.model');
const UserModel = require('../../model/user.model');
const userHandlers = require('./users.handlers');
const response = require('./response');
const status = require('http-status');
const crypto = require('crypto');
const config = require('config');
const logger = require('winstonson')(module);
const authToken = require('../../util/auth-token');
const _config = config.get('security');

module.exports = {
    addNewAuthenticationEntry,
    login
};

function _getHash(algo, salt, password) {
    return crypto
        .createHash(algo)
        .update(salt)
        .update(password)
        .digest('hex');
}

async function addNewAuthenticationEntry(req, res) {
    try {
        if (!req.body.username || !req.body.password)
            return response.sendErrorResponse(res, status.BAD_REQUEST, 'Missing username and/or password');
        let user = await UserModel.find({ username: req.body.username });
        if (!user) return response.sendErrorResponse(res, status.NOT_FOUND, 'Failed to find user to authenticate');
        let salt = crypto.randomBytes(8).toString('hex');
        let algo = _config.hashAlgo;
        let hash = _getHash(algo, salt, req.body.password);
        await AuthModel.merge(new AuthModel.AuthInfo({ user: user.id, salt, algo, hash }));
        return response.sendActionResponse(
            res,
            status.CREATED,
            'Successfully added authentication info for ' + user.username
        );
    } catch (err) {
        return response.sendErrorResponse(res, err, 'create new auth info entry');
    }
}

async function login(req, res) {
    try {
        if (!req.body.username || !req.body.password)
            return response.sendErrorResponse(res, status.BAD_REQUEST, 'Missing username and/or password');
        let user = await UserModel.find({ username: req.body.username });
        if (!user) return response.sendErrorResponse(res, status.NOT_FOUND, 'Failed to find user to authenticate');
        let authInfo = await AuthModel.find({ user: user.id });
        if (!authInfo) return response.sendErrorResponse(status.NOT_FOUND, 'Failed to find auth info for user');
        let hashed = _getHash(authInfo.algo, authInfo.salt, req.body.password);
        if (hashed != authInfo.hash) {
            return response.sendErrorResponse(res, status.BAD_REQUEST, 'Failed to authenticate with bad password');
        }
        // Authentication succeeded, generate a token and return it to the user
        let token = await authToken.generate(req.body.username);
        userHandlers.prepUserResponse(user);
        return response.sendActionResponse(res, status.OK, 'Successfully authenticated user', { token, user });
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, err, 'authenticate user');
    }
}
