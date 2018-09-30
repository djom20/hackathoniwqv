'use strict';

const defer = require('node-promise').defer;
const request = require('request');
const async = require('async');
const _ = require('lodash');

let config = {};

exports.setCredentials = (obj) => {
    config['TRELLO_BOARDNAME'] = obj.TRELLO_BOARDNAME;
    config['TRELLO_APIURL'] = obj.TRELLO_APIURL;
    config['TRELLO_APIKEY'] = obj.TRELLO_APIKEY;
    config['TRELLO_TOKEN'] = obj.TRELLO_TOKEN;

    return config;
};

exports.createList = (name, boardid) => {
    let deferred = defer();

    if (!name) return deferred.reject(new Error('The name cannot be empty'));
    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));

    request({
        method: 'POST',
        url: process.env.TRELLO_APIURL + '/lists/?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
        qs: { name: name, idBoard: boardid }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.getList = (boardid) => {
    let deferred = defer();

    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));

    request({
        method: 'GET',
        url: process.env.TRELLO_APIURL + '/boards/' + boardid + '/lists/?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.existList = (name, boardid) => {
    let deferred = defer();

    if (!name) return deferred.reject(new Error('The name cannot be empty'));
    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));

    exports.getList(boardid).then((list) => {
        let idx = _.findIndex(list, (b) => {
            return b.name === name;
        });

        if(idx > -1) deferred.resolve(true);
        else return deferred.resolve(false);
    });

    return deferred.promise;
};

exports.setupBoards = (boardid) => {
    let deferred = defer();

    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));

    let listNames = ['Done', 'To Do', 'Backlog'];

    async.every(listNames, (name, cb) => {

        exports.existList(name, boardid).then((status) => {
            if (!status) return exports.createList(name, boardid);
        }).then(() => {
            cb();
        });

    }, (err) => {
        if (err) deferred.reject();

        exports.getList(boardid).then((list) => {
            deferred.resolve(list);
        });

    });

    return deferred.promise;
};

exports.getBoards = () => {
    let deferred = defer();

    request({
        method: 'GET',
        uri: process.env.TRELLO_APIURL + '/member/me/boards?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.createBoard = (name) => {
    let deferred = defer();

    request({
        method: 'POST',
        uri: process.env.TRELLO_APIURL + '/boards/?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
        qs: { name: name }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.addMemeberByEmail = (email, boardid) => {
    let deferred = defer();

    if (!email) return deferred.reject(new Error('The email cannot be empty'));
    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));

    request({
        method: 'PUT',
        uri: process.env.TRELLO_APIURL + '/boards/' + boardid + '/members' + '?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
        qs: { email: email },
        headers: { 'content-type': 'application/json', type: 'type' }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(body);
    });

    return deferred.promise;
};

exports.createCard = (listid) => {
    let deferred = defer();

    if (!listid) return deferred.reject(new Error('The listid cannot be empty'));

    request({
        method: 'POST',
        url: process.env.TRELLO_APIURL + '/cards?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
        qs: { idList: listid }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.updateCard = (cardid, data) => {
    let deferred = defer();

    if (!cardid) return deferred.reject(new Error('The cardid cannot be empty'));
    if (!data) return deferred.reject(new Error('The data cannot be empty'));

    request({
        method: 'PUT',
        url: process.env.TRELLO_APIURL + '/cards/' + cardid + '?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
        qs: data
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.getCardsOnBoard = (boardid) => {
    let deferred = defer();

    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));

    request({
        method: 'GET',
        url: process.env.TRELLO_APIURL + '/boards/' + boardid + '/cards?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.existCardsOnBoard = (boardid, name) => {
    let deferred = defer();

    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));
    if (!name) return deferred.reject(new Error('The name cannot be empty'));

    exports.getCardsOnBoard(boardid).then((lists) => {
        let idx = _.findIndex(lists, (b) => {
            return b.name == name;
        });

        if(idx > -1) deferred.resolve(true);
        else deferred.resolve(false);
    });

    return deferred.promise;
};

exports.findCardsOnBoard = (boardid, name) => {
    let deferred = defer();

    if (!boardid) return deferred.reject(new Error('The boardid cannot be empty'));
    if (!name) return deferred.reject(new Error('The name cannot be empty'));

    exports.getCardsOnBoard(boardid).then((lists) => {

        let idx = _.findIndex(lists, (b) => {
            return b.name === name;
        });

        if (idx > -1) deferred.resolve(lists[idx]);
        else deferred.resolve(null);
    });

    return deferred.promise;
};

exports.attachCardsOnBoard = (listid, issue) => {
    let deferred = defer();

    if (!listid) return deferred.reject(new Error('The listid cannot be empty'));

    exports.createCard(listid).then((card) => {
        return exports.updateCard(card.id, {
            name: issue.title,
            desc: issue.body,
            urlSource: issue.html_url
            // idMembers: 'Prueba',
            // due: issue.created_at
        });
    }).then((data) => {
        deferred.resolve(data);
    });

    return deferred.promise;
};

exports.getCardsByLsit = (listid) => {
    let deferred = defer();

    if (!listid) return deferred.reject(new Error('The listid cannot be empty'));

    request({
        method: 'GET',
        url: process.env.TRELLO_APIURL + '/lists/' + listid + '/cards/?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.deleteCard = (cardid) => {
    let deferred = defer();

    if (!cardid) return deferred.reject(new Error('The cardid cannot be empty'));

    request({
        method: 'DELETE',
        url: process.env.TRELLO_APIURL + '/cards/' + cardid + '?key=' + process.env.TRELLO_APIKEY + '&token=' + process.env.TRELLO_TOKEN,
        qs: { idList: cardid }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve();
    });

    return deferred.promise;
};