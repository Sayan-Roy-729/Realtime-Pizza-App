const express = require('express');

const homeController = require('../app/http/controllers/homeController');
const authControllers = require('../app/http/controllers/authController');
const cartControllers = require('../app/http/controllers/customers/cartController');

const router = express.Router();

// For Home page
router.get('/', homeController);

// For Cart Page
router.get('/cart', cartControllers.index);

// For login
router.get('/login', authControllers.login);

// For register
router.get('/register', authControllers.register);

// Add pizza to the cart
router.post('/update-cart', cartControllers.update);


module.exports = router;