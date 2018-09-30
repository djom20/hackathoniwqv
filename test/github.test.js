process.env[NODE_ENV] = 'test';

const chai = require('chai');
const request = require('request');
const _ = require('lodash');
const expect = require('chai').expect;

const github = require('./../helpers/github');

describe('Github Module', () => {
    it('Should be defined Github module', () => {
        expect(github).to.be.exist;
    });

    it('Should be defined getIssues func', () => {
        expect(github.getIssues).to.be.exist;
    });

    it('Should be defined getMember func', () => {
        expect(github.getMember).to.be.exist;
    });

    it('Should get getIssues func', (done) => {
        expect(github.getIssues().then).to.be.exist;
        // expect(github.getIssues()).to.not.throw(Error);

        github.getIssues().then((data) => {
            expect(data).to.be.exist;
            expect(data.length).to.be.at.least(1);

            let arr = ['url', 'repository_url', 'html_url', 'id', 'title', 'user', 'body'];

            _.forEach(arr, (item) => {
                expect(data[0][item]).to.be.exist;
                expect(data[0][item]).to.not.be.null;
            });

            done();
        });
    });

    xit('Should throw when given no arguments on getMember func', () => {
        let thowError = github.getMember();
        expect(thowError).to.throw('The memberid cannot be empty');
        // expect(github.getMember()).to.throw('The memberid cannot be empty');
    });

    xit('Should get list on getMember func', (done) => {
        github.getMember().then((data) => {
            console.log('data', data);

            // let arr = ['url', 'repository_url', 'html_url', 'id', 'title', 'user', 'body'];

            // _.forEach(arr, (item) => {
            //     expect(data[0][item]).to.be.exist;
            //     expect(data[0][item]).to.not.be.null;
            // });

            done();
        });
    });
});