const path = require('path');
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const app = express();

// set Template engine
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayout);
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.render('home');
});

app.get('/cart', (req, res, next) => {
    res.render('customers/cart');
});

app.get('/login', (req, res, next) => {
    res.render('auth/login');
});

app.get('/register', (req, res, next) => {
    res.render('auth/register');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});