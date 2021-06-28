require('../models/User');

const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model("users");

module.exports = function(passport) {
    passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {
        const authError = () => done(null, null, { message: 'Incorrect username or password' });

        User
            .findOne({ email })
            .then(user => {
                if (!user) {
                    return authError();
                }

                bcrypt.compare(password, user.password, (error, match) => {
                    if (match) {
                        return done(null, user);
                    }

                    return authError();
                });
            })
            .catch(() =>  done(null, null, { message: 'Internal error' }));
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (error, user) => done(error, user));
    });
}
