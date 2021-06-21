require('../models/Category');
require('../models/Post');

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = mongoose.model('posts');

router.get('/', (req, resp) => {
    Post
        .find()
        .lean()
        .populate('category')
        .sort({ data: 'desc' })
        .then(posts => resp.render('index', { posts } ))
       .catch(() => {
           ////TO DO
           console.log('error');
       });
});

module.exports = router;
