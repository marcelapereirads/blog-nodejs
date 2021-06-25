require('../models/Category');
require('../models/Post');

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = mongoose.model('categories');
const Post = mongoose.model('posts');

router.get('/:url', (req, resp) => {
    Category
        .findOne({ url: req.params.url })
        .then(category => {
            if (category) {
                Post
                    .find({ category: category._id })
                    .then((posts) => {
                        if (posts) {
                            resp.render('blog/category', {
                                category: category.toJSON(),
                                posts: posts.map(posts => posts.toJSON())
                            });
                        } else {
                            resp.redirect('/not-found');
                        }
                    })
                    .catch(() => resp.redirect('/not-found'))
            } else {
                resp.redirect('/not-found');
            }
        })
        .catch(() => resp.redirect('/not-found'));
});

module.exports = router;
