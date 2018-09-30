'use strict';

const _ = require('lodash');
const request = require('request');
const defer = require('node-promise').defer;

exports.getIssues = () => {
    let deferred = defer();

    request({
        method: 'GET',
        url: process.env.GITHUB_HOSTNAME + '/repos/' + process.env.GITHUB_USERENAME + '/' + process.env.GITHUB_REPO + '/issues?state=open&client_id=' + process.env.GITHUB_CLIENTID + '&client_secret=' + process.env.GITHUB_CLIENTSECRET,
        headers: {
            'User-Agent': process.env.GITHUB_REPO
        }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};

exports.existIssue = (name) => {
    let deferred = defer();

    request({
        method: 'GET',
        url: process.env.GITHUB_HOSTNAME + '/repos/' + process.env.GITHUB_USERENAME + '/' + process.env.GITHUB_REPO + '/issues?state=open&client_id=' + process.env.GITHUB_CLIENTID + '&client_secret=' + process.env.GITHUB_CLIENTSECRET,
        headers: {
            'User-Agent': process.env.GITHUB_REPO
        }
    }, (error, response, issues) => {
        if (error) {
            return deferred.reject(error);
        }

        let idx = _.findIndex(JSON.parse(issues), (item) => {
            return item.title === name;
        });

        if (idx > -1) deferred.resolve(true);
        else return deferred.resolve(false);
    });

    return deferred.promise;
};

exports.getMember = (memberid) => {
    let deferred = defer();

    if (!memberid) return deferred.reject(new Error('The memberid cannot be empty'));

    request({
        method: 'GET',
        url: process.env.GITHUB_HOSTNAME + '/user/public_emails?client_id=' + process.env.GITHUB_CLIENTID + '&client_secret=' + process.env.GITHUB_CLIENTSECRET,
        headers: {
            'User-Agent': process.env.GITHUB_REPO
        }
    }, (error, response, body) => {
        if (error) {
            return deferred.reject(error);
        }

        console.log('body', body);

        deferred.resolve(JSON.parse(body));
    });

    return deferred.promise;
};