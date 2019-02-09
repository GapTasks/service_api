const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const httpStatus = require('http-status');
const apiRouter = express.Router();
const passport = require('passport');
const authToken = require('../../util/auth-token');
const users = require('./users.routes');
const auth = require('./auth.routes');
const stacks = require('./stacks.routes');
const tasks = require('./tasks.routes');
var cors = require('cors');

const corsOptions = {
    "origin": ["http://localhost:8080", "http://www.gaptasks.com", "http://142.93.80.114"],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "allowedHeaders": "Content-Type,origin",
    "credentials": true,
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

var allowUnAuthenticatedOptions = function(req, res, next) {    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(204);
    }
    else {
      next();
    }
};

authToken.createPassportStrategy((err, strategy) => {
    if (err) throw new Error('Failed to create passport strategy: ' + err.message);
    passport.use(strategy);
    apiRouter.use(bodyParser.json());
    apiRouter.use(cookieParser());
    apiRouter.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', ["http://localhost:8080", "http://www.gaptasks.com", "http://142.93.80.114"]);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type,origin');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
        next();
    });

    //apiRouter.use(cors(corsOptions));
    //apiRouter.use(allowUnAuthenticatedOptions);
    let prefix = '/api/v1';

    // For the auth and user routes, not all of them should be authenticated. Otherwise we won't be able to login or
    // add a new user
    apiRouter.use(prefix, auth);
    apiRouter.use(prefix, users);
    
    // All other routes should be protected and require a token
    apiRouter.use(passport.authenticate('jwt', { session: false }));
    apiRouter.use(prefix, stacks);
    apiRouter.use(prefix, tasks);

    apiRouter.use((req, res) => {
        return res.status(httpStatus.BAD_REQUEST).json({
            api: 'v1',
            success: false,
            status: 'BAD_REQUEST',
            message: 'Bad request',
            content: {}
        });
    });
});

module.exports = apiRouter;

