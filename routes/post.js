require('../models/Category');
require('../models/Post');

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = mongoose.model('posts');

router.get('/:url', (req, resp) => {
    Post
        .findOne({ url: req.params.url })
        .lean()
        .populate('category')
        .then(post => {
            if (post) {
                resp.render('blog/post', { post: post });
            } else {
                resp.redirect('/not-found');
            }
        })
        .catch(() => {
            resp.redirect('/not-found');
        });
});

module.exports = router;
