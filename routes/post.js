require('../models/Category');
require('../models/Post');

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Post = mongoose.model('posts');

router.get('/:url', (req, resp) => {
    console.log('url', req.params.url);
    Post
        .findOne({ url: req.params.url })
        .then(post => {
            if (post) {
                console.log('post', post);
                resp.render('blog/post', { post: post.toJSON() });
            } else {
                resp.redirect('/not-found');
            }
        })
        .catch(() => {
            resp.redirect('/not-found');
        });
});

module.exports = router;
