exports.index = (req, res, next) => {
    res.render('customers/cart');
};

exports.update = (req, res, next) => {
    // for the first time creating cart and adding basic object structure
    if (!req.session.cart) {
        req.session.cart = {
            items: {},
            totalQty: 0,
            totalPrice: 0,
        };
    }
    let cart = req.session.cart;

    // Check if item does not exits in cart
    if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
            item: req.body,
            qty: 1,
        };
    } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
    }

    cart.totalQty = cart.totalQty + 1;
    cart.totalPrice = cart.totalPrice + req.body.price;

    res.status(200).json({ totalQty: req.session.cart.totalQty });
};