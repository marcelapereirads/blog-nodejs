require('../models/Category');

const express = require('express');
const mongoose = require('mongoose');
const Category = mongoose.model('categories');
const router = express.Router();

router.get('/', (req, resp) => resp.render('admin/index'));

router.get('/posts', (req, resp) => resp.send('Posts'));

router.get('/categories', (req, resp) => resp.render('admin/categories'));

router.get('/categories/new', (req, resp) => resp.render('admin/new-category'));

router.post('/categories/new', (req, resp) => {
    const newCategory = {
        name: req.body.name,
        url: req.body.url
    };

    new Category(newCategory).save()
        .then(() => {
            req.flash('success_msg', 'Category created successfully');
            resp.redirect('/admin/categories');
        })
        .catch((err) => {
            console.log('Error saving category:', err);
            req.flash('error_msg', 'Error saving category');
            resp.redirect('/admin/categories');
        });
});

module.exports = router;
