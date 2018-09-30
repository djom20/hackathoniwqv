process.env[NODE_ENV] = 'test';

const chai = require('chai');
const request = require('request');
const _ = require('lodash');
const chance = require('chance').Chance();
const expect = require('chai').expect;

const trello = require('./../helpers/trello');

describe('Trello Module', () => {
    it('Should be defined Trello module', () => {
        expect(trello).to.be.exist;
    });

    it('Should be defined setCredentials func', () => {
        expect(trello.setCredentials).to.be.exist;
    });

    it('Should be defined setCredentials func', (done) => {
        let pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let newConfig = {
            'TRELLO_BOARDNAME': chance.word({ length: 10 }),
            'TRELLO_APIURL': 'https://api.trello.com/1',
            'TRELLO_APIKEY': chance.string({ length: 32, pool: pool }),
            'TRELLO_TOKEN': chance.string({ length: 64, pool: pool })
        };
        let config = trello.setCredentials(newConfig);

        expect(newConfig.TRELLO_BOARDNAME).to.be.exist;
        expect(newConfig.TRELLO_BOARDNAME).to.be.equal(config.TRELLO_BOARDNAME);

        expect(newConfig.TRELLO_APIURL).to.be.exist;
        expect(newConfig.TRELLO_APIURL).to.be.equal(config.TRELLO_APIURL);

        expect(newConfig.TRELLO_APIKEY).to.be.exist;
        expect(newConfig.TRELLO_APIKEY).to.be.equal(config.TRELLO_APIKEY);

        expect(newConfig.TRELLO_TOKEN).to.be.exist;
        expect(newConfig.TRELLO_TOKEN).to.be.equal(config.TRELLO_TOKEN);

        done();
    });

    it('Should be defined createList func', () => {
        expect(trello.createList).to.be.exist;
    });

    it('Should get the new list created', (done) => {
        let name = chance.word({ length: 5 });
        let boardidTest = '5bb0df8bab17b185d64ea25e';

        trello.createList(name, boardidTest).then((data) => {
            expect(data).to.be.exist;

            expect(data.id).to.be.exist;
            expect(data.name).to.be.exist;
            expect(data.closed).to.be.exist;
            expect(data.idBoard).to.be.exist;
            expect(data.pos).to.be.exist;
            expect(data.limits).to.be.exist;

            expect(data.id).to.not.be.empty;
            expect(data.name).to.be.equal(name);
            expect(data.closed).to.be.false;
            expect(data.idBoard).to.not.be.empty;
            expect(data.idBoard).to.be.equal(boardidTest);
            expect(data.pos).to.be.above(0);
            expect(data.limits).to.be.empty;

            done();
        });
    });

    it('Should be defined getList func', () => {
        expect(trello.getList).to.be.exist;
    });

    it('Should get all list', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';

        trello.getList(boardidTest).then((boards) => {
            expect(boards).to.be.exist;
            expect(boards).to.be.an('array');
            expect(boards.length).to.be.above(1);

            _.forEach(boards, (b) => {
                expect(b.id).to.be.exist;
                expect(b.id).to.not.be.empty;

                expect(b.idBoard).to.be.exist;
                expect(b.idBoard).to.not.be.empty;
                expect(b.idBoard).to.be.equal(boardidTest);

                expect(b.name).to.be.exist;
                expect(b.name).to.not.be.empty;

                expect(b.closed).to.be.exist;
                expect(b.closed).to.not.be.null;

                expect(b.idBoard).to.be.exist;
                expect(b.idBoard).to.not.be.empty;

                expect(b.pos).to.be.exist;
                expect(b.pos).to.not.be.null;

                expect(b.subscribed).to.be.exist;
                expect(b.subscribed).to.not.be.null;
            });

            done();
        });
    });

    it('Should be defined existList func', () => {
        expect(trello.existList).to.be.exist;
    });

    it('Should return false if the list not exist on the board', (done) => {
        let name = chance.word({ length: 5 });
        let boardidTest = '5bb0df8bab17b185d64ea25e';

        trello.existList(name, boardidTest).then((sw) => {
            expect(sw).to.be.false;

            done();
        });
    });

    it('Should return true if the list exist on the board', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';

        trello.existList('TestList', boardidTest).then((sw) => {
            expect(sw).to.be.true;

            done();
        });
    });

    it('Should be defined setupBoards func', () => {
        expect(trello.setupBoards).to.be.exist;
    });

    it('Should get all new boards at the first time', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';
        let cnt = 0;

        trello.setupBoards(boardidTest).then((boards) => {
            expect(boards).to.be.exist;

            _.forEach(boards, (b) => {
                if (b.name == 'Backlog' || b.name == 'To Do' || b.name == 'Done') cnt++;
            });

            expect(cnt).to.be.equal(3);

            done();
        });
    });

    it('Should be defined getBoards func', () => {
        expect(trello.getBoards).to.be.exist;
    });

    it('Should get all boards', (done) => {
        trello.getBoards().then((boards) => {
            expect(boards).to.be.exist;
            expect(boards.length).to.be.at.least(1);

            _.forEach(boards, (b) => {
                expect(b.id).to.be.exist;
                expect(b.id).to.not.be.null;

                expect(b.name).to.be.exist;
                expect(b.name).to.not.be.empty;

                expect(b.desc).to.be.exist;

                expect(b.url).to.be.exist;
                expect(b.url).to.not.be.empty;

                expect(b.shortUrl).to.be.exist;
                expect(b.shortUrl).to.not.be.empty;
            });

            done();
        });
    });

    it('Should be defined addMemeberByEmail func', () => {
        expect(trello.addMemeberByEmail).to.be.exist;
    });

    it('Should be defined createCard func', () => {
        expect(trello.createCard).to.be.exist;
    });

    it('Should can create a card', (done) => {
        let listid = '5bb0e07eadaff622c27f6fb6';

        trello.createCard(listid).then((newCard) => {
            expect(newCard).to.be.exist;

            expect(newCard.id).to.be.exist;
            expect(newCard.id).to.not.be.null;

            expect(newCard.idList).to.be.exist;
            expect(newCard.idList).to.not.be.null;
            expect(newCard.idList).to.be.equal(listid);

            expect(newCard.shortUrl).to.be.exist;
            expect(newCard.shortUrl).to.not.be.null;

            expect(newCard.url).to.be.exist;
            expect(newCard.url).to.not.be.null;

            done();
        });
    });

    it('Should be defined updateCard func', () => {
        expect(trello.updateCard).to.be.exist;
    });

    it('Should can update a card', (done) => {
        let cardidTest = '5bb0ee8de0b5b671fd1beaaa';
        let name = 'Prueba-Update' + chance.integer({ min: 1, max: 100 });
        let desc = chance.sentence({ words: 5 });

        trello.updateCard(cardidTest, {
            name: name,
            desc: desc
        }).then((card) => {
            expect(card).to.be.exist;

            expect(card.id).to.be.exist;
            expect(card.id).to.be.equal(cardidTest);

            expect(card.name).to.be.exist;
            expect(card.name).to.be.equal(name);

            expect(card.desc).to.be.exist;
            expect(card.desc).to.be.equal(desc);

            done();
        });
    });

    // it('Should be defined archiveAllCards func', () => {
    //     expect(trello.archiveAllCards).to.be.exist;
    // });

    it('Should be defined getCardsOnBoard func', () => {
        expect(trello.getCardsOnBoard).to.be.exist;
    });

    it('Should can get all cards on the board', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';

        trello.getCardsOnBoard(boardidTest).then((cards) => {
            expect(cards).to.be.exist;
            expect(cards.length).to.be.above(1);

            _.forEach(cards, (c) => {
                expect(c.id).to.be.exist;
                expect(c.id).to.not.be.null;

                expect(c.desc).to.be.exist;

                expect(c.idBoard).to.be.exist;
                expect(c.idBoard).to.not.be.null;
                expect(c.idBoard).to.be.equal(boardidTest);

                expect(c.idList).to.be.exist;
                expect(c.idList).to.not.be.null;

                expect(c.url).to.be.exist;
                expect(c.url).to.not.be.null;
            });

            done();
        });
    });

    it('Should be defined existCardsOnBoard func', () => {
        expect(trello.existCardsOnBoard).to.be.exist;
    });

    it('Should return true if exist the cards on the board', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';
        let cardName = 'Exist-This-Card';

        trello.existCardsOnBoard(boardidTest, cardName).then((card) => {
            expect(card).to.be.exist;
            expect(card).to.be.true;
            done();
        });
    });

    it('Should return false if not exist the cards on the board', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';
        let cardName = chance.sentence({ words: 5 });

        trello.existCardsOnBoard(boardidTest, cardName).then((card) => {
            expect(card).to.be.exist;
            expect(card).to.be.false;
            done();
        });
    });

    it('Should be defined findCardsOnBoard func', () => {
        expect(trello.findCardsOnBoard).to.be.exist;
    });

    it('Should get the card if was found on the board', (done) => {
        let boardidTest = '5bb0df8bab17b185d64ea25e';
        let cardName = 'Exist-This-Card';

        trello.findCardsOnBoard(boardidTest, cardName).then((card) => {
            expect(card).to.be.exist;

            expect(card.id).to.be.exist;
            expect(card.id).to.not.be.null;

            expect(card.desc).to.be.exist;

            expect(card.idBoard).to.be.exist;
            expect(card.idBoard).to.not.be.null;
            expect(card.idBoard).to.be.equal(boardidTest);

            expect(card.idList).to.be.exist;
            expect(card.idList).to.not.be.null;

            expect(card.url).to.be.exist;
            expect(card.url).to.not.be.null;

            done();
        });
    });

    it('Should be defined attachCardsOnBoard func', () => {
        expect(trello.attachCardsOnBoard).to.be.exist;
    });

    it('Should be defined attachCardsOnBoard func', (done) => {
        let listid = '5bb0e07eadaff622c27f6fb6';

        let newIssues = {
            title: chance.sentence({ words: 5 }),
            body: chance.sentence({ words: 45 }),
            html_url: 'https://trello.com/c/' + chance.string({ length: 8, pool: 'abcdefghijklmnopqrstuvwxyz0123456789' })
        };

        trello.attachCardsOnBoard(listid, newIssues).then((card) => {
            expect(card).to.be.exist;

            expect(card.id).to.be.exist;
            expect(card.id).to.not.be.null;

            expect(card.name).to.be.exist;
            expect(card.name).to.not.be.null;
            expect(card.name).to.be.equal(newIssues.title);

            expect(card.desc).to.be.exist;
            expect(card.desc).to.not.be.null;
            expect(card.desc).to.be.equal(newIssues.body);

            expect(card.idList).to.be.exist;
            expect(card.idList).to.not.be.null;
            expect(card.idList).to.be.equal(listid);

            expect(card.url).to.be.exist;
            expect(card.url).to.not.be.null;

            done();
        });
    });

});