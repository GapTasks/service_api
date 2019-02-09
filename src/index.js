const path = require('path');
const express = require('express');
const config = require('config');
const api = require('./api/v1/routes');
const mongoose = require('mongoose');
const morgan = require('morgan');
var cors = require('cors')
const logger = require('winstonson')(module);
logger.setDateFormat('YYYY-MM-DD HH:MM:ss.SSS');

const serverConfig = config.get('server');
const databaseConfig = config.get('database');

const corsOptions = {
    "origin": ["http://localhost:8080", "http://gaptasks.com:8000", "http://142.93.80.114:8000"],
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

const mongoUrl = `mongodb://${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.name}`;

process.title = 'gaptasks-api-server';

mongoose.connect(
    mongoUrl,
    { useNewUrlParser: true, useFindAndModify: false }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Connected to Mongo at ${mongoUrl}`);
    const app = express();
    
    // Need help: Braden . Here I had to add the cors package because I was getting a cors error. I wonder if you had to do it.
    app.use(cors(corsOptions));
    app.use(allowUnAuthenticatedOptions);

    // Add trace logging on HTTP requests with Morgan
    app.use(
        morgan('---> :remote-addr :remote-user :method :url HTTP/:http-version', {
            immediate: true,
            stream: logger.stream('trace')
        })
    );
    app.use(
        morgan('<--- :method :url :status :res[content-length]', {
            immediate: false,
            stream: logger.stream('trace')
        })
    );

    app.use(api);

    app.use((req, res) => {
        res.status(400).send('Bad request');
    });

    let server = app.listen(serverConfig.port, err => {
        if (err) return console.log(err);
        console.log('Express app listening on port ' + serverConfig.port);
    });

    process.on('SIGINT', () => {
        console.log('\nClosing server');
        server.close();
        process.exit(0);
    });
});
