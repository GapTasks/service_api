const stacks = require('../../model/stack.model');
const tasks = require('../../model/task.model');
const taskHandler = require('./tasks.handlers');
const logger = require('winstonson')(module);
const response = require('./response');
const httpStatus = require('http-status');

module.exports = {
    addStack,
    getStack,
    getAllStacks,
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
        const { name, time_needed, mood } = req.body.payload;
        let newStack = new stacks.Stack({ name }, false);
        await stacks.merge(newStack);
        let newTask = new tasks.Task({ name, time_needed, mood, stack: newStack.id }, false);
        await tasks.merge(newTask);
        let resBody = generateRestResponse({ ...newStack, ...newTask });
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully created stack', resBody);
    } catch (err) {
        logger.error(err);
        response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create stack');
    }
}

async function getStack(req, res) {
    try {
        let stacksArray = await stacks.find({ id: requestedID });
        if (stacksArray.length === 0) {
            return response.sendErrorResponse(res, httpStatus.NOT_FOUND, 'Failed to find stack');
        }
        let stack = stacksArray[0];
        let resBody = generateRestResponse(stack);
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved stack', resBody);
    } catch (err) {
        logger.error(err);
        return response.sendErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get stack');
    }
}

async function stacksMap(s) {
    let _tasks = await tasks.find({ stack: s.id });
    console.log(_tasks);
    return { ...s, tasks: _tasks };
}

async function getAllStacks(req, res) {
    try {
        let allStacks = await stacks.find();
        let stacksArr = allStacks.map(stacksMap);
        let stacksResult = await Promise.all(stacksArr);
        let resBody = stacksResult.map(s => generateRestResponse(s));
        return response.sendOkResponse(res, httpStatus.OK, 'Successfully retrieved stacks', resBody);
    } catch (err) {
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
