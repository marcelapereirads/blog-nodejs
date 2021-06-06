require('dotenv/config');
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const adminRoute = require('./routes/admin');
const path = require('path');

const app = express();
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
