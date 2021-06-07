const express = require("express");

const homeController = require("../app/http/controllers/homeController");
const authControllers = require("../app/http/controllers/authController");
const cartControllers = require("../app/http/controllers/customers/cartController");
const guest = require("../app/http/middlewares/guest");

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

module.exports = router;
