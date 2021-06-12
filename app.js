require('dotenv/config');
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const adminRoute = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use((req, resp, next) => {
    resp.locals.success_msg = req.flash('success_msg');
    resp.locals.error_msg = req.flash('error_msg');
    next();
});

app.use(express.urlencoded({
    extended:true
}));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`, { useNewUrlParser:true, useUnifiedTopology: true })
    .then(() => console.log('Connected to the blog database'))
    .catch((err) => console.log('Error connecting to database: ', err));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${process.env.PORT}`));
