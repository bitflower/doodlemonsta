'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
import { Schema } from 'mongoose';
var autoIncrement = require('bluebird').promisifyAll(require('mongoose-auto-increment'));

var MonstaSchema = new mongoose.Schema({
    version: {
        type: Number,
        default: 1.0
    },
    name: String,
    createdOn: {
        type: Date,
        default: Date.now
    },
    head: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
            devicePixelRatio: {
                type: Number,
                default: 1
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    trunk: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
            devicePixelRatio: {
                type: Number,
                default: 1
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    legs: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            },
            devicePixelRatio: {
                type: Number,
                default: 1
            }
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    complete: {
        paperjs: [],
        crossLines: [],
        canvas: {
            width: {
                type: Number,
                default: 0
            },
            height: {
                type: Number,
                default: 0
            }
        }
    }
});

// needs Information
MonstaSchema
    .virtual('needs')
    .get(function() {

        if (this.head.paperjs.length === 0) {
            return 'head';
        } else {
            if (this.trunk.paperjs.length === 0) {
                return 'trunk';
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

export default mongoose.model('Monsta', MonstaSchema);
