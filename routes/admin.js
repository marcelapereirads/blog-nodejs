require('../models/Category');
require('../models/Post');

const express = require('express');
const mongoose = require('mongoose');
const Category = mongoose.model('categories');
const Post = mongoose.model('posts');
const router = express.Router();

router.get('/', (req, resp) => resp.render('admin/index'));

router.get('/categories', (req, resp) => {
    Category.find()
        .then((categories) => resp.render('admin/categories', { categories: categories.map(cat => cat.toJSON()) }))
        .catch(() => {
            addAlert(req, 'error', 'Error listing categories');
            redirectMainCategory(resp);
        });
});

router.get('/categories/new', (req, resp) => resp.render('admin/category-form'));

router.post('/categories/new', (req, resp) => {
    const valid = validateCategory(req);

    if (valid) {
        const newCategory = {
            name: req.body.name,
            url: req.body.url
        };

        new Category(newCategory).save()
            .then(() => {
                addAlert(req, 'success', 'Category created successfully');
                redirectMainCategory(resp);
            })
            .catch(() => {
                addAlert(req, 'error', 'Error saving category');
            });
    }
});

router.get('/categories/edit/:id', (req, resp) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            resp.render('admin/category-form', { category: category.toJSON() });
        })
        .catch(() => {
            addAlert(req, 'error', 'Error querying category');
            redirectMainCategory(resp);
        });
});

router.post('/categories/edit/:id', (req, resp) => {
    const valid = validateCategory(req);

    if (valid) {
        Category.findOne({ _id: req.params.id })
            .then((category) => {
                category.name = req.body.name;
                category.url = req.body.url;

                category.save()
                    .then(() => {
                        addAlert(req, 'success', 'Category edited successfully');
                        redirectMainCategory(resp);
                    })
                    .catch(() => {
                        addAlert(req, 'error', 'Error editing category');
                        redirectMainCategory(resp);
                    });
            })
            .catch(() => {
                addAlert(req, 'error', 'Error editing category');
                redirectMainCategory(resp);
            })
    }
    
});

router.get('/categories/delete/:id', (req, resp) => {
    Category.remove({ _id: req.params.id })
        .then(() => {
            addAlert(req, 'success', 'Category deleted successfully');
            redirectMainCategory(resp);
        })
        .catch(() => {
            addAlert(req, 'error', 'Error deleting category');
            redirectMainCategory(resp);
        });
});

router.get('/posts', (req, resp) => {
    Post
        .find()
        .lean()
        .populate('category')
        .sort({ data: 'desc' })
        .then(posts => resp.render('admin/posts', { posts
         }))
        .catch(() => {
            addAlert(req, 'error', 'Error listing posts');
            redirectMainPost(resp);
        });
});

router.get('/posts/new', (req, resp) => {
    Category
        .find()
        .then((categories) => resp.render('admin/post-form', { categories: categories.map(cat => cat.toJSON()) }))
        .catch(() => {
            addAlert(req, 'error', 'Error listing category');
            redirectMainCategory(resp);
        });
});

router.post('/posts/new', (req, resp) => {
    if (validatePost(req)) {
        const newPost = {
            ...req.body
        };

        new Post(newPost).save()
            .then(() => {
                addAlert(req, 'success', 'Post created successfully');
                redirectMainPost(resp);
            })
            .catch(() => {
                addAlert(req, 'error', 'Error saving post');
            });
    }
});

router.get('/posts/edit/:id', (req, resp) => {
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
                    addAlert(req, 'error', 'Error querying posts');
                    redirectMainPost(resp);
                })
        })
        .catch(() => {
            addAlert(req, 'error', 'Error querying posts');
            redirectMainPost(resp);
        });
});

router.post('/posts/edit/:id', (req, resp) => {
    if (validatePost(req)) {
        Post
            .findOne({ _id: req.params.id })
            .then((post) => {
                Object.entries(req.body).forEach(([key, value]) => post[key] = value);

                post.save()
                    .then(() => {
                        addAlert(req, 'success', 'Post edited successfully');
                        redirectMainPost(resp);
                    })
                    .catch(() => {
                        addAlert(req, 'error', 'Error editing post');
                        redirectMainPost(resp);
                    });
            })
            .catch((err) => {
                addAlert(req, 'error', 'Error editing post');
                redirectMainPost(resp);
            })
    }
});

router.get('/post/delete/:id', (req, resp) => {
    Post.remove({ _id: req.params.id })
        .then(() => {
            addAlert(req, 'success', 'Post deleted successfully');
            redirectMainPost(resp);
        })
        .catch(() => {
            addAlert(req, 'error', 'Error deleting post');
            redirectMainPost(resp);
        });
});


const addAlert = (req, type, message) => {
    req.flash(type === 'success' ? 'success_msg' : 'error_msg', message);
}

const redirectMainCategory = (resp) => {
    resp.redirect('/admin/categories');
}

const redirectMainPost = (resp) => {
    resp.redirect('/admin/posts');
}

const validateCategory = (req) => {
    if (!req.body.name || !req.body.url) {
        return false;
    }

    return true;
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
