'use strict';

const express = require('express'),
    server = express(),
    cors = require('cors'),
    helmet = require('helmet'),
    logger = require('morgan'),
    router = express.Router(),
    bodyParser = require('body-parser');

const bot = require('./helpers/bot');

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    server.use(cors());
}

require('./core/dataRouter')(router);

server.set('port', process.env.PORT || 7000);
server.set('trust proxy', 1);
server.disable('x-powered-by');
server.use(helmet());
server.use(logger(process.env.NODE_ENV));
server.use(bodyParser.json({
    type: 'application/json',
    limit: '5mb'
}));
server.use(bodyParser.urlencoded({
    extended: false,
    limit: '5mb'
}));
server.use(router);
server.use('*', (req, res, next) => {
    return res.status(404).json({ error: 'Page not found' });
});
server.use((err, req, res, next) => {
    console.error(err.stack);
    return res.status(500).json({ error: err.message });
});

server.listen(server.get('port'), () => {
    console.log('listening on port ' + server.get('port'));

    bot.startToWacth();
});

if (process.env.NODE_ENV == 'test') module.exports = server;