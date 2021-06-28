const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const adminRoute = require('./routes/admin');
const postRoute = require('./routes/post');
const notFoundRoute = require('./routes/not-found');
const categoryRoute = require('./routes/category');
const loginRoute = require('./routes/login');
const Post = mongoose.model('posts');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const moment = require('moment');
const passport = require('passport');
require('./config/auth')(passport);
require('dotenv/config');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, resp, next) => {
    resp.locals.success_msg = req.flash('success_msg');
    resp.locals.error_msg = req.flash('error_msg');
    resp.locals.error_auth = req.flash('error');
    resp.locals.user = req.user || null;
    next();
});

app.use(express.urlencoded({
    extended:true
}));

app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
        formatDate: (date) => moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a')
    }
}));
app.set('view engine', 'handlebars');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser:true, useUnifiedTopology: true })
    .then(() => console.log('Connected to the blog database'))
    .catch((err) => console.log('Error connecting to database: ', err));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoute);
app.use('/post', postRoute);
app.use('/category', categoryRoute);

app.get('/', (req, resp) => {
    Post
        .find()
        .lean()
        .populate('category')
        .sort({ data: 'desc' })
        .then(posts => resp.render('index', { posts } ))
        .catch(() => {
            resp.redirect('/not-found');
        });
});

app.use('/login', loginRoute);

app.use('/not-found', notFoundRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${process.env.PORT}`));
