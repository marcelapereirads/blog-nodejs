const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('blog/not-found');
});

module.exports = router;
