require('../models/Category');
require('../models/Post');

const express = require('express');
const router = express.Router();
const categoriesRoute = require('./admin-categories');
const postsRoute = require('./admin-posts');

router.use('/categories', categoriesRoute);

router.use('/posts', postsRoute);

module.exports = router;
