const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const apiRouter = express.Router();
const passport = require('passport');
const authToken = require('../../util/auth-token');
const users = require('./users.routes');
const auth = require('./auth.routes');
var cors = require('cors');

const corsOptions = {
    "origin": ["http://localhost:8080", "http://gaptasks.com:8000", "http://142.93.80.114:8000"],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
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
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
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
});

module.exports = apiRouter;
