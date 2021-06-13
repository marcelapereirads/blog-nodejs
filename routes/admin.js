require('../models/Category');

const express = require('express');
const mongoose = require('mongoose');
const Category = mongoose.model('categories');
const router = express.Router();

router.get('/', (req, resp) => resp.render('admin/index'));

router.get('/posts', (req, resp) => resp.send('Posts'));

router.get('/categories', (req, resp) => {
    Category.find()
        .then((categories) => resp.render('admin/categories', { categories: categories.map(cat => cat.toJSON()) }))
        .catch((err) => {
            console.log('Error listing category:', err);
            addAlert(req, 'error', 'Error listing category');
            redirectMain(resp);
        });
});

router.get('/categories/new', (req, resp) => resp.render('admin/form-category'));

router.post('/categories/new', (req, resp) => {

    if (validateCategory(req)) {
        const newCategory = {
            name: req.body.name,
            url: req.body.url
        };

        new Category(newCategory).save()
            .then(() => {
                addAlert(req, 'success', 'Category created successfully');
                redirectMain(resp);
            })
            .catch((err) => {
                console.log('Error saving category:', err);
                addAlert(req, 'error', 'Error saving category');
            });
    } else {
        redirectMain(resp);
    }
});

router.get('/categories/edit/:id', (req, resp) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            resp.render('admin/form-category', { category: category.toJSON() });
        })
        .catch((err) => {
            console.log('Error querying category:', err);
            addAlert(req, 'error', 'Error querying category');
        });
});

router.post('/categories/edit/:id', (req, resp) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            category.name = req.body.name;
            category.url = req.body.url;

            category.save()
                .then(() => {
                    addAlert(req, 'success', 'Category edited successfully');
                    redirectMain(resp);
                })
                .catch((err) => {
                    console.log('Error editing category:', err);
                    addAlert(req, 'error', 'Error editing category');
                });
        })
        .catch((err) => {
            console.log('Error editing category:', err);
            addAlert(req, 'error', 'Error editing category');
        })
});

const addAlert = (req, type, message) => {
    req.flash(type === 'success' ? 'success_msg' : 'error_msg', message);
}

const redirectMain = (resp) => {
    resp.redirect('/admin/categories');
}

const validateCategory = (req) => {
    if (!req.body.name) {
        addAlert(req, 'error', 'Name is mandatory');
        return false;
    }

    if (!req.body.url) {
        addAlert(req, 'error', 'URL is mandatory');
        return false;
    }

    return true;
}

module.exports = router;
