module.exports = {
    authenticated(req, resp, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        resp.redirect('/');
    }
}
