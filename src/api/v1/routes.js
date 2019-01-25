const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = express.Router();
const users = require('./users.routes');
const auth = require('./auth.routes');

apiRouter.use(bodyParser.json());
apiRouter.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    next();
});

let prefix = '/api/v1';

apiRouter.use(prefix, auth);
apiRouter.use(prefix, users);

module.exports = apiRouter;
