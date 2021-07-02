const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    req.logout();
    resp.redirect('/login');
});

module.exports = router;
