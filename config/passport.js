/*!
 * Module dependencies.
 */
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;

/**
 * Models
 */
var User = mongoose.model('User');

/**
 * Configure PassportJS
 */
module.exports = function(passport, config) {
    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize sessions
    passport.deserializeUser(function(id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user);
        });
    });

    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            // Find the user with the email provided
            User.findOne({ email: email }, function (err, user) {
                // If an error occurred, call done with the error object
                if (err) { return done(err); }
                // If no user was found, call done with no error but with false as result and an extra message.
                if (!user) {
                    return done(null, false, { message: 'Unknown user' });
                }
                // If the user could not be authenticated, call done with no error but with false as result and an extra message.
                if (!user.authenticate(password)) {
                    return done(null, false, { message: 'Invalid password' });
                }
                // If we are succesfully authenticated, call done with no error object and with the user object.
                return done(null, user);
            });
        }
    ));
};
