'use strict';

import express from 'express';
import passport from 'passport';
import { signToken } from '../auth.service';

var router = express.Router();

router.post('/', function(req, res, next) {

    // console.log('Receiving login request: ', req.body); // OK !

    passport.authenticate('local', function(err, user, info) {

        var error = err || info;
        if (error) {
            // console.log('ERROR in strategy', error);
            return res.status(401).json(error);
        }
        if (!user) {
            // console.log('USER NOT FOUND');
            return res.status(404).json({ message: 'Something went wrong, please try again.' });
        }

        // console.log('Trying to sign token'); OK !

        var token = signToken(user._id, user.role);
        // console.log('TOKEN', token); // OK !

        res.json({ token });

    })(req, res, next)
});

export default router;
