'use strict';

let mongoose = require('mongoose');

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true });

    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
        console.log('DB ready to use it');
    });

    return this;
};

exports.getModule = (name) => {
    let newModel = require('../models/' + name);
    return mongoose.models[name] || newModel;
};