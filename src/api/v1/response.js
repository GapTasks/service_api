const httpStatus = require('http-status');
let apiVersion = 'v1';

function sendOkResponse(action, res, status, content) {
    let statusCode = `${status}_NAME`;
    statusCode = httpStatus[statusCode];
    res.status(status).json({
        api: apiVersion,
        success: true,
        status: statusCode,
        message: `Successfully completed ${action}`,
        content
    });
}

function sendErrorResponse(action, res, err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        api: apiVersion,
        success: false,
        status: httpStatus['500_CODE'],
        message: `Failed to ${action}: ${err.message}`,
        content: {}
    });
}

module.exports = {
    sendOkResponse,
    sendErrorResponse
};
