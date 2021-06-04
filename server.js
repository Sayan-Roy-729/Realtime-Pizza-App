const path = require('path');
const express = require('express');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const app = express();

// set Template engine
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'resources', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
    res.render('home');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});