process.env[NODE_ENV] = 'test';

let chai = require('chai');
let request = require('request');
let crypto = require('crypto');
let expect = require('chai').expect;

let helpers = require('./../helpers/functions');

describe('Helpers functions Module', () => {
    it('Should get the url image hash', () => {
        let email = 'djom202@gmail.com';
        let url = helpers.getGravatarUrl(email);

        expect(url).to.not.be.null;
        expect(url).to.be.contain('www.gravatar.com/avatar/');
        expect(url).to.be.equal(
            'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex') + '?s=200'
        );
    });

    it('Should get the image hash', (done) => {
        let url = helpers.getGravatarUrl('djom202@gmail.com');

        request
            .post({ url: url }, (error, response, body) => {
                expect(error).to.not.be.exist;

                expect(body).to.be.exist;
                expect(body).to.not.be.null;

                done();
            });
    });
});