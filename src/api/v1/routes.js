const express = require('express');
const stacksApi = require('./stacks.routes');
const httpStatus = require('http-status');
const bodyParser = require('body-parser');

let prefix = '/api/v1';
let api = express.Router();

api.use(bodyParser.json());

api.use(prefix, stacksApi);

api.use((req, res) => {
    return res.status(httpStatus.BAD_REQUEST).json({
        api: 'v1',
        success: false,
        status: 'BAD_REQUEST',
        message: 'Bad request',
        content: {}
    });
});

module.exports = api;
