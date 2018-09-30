process.env[NODE_ENV] = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
const server = require('../server');

chai.use(chaiHttp);

describe('Server Router Module', () => {
    it('Getting the main route', (done) => {
        let html = require('fs').readFileSync('./public/index.html', 'utf8');

        chai
            .request(server)
            .get('/')
            .end((err, res) => {
                expect(err).to.not.be.exist;
                expect(res).to.be.exist;
                expect(res.type).to.be.equal('text/html');
                expect(res.body).to.be.exist;
                expect(res.status).to.be.equal(200);
                expect(res.text).to.be.equal(html);

                done();
            });
    });

    it('Getting an status route', (done) => {
        chai
            .request(server)
            .get('/status')
            .end((err, res) => {
                expect(err).to.not.be.exist;

                expect(res).to.be.exist;
                expect(res).to.be.json;
                expect(res.body).to.be.exist;
                expect(res.status).to.be.equal(404);
                expect(res.body).to.be.exist;
                expect(res.body.error).to.be.equal('Page not found');

                done();
            });
    });
});