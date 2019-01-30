const httpStatus = require('http-status');
let apiVersion = 'v1';

function sendOkResponse(res, status, message, content = {}) {
    let statusCode = `${status}_NAME`;
    statusCode = httpStatus[statusCode];
    res.status(status).json({
        api: apiVersion,
        success: true,
        status: statusCode,
        message,
        content
    });
}

function sendErrorResponse(res, status, err) {
    let statusCode = `${status}_NAME`;
    res.status(status).json({
        api: apiVersion,
        success: false,
        status: httpStatus[statusCode],
        message: typeof err === 'object' ? `Failed to ${action}: ${err.message}` : err,
        content: {}
    });
}

module.exports = {
    sendOkResponse,
    sendErrorResponse
};
