import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localAuthenticate(User, username, password, done) {

    // console.log('Searching user: ' + username);

    User.findOneAsync({
            name: username //.toLowerCase()
        })
        .then(user => {

            // console.log('Found user: ', user); // OK !

            if (!user) {
                return done(null, false, {
                    message: 'This username is not registered.'
                });
            }
            user.authenticate(password, function(authError, authenticated) {

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
                    user.save(function(err, _user) {
                        if (err) return done(err);
                        return done(null, _user);
                    });
                    
                }
            });
        })
        .catch(err => done(err));
}

export function setup(User, config) {
    // console.log('Setup passport local strategy'); // OK!
    passport.use(new LocalStrategy({
        usernameField: 'username', // The field in the request body representing the username
        passwordField: 'password' // this is the virtual field on the model
    }, function(username, password, done) {
        // console.log('Passport localAuthenticate function');
        return localAuthenticate(User, username, password, done);
    }));
}
