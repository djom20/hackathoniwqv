'use strict';

const _ = require('lodash');
const async = require('async');
const defer = require('node-promise').defer;

const trello = require('./trello');
const github = require('./github');
const cron = require('./cron');

exports.createDashbaord = () => {
    let deferred = defer();

    trello.getBoards().then((boards) => {
        let idx = _.findIndex(boards, (b) => {
            return b.name == process.env.TRELLO_BOARDNAME;
        });

        if (idx > -1) {
            let board = boards[idx]; // board found

            return trello.setupBoards(board.id).then(() => {
                return deferred.resolve();
            }, (error) => {
                console.error('Sorry we cant update the board');
                return deferred.reject();
            });

        } else {
            console.error('Board not found, please try again');
            return deferred.reject();
        }

    }, (error) => {
        console.error('Sorry we cant setup the board');
        return deferred.reject();
    });

    return deferred.promise;
};

exports.updateBoard = () => {
    let deferred = defer();

    exports.createDashbaord().then(() => {

        exports.createIssuesCards().then(() => {

            return deferred.resolve();

        }, (err) => {
            return deferred.reject(err);
        });

    }, (err) => {
        return deferred.reject(err);
    });

    return deferred.promise;
};

exports.createIssuesCards = () => {
    let deferred = defer();

    trello.getBoards().then((boards) => {
        let idx = _.findIndex(boards, (b) => {
            return b.name == process.env.TRELLO_BOARDNAME;
        });

        if (idx > -1) {
            let board = boards[idx]; // board found

            trello.getList(board.id).then((lists) => {
                let idx = _.findIndex(lists, (b) => {
                    return b.name == 'Backlog';
                });

                if (idx > -1) {

                    let list = lists[idx];

                    github.getIssues().then((issues) => {

                        async.every(issues, (issue, cb) => {

                            trello.existCardsOnBoard(board.id, issue.title).then((exists) => {

                                if (!exists) return trello.attachCardsOnBoard(list.id, issue);

                            }, (err) => {

                                return deferred.reject(err);

                            }).then(() => {

                                return cron.removeCardsFromClosedissues();

                            }).then(() => {

                                // return github.getMember(issue.user.id);

                            }).then(() => {

                                // return trello.addMemeberByEmail(userData.email);

                            }).then(() => {

                                cb();

                            });
                        }, () => {
                            return deferred.resolve();
                        });

                    }, (err) => {
                        return deferred.reject(err);
                    });

                } else return deferred.reject();
            }, (err) => {
                return deferred.reject(err);
            });
        } else {
            trello.createBoard(process.env.TRELLO_BOARDNAME).then(() => {
                exports.createIssuesCards().then(() => {
                    return deferred.resolve();
                }, (err) => {
                    return deferred.reject(err);
                });
            }, (err) => {
                return deferred.reject(err);
            });
        }
    }, (err) => {
        return deferred.reject(err);
    });

    return deferred.promise;
};

exports.removeCardsFromClosedissues = () => {
    let deferred = defer();

    trello.getBoards().then((boards) => {
        let idx = _.findIndex(boards, (b) => {
            return b.name == process.env.TRELLO_BOARDNAME;
        });

        if (idx > -1) {
            let board = boards[idx]; // board found

            trello.getList(board.id).then((lists) => {
                let idx = _.findIndex(lists, (b) => {
                    return b.name == 'Backlog';
                });

                if (idx > -1) {

                    let list = lists[idx];

                    trello.getCardsByLsit(list.id).then((cards) => {

                        async.every(cards, (card, cb) => {

                            github.existIssue(card.name).then((status) => {

                                if (!status){
                                    trello.deleteCard(card.id).then(() => {
                                        cb();
                                    });
                                } else cb();
                            });

                        }, (err) => {
                            return deferred.resolve();
                        });

                    });

                } else return deferred.reject();

            });

        } else return deferred.reject();
    });

    return deferred.promise;
};