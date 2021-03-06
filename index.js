const express = require('express');
const config = require('config');
const api = require('./src/api/v1/routes');
const mongoose = require('mongoose');

const serverConfig = config.get('server');
const databaseConfig = config.get('database');

const mongoUrl = `mongodb://${databaseConfig.host}:${databaseConfig.port}/${databaseConfig.name}`;

process.title = "gaptasks-auth-api";

mongoose.connect(
    mongoUrl,
    { useNewUrlParser: true, useFindAndModify: false }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(`Connected to Mongo at ${mongoUrl}`);
    const app = express();
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
