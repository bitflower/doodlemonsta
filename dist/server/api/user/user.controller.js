'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.me = me;
exports.search = search;
exports.pendingMonstas = pendingMonstas;
exports.authCallback = authCallback;

var _userModel = require('./user.model');

var _userModel2 = _interopRequireDefault(_userModel);

var _monstaMonstaModel = require('../monsta/monsta.model');

var _monstaMonstaModel2 = _interopRequireDefault(_monstaMonstaModel);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _configEnvironment = require('../../config/environment');

var _configEnvironment2 = _interopRequireDefault(_configEnvironment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

function validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return function (err) {
        res.status(statusCode).json(err);
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

/**
 * Get list of users
 * restriction: 'admin'
 */

function index(req, res) {
    _userModel2['default'].findAsync({}, '-salt -password').then(function (users) {
        res.status(200).json(users);
    })['catch'](handleError(res));
}

/**
 * Creates a new user
 */

function create(req, res, next) {

    // Create new user object
    var newUser = new _userModel2['default'](req.body);

    _userModel2['default'].find({
        name: newUser.name
    }, '-salt -hashedPassword', function (err, users) {
        if (err) return res.send(500, err);

        if (users && users.length > 0) {
            res.json(409, {
                err: 'USERNAME_TAKEN',
                message: 'Username already taken'
            });
        }
    });

    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.saveAsync().spread(function (user) {
        var token = _jsonwebtoken2['default'].sign({ _id: user._id }, _configEnvironment2['default'].secrets.session, {
            expiresIn: 60 * 60 * 5
        });
        res.json({ token: token });
    })['catch'](validationError(res));
}

/**
 * Get a single user
 */

function show(req, res, next) {
    var userId = req.params.id;

    _userModel2['default'].findByIdAsync(userId).then(function (user) {
        if (!user) {
            return res.status(404).end();
        }
        res.json(user.profile);
    })['catch'](function (err) {
        return next(err);
    });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */

function destroy(req, res) {
    _userModel2['default'].findByIdAndRemoveAsync(req.params.id).then(function () {
        res.status(204).end();
    })['catch'](handleError(res));
}

/**
 * Change a users password
 */

function changePassword(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    _userModel2['default'].findByIdAsync(userId).then(function (user) {
        if (user.authenticate(oldPass)) {
            user.password = newPass;
            return user.saveAsync().then(function () {
                res.status(204).end();
            })['catch'](validationError(res));
        } else {
            return res.status(403).end();
        }
    });
}

/**
 * Get my info
 */

function me(req, res, next) {
    var userId = req.user._id;

    _userModel2['default'].findOneAsync({ _id: userId }, '-salt -password').then(function (user) {
        // don't ever give out the password or salt
        if (!user) {
            return res.status(401).end();
        }
        res.json(user);
    })['catch'](function (err) {
        return next(err);
    });
}

/**
 * Search a user by username
 */

function search(req, res, next) {

    var username = req.params.username;

    _userModel2['default'].findOneAsync({
        name: username
    }).then(function (user) {
        if (!user) {
            return res.status(404).end();
        }
        res.json(user.profile);
    })['catch'](function (err) {
        return next(err);
    });
}

/**
 * Get pending monsters of user
 */

function pendingMonstas(req, res, next) {
    var userId = mongoose.Types.ObjectId(req.params.id);

    console.log('userId', userId);

    _monstaMonstaModel2['default'].findAsync({
        'head.user': userId
    })
    // .select({ name: 1, head: 0, stomach: 0 })
    .then(function (monstas) {
        // don't ever give out the password or salt
        if (!monstas) {
            return res.status(401).end();
        }
        res.json(monstas.length);
    })['catch'](function (err) {
        return next(err);
    });

    // User
    //     .findOneAsync({ _id: userId }, '-salt -password')
    //     .then(user => { // don't ever give out the password or salt
    //         if (!user) {
    //             return res.status(401).end();
    //         }
    //         res.json(user);
    //     })
    //     .catch(err => next(err));
}

/**
 * Authentication callback
 */

function authCallback(req, res, next) {
    res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map
