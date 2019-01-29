const stacks = require('../../model/stack.model');
const logger = require('winstonson')(module);
const response = require('./response');
const httpStatus = require('http-status');

module.exports = {
    addStack,
    getStack,
    updateStack,
    deleteStack
};

function generateRestRsponse(stack) {
    let self = '/stacks/' + stack.id;
    return {
        ...stack,
        _links: {
            self
        }
    };
}

async function addStack(req, res) {
    let action = 'create stack';
    try {
        let newStack = new stacks.Stack(req.body, false);
        await stacks.merge(newStack);
        let resBody = generateRestRsponse(newStack);
        return response.sendOkResponse(res, action, httpStatus.CREATED, resBody);
    } catch (err) {
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Failed to ${action}`);
    }
}

async function getStack(req, res) {
    let action = 'retrieve stack';
    try {
        let stack = await stacks.find({ id: req.params.id });
        let resBody = generateRestRsponse(stack);
        return response.sendOkResponse(res, action, httpStatus.OK, resBody);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Failed to ${action}`);
    }
}

async function updateStack(req, res) {
    let action = 'update stack';
    try {
        req.body.id = req.params.id;
        let stack = await stacks.merge(req.body);
        let resBody = generateRestRsponse(stack);
        return response.sendOkResponse(res, action, httpStatus.OK, resBody);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Failed to ${action}`);
    }
}

async function deleteStack(req, res) {
    logger.trace('entering stacks.handlers#deleteStack()');
    let action = 'delete stack';
    try {
        await stacks.remove(req.params.id);
        return response.sendOkResponse(res, action, httpStatus.OK, {});
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `Failed to ${action}`);
    } finally {
        logger.trace('exiting stacks.handlers#deleteStack()');
    }
}
