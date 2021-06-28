const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = mongoose.model('categories');
const Post = mongoose.model('posts');
const shared = require('./shared');
const { authenticated } = require('../helpers/checkAuthentication');

router.get('/', authenticated, (req, resp) => {
    Post
        .find()
        .lean()
        .populate('category')
        .sort({ data: 'desc' })
        .then(posts => resp.render('admin/posts', { posts } ))
        .catch(() => {
            shared.addAlert(req, 'error', 'Error listing posts');
            redirectMain(resp);
        });
});

router.get('/new', authenticated, (req, resp) => {
    Category
        .find()
        .then((categories) => resp.render('admin/post-form', { categories: categories.map(cat => cat.toJSON()) }))
        .catch(() => {
            shared.addAlert(req, 'error', 'Error listing category');
            redirectMainCategory(resp);
        });
});

router.post('/new', authenticated, (req, resp) => {
    if (validatePost(req)) {
        const newPost = {
            ...req.body
        };

        new Post(newPost).save()
            .then(() => {
                shared.addAlert(req, 'success', 'Post created successfully');
                redirectMain(resp);
            })
            .catch(() => {
                shared.addAlert(req, 'error', 'Error saving post');
            });
    }
});

router.get('/edit/:id', authenticated, (req, resp) => {
    Post
        .findOne({ _id: req.params.id })
        .then(post => {
            Category
                .find()
                .then(categories => {
                    resp.render('admin/post-form', {
                        categories: categories.map(categories => categories.toJSON()),
                        posts: post.toJSON()
                    });
                })
                .catch(() => {
                    shared.addAlert(req, 'error', 'Error querying posts');
                    redirectMain(resp);
                })
        })
        .catch(() => {
            shared.addAlert(req, 'error', 'Error querying posts');
            redirectMain(resp);
        });
});

router.post('/edit/:id', authenticated, (req, resp) => {
    if (validatePost(req)) {
        Post
            .findOne({ _id: req.params.id })
            .then((post) => {
                Object.entries(req.body).forEach(([key, value]) => post[key] = value);

                post.save()
                    .then(() => {
                        shared.addAlert(req, 'success', 'Post edited successfully');
                        redirectMain(resp);
                    })
                    .catch(() => {
                        shared.addAlert(req, 'error', 'Error editing post');
                        redirectMain(resp);
                    });
            })
            .catch((err) => {
                shared.addAlert(req, 'error', 'Error editing post');
                redirectMain(resp);
            })
    }
});

router.get('/delete/:id', authenticated, (req, resp) => {
    Post.remove({ _id: req.params.id })
        .then(() => {
            shared.addAlert(req, 'success', 'Post deleted successfully');
            redirectMain(resp);
        })
        .catch(() => {
            shared.addAlert(req, 'error', 'Error deleting post');
            redirectMain(resp);
        });
});

const redirectMain = (resp) => {
    resp.redirect('/admin/posts');
}

const validatePost = (req) => {
    let valid = true;
    Object.entries(req.body)
        .forEach(([key, value]) => {
            if (!value) {
                valid = false;
            }
        });

    return valid;
}

module.exports = router;
