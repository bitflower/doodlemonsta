/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/monstas              ->  index
 * POST    /api/monstas              ->  create
 * GET     /api/monstas/:id          ->  show
 * PUT     /api/monstas/:id          ->  update
 * DELETE  /api/monstas/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.index = index;
exports.show = show;
exports.create = create;
exports.update = update;
exports.destroy = destroy;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _monstaModel = require('./monsta.model');

var _monstaModel2 = _interopRequireDefault(_monstaModel);

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {

            // Populate users
            // Workaround, solange noch buggy !!
            _monstaModel2['default'].deepPopulate(entity, 'head.user stomach.user legs.user', function (err, _entity) {

                // "De-mongoosify" object
                var clone = _entity.toObject({ virtuals: true });

                if (clone.head.user) {
                    _lodash2['default'].set(clone, 'head.user', clone.head.user.profile);
                }
                if (clone.stomach.user) {
                    _lodash2['default'].set(clone, 'stomach.user', clone.stomach.user.profile);
                }
                if (clone.legs.user) {
                    _lodash2['default'].set(clone, 'legs.user', clone.legs.user.profile);
                }

                res.status(statusCode).json(clone);
            });

            // res.status(statusCode).json(entity);
        }
    };
}

// function populate(entities, path) {
//     Monsta.populate(entities, {
//             path: path,
//             model: 'User'
//         },
//         function(err, docs) {
//             if (err) return callback(err);
//             // console.log(cars); // This object should now be populated accordingly.
//         });
// }

function saveUpdates(updates) {
    return function (entity) {
        var updated = _lodash2['default'].merge(entity, updates);
        return updated.saveAsync().spread(function (updated) {
            return updated;
        });
    };
}

function removeEntity(res) {
    return function (entity) {
        if (entity) {
            return entity.removeAsync().then(function () {
                res.status(204).end();
            });
        }
    };
}

function handleEntityNotFound(res) {
    return function (entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Monstas

function index(req, res) {
    _monstaModel2['default'].findAsync().then(respondWithResult(res))['catch'](handleError(res));
}

// Gets a single Monsta from the DB

function show(req, res) {
    _monstaModel2['default'].findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(respondWithResult(res))['catch'](handleError(res));
}

// Creates a new Monsta in the DB

function create(req, res) {
    _monstaModel2['default'].createAsync(req.body).then(respondWithResult(res, 201))['catch'](handleError(res));
}

// Updates an existing Monsta in the DB

function update(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    _monstaModel2['default'].findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(saveUpdates(req.body)).then(respondWithResult(res))['catch'](handleError(res));
}

// Deletes a Monsta from the DB

function destroy(req, res) {
    _monstaModel2['default'].findByIdAsync(req.params.id).then(handleEntityNotFound(res)).then(removeEntity(res))['catch'](handleError(res));
}
//# sourceMappingURL=monsta.controller.js.map
