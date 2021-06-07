const express = require("express");

const homeController = require("../app/http/controllers/homeController");
const authControllers = require("../app/http/controllers/authController");
const cartControllers = require("../app/http/controllers/customers/cartController");
const orderControllers = require('../app/http/controllers/customers/orderController');
const adminOrderControllers = require('../app/http/controllers/admin/orderController');
const guest = require("../app/http/middlewares/guest");
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');

const router = express.Router();

// For Home page
router.get("/", homeController);

// For Cart Page
router.get("/cart", cartControllers.index);

// For login
router.get("/login", guest, authControllers.login);

// To handle the login
router.post("/login", authControllers.postLogin);

// For register page
router.get("/register", guest, authControllers.register);

// To handle the registration
router.post("/register", authControllers.postRegister);

// To handle the user logout
router.post('/logout', authControllers.logout);

// Add pizza to the cart
router.post("/update-cart", cartControllers.update);

// Order
router.post('/orders', auth, orderControllers.store);

// Orders page
router.get('/customer/orders', auth, orderControllers.index);

// Admin routes
router.get('/admin/orders', admin, adminOrderControllers.index);

module.exports = router;
