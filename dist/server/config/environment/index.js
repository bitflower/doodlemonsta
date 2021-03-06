'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    // Server port
    port: process.env.PORT || 9000,

    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'app-secret'
    },
    session: {
        expiration: 60 * 60 // * 24 // 60s = 1 min * 60 = 1 h * 24 = 1 day expressed in seconds or an string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
    },

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },

    facebook: {
        clientID: process.env.FACEBOOK_ID || '191467987890729',
        clientSecret: process.env.FACEBOOK_SECRET || 'd581bded4c23a8d824a94a016f196dbc',
        callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback',
        scope: ['email', 'public_profile', 'user_friends']
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./shared'), require('./' + process.env.NODE_ENV + '.js') || {});
//# sourceMappingURL=index.js.map
