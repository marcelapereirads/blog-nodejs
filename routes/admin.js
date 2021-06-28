require('../models/Category');
require('../models/Post');

const express = require('express');
const router = express.Router();
const categoriesRoute = require('./admin-categories');
const postsRoute = require('./admin-posts');
const { authenticated } = require('../helpers/checkAuthentication');

router.use('/categories', categoriesRoute);

router.use('/posts', postsRoute);

router.get('/', authenticated, (req, resp) => resp.render('admin/index'));

module.exports = router;
