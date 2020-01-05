'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _mongoose = require('mongoose');

// Plugins
var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var autoIncrement = require('bluebird').promisifyAll(require('mongoose-auto-increment'));
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var MonstaSchema = new mongoose.Schema({
    version: {
        type: Number,
        'default': 1.0
    },
    name: String,
    createdOn: {
        type: Date,
        'default': Date.now
    },
    head: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                'default': 0
            },
            height: {
                type: Number,
                'default': 0
            },
            devicePixelRatio: {
                type: Number,
                'default': 1
            }
        },
        user: {
            type: _mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    stomach: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                'default': 0
            },
            height: {
                type: Number,
                'default': 0
            },
            devicePixelRatio: {
                type: Number,
                'default': 1
            }
        },
        user: {
            type: _mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    legs: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                'default': 0
            },
            height: {
                type: Number,
                'default': 0
            },
            devicePixelRatio: {
                type: Number,
                'default': 1
            }
        },
        user: {
            type: _mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    complete: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                'default': 0
            },
            height: {
                type: Number,
                'default': 0
            }
        }
    }
});

// needs Information
MonstaSchema.virtual('needs').get(function () {

    if (this.head.paperjs.length === 0) {
        return 'head';
    } else {
        if (this.stomach.paperjs.length === 0) {
            return 'stomach';
        } else {
            if (this.legs.paperjs.length === 0) {
                return 'legs';
            } else {
                return 'complete';
            }
        }
    }
});

MonstaSchema.set('toJSON', {
    virtuals: true
});

// Auto increment _id as per standard
MonstaSchema.plugin(autoIncrement.plugin, {
    model: 'Monsta',
    startAt: 1
});

MonstaSchema.plugin(deepPopulate);
// MonstaSchema.plugin(deepPopulate, {
//     populate: {
//         'head.user': {
//             select: 'profile'
//         }
//     }
// });
// MonstaSchema.plugin(deepPopulate, {
//     populate: 'head.user'

//     // populate: {
//     //     'head.user': {
//     //         select: 'name'
//     //     }
//     // }
// });

exports['default'] = mongoose.model('Monsta', MonstaSchema);
module.exports = exports['default'];
//# sourceMappingURL=monsta.model.js.map
