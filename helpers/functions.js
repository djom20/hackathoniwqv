'use strict';

let crypto = require('crypto');

exports.getGravatarUrl = (email) => {
    return 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex') + '?s=200';
};