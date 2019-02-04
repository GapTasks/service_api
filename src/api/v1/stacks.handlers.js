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

function generateRestResponse(stack) {
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
        let resBody = generateRestResponse(newStack);
        return response.sendOkResponse(res, httpStatus.CREATED, 'Successfully added new stack', resBody);
    } catch (err) {
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create stack');
    }
}

async function getStack(req, res) {
    try {
        let requestedID = req.params ? req.params.id : undefined
        if(!requestedID){
            return await getAllStacks(req, res);
        }
        let stack = await stacks.find({ id: requestedID });
        let resBody = generateRestResponse(stack);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved stack', resBody);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get stack');
    }
}

async function getAllStacks(req, res){
    try{
        let allStacks = await stacks.all();
        let resBody = generateRestResponse(allStacks);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved stacks', resBody);
    }catch (err){
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get stacks');
    }
}

async function updateStack(req, res) {
    try {
        req.body.id = req.params.id;
        let stack = await stacks.merge(req.body);
        let resBody = generateRestResponse(stack);
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
