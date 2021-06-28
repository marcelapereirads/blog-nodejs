const express = require('express');
const router = express.Router();
const shared = require('./shared');
const passport = require('passport');

router.get('/', (req, resp) => {
    resp.render('blog/login');
});

router.post('/', (req, resp, next) => {
    if (validateLogin) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req, resp, next);
    } else {
        shared.addAlert(req, 'error', 'Please provide an email and a password');
    }
});

const validateLogin = (req) => {
    if (!req.body.login || !req.body.password) {
        return false;
    }

    return true;
}


module.exports = router;
