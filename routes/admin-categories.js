const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = mongoose.model('categories');
const shared = require('./shared');
const { authenticated } = require('../helpers/checkAuthentication');

router.get('/', authenticated, (req, resp) => {
    Category.find()
        .then((categories) => resp.render('admin/categories', { categories: categories.map(cat => cat.toJSON()) }))
        .catch(() => {
            shared.addAlert(req, 'error', 'Error listing categories');
            redirectMain(resp);
        });
});

router.get('/new', authenticated, (req, resp) => resp.render('admin/category-form'));

router.post('/new', authenticated, (req, resp) => {
    const valid = validateCategory(req);

    if (valid) {
        const newCategory = {
            name: req.body.name,
            url: req.body.url
        };

        new Category(newCategory).save()
            .then(() => {
                shared.addAlert(req, 'success', 'Category created successfully');
                redirectMain(resp);
            })
            .catch(() => {
                shared.addAlert(req, 'error', 'Error saving category');
            });
    }
});

router.get('/edit/:id', authenticated, (req, resp) => {
    Category.findOne({ _id: req.params.id })
        .then((category) => {
            resp.render('admin/category-form', { category: category.toJSON() });
        })
        .catch(() => {
            shared.addAlert(req, 'error', 'Error querying category');
            redirectMain(resp);
        });
});

router.post('/edit/:id', authenticated, (req, resp) => {
    const valid = validateCategory(req);

    if (valid) {
        Category.findOne({ _id: req.params.id })
            .then((category) => {
                category.name = req.body.name;
                category.url = req.body.url;

                category.save()
                    .then(() => {
                        shared.addAlert(req, 'success', 'Category edited successfully');
                        redirectMain(resp);
                    })
                    .catch((err) => {
                        shared.addAlert(req, 'error', 'Error editing category');
                        console.log('err1', err);
                        redirectMain(resp);
                    });
            })
            .catch(() => {
                shared.addAlert(req, 'error', 'Error editing category');
                redirectMain(resp);
            })
    }
    
});

router.get('/delete/:id', authenticated, (req, resp) => {
    Category.remove({ _id: req.params.id })
        .then(() => {
            shared.addAlert(req, 'success', 'Category deleted successfully');
            redirectMain(resp);
        })
        .catch(() => {
            shared.addAlert(req, 'error', 'Error deleting category');
            redirectMain(resp);
        });
});

const validateCategory = (req) => {
    if (!req.body.name || !req.body.url) {
        return false;
    }

    return true;
}

const redirectMain = (resp) => {
    resp.redirect('/admin/categories');
}

module.exports = router;
