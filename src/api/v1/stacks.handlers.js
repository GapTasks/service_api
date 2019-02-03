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
    try {
        let newStack = new stacks.Stack(req.body, false);
        await stacks.merge(newStack);
        let resBody = generateRestRsponse(newStack);
        return response.sendOkResponse(res, httpStatus.CREATED, 'Successfully added new stack', resBody);
    } catch (err) {
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create stack');
    }
}

async function getStack(req, res) {
    try {
        let stack = await stacks.find({ id: req.params.id });
        let resBody = generateRestRsponse(stack);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved stack', resBody);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get stack');
    }
}

async function updateStack(req, res) {
    try {
        req.body.id = req.params.id;
        let stack = await stacks.merge(req.body);
        let resBody = generateRestRsponse(stack);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully updated stack', resBody);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update stack');
    }
}

async function deleteStack(req, res) {
    try {
        await stacks.remove(req.params.id);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully removed the stack');
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete stack');
    }
}
