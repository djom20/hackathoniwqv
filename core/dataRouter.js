'use strict';

module.exports = (router) => {
    require('glob')('./routes/*.js', (er, files) => {
        if (er) throw new Error(er);

        require('lodash').forEach(files, (value) => {
            require('.' + value.substr(0, value.length - 3))(router);
        });
    });

    setTimeout(() => {
        require('./tableRouter').writeRoutes(router.stack);
    }, 100);
};