import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export function setup(User, config) {
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            profileFields: [
                'displayName',
                'emails'
            ]
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOneAsync({
                    'facebook.id': profile.id
                })
                .then(user => {
                    if (user) {

                        // Set last login date
                        user.lastLogin = new Date();
                        user.save(function(err, _user) {
                            if (err) return done(err);
                            return done(null, _user);
                        });

                    } else {

                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            role: 'user',
                            provider: 'facebook',
                            facebook: profile._json
                        });

                        user.saveAsync()
                            .then(user => done(null, user))
                            .catch(err => done(err));
                    }

                })
                .catch(err => done(err));
        }));
}
