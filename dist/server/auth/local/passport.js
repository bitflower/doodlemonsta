'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.setup = setup;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

function localAuthenticate(User, username, password, done) {

    // console.log('Searching user: ' + username);

    User.findOneAsync({
        name: username //.toLowerCase()
    }).then(function (user) {

        // console.log('Found user: ', user); // OK !

        if (!user) {
            return done(null, false, {
                message: 'This username is not registered.'
            });
        }
        user.authenticate(password, function (authError, authenticated) {

            // console.log('user.authenticate', {
            //     authError: authError,
            //     authenticated: authenticated
            // }); // OK!

            if (authError) {
                return done(authError);
            }
            if (!authenticated) {
                return done(null, false, { message: 'This password is not correct.' });
            } else {

                // Set last login date
                user.lastLogin = new Date();
                user.save(function (err, _user) {
                    if (err) return done(err);
                    return done(null, _user);
                });
            }
        });
    })['catch'](function (err) {
        return done(err);
    });
}

function setup(User, config) {
    // console.log('Setup passport local strategy'); // OK!
    _passport2['default'].use(new _passportLocal.Strategy({
        usernameField: 'username', // The field in the request body representing the username
        passwordField: 'password' // this is the virtual field on the model
    }, function (username, password, done) {
        // console.log('Passport localAuthenticate function');
        return localAuthenticate(User, username, password, done);
    }));
}
//# sourceMappingURL=passport.js.map
