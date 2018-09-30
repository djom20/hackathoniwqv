'use strict';

module.exports = (router, path, db, auth) => {
    router.get('/', (req, res) => {
        res
            .set({'content-type': 'text/html; charset=mycharset'})
            .send(
                require('fs').readFileSync('./public/index.html')
            );
    });

    router.post('/status', (req, res) => {
        res.status(200).send({ message: 'Ok' });
    });
};