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
    //app.use(cors({credentials:"true", origin:"http://localhost:8080"}));

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
