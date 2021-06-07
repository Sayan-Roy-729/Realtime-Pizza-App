const moment = require("moment");

const Order = require("../../../models/order");

exports.index = async (req, res, next) => {
    const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
    });
    res.header(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.render("customers/orders", { orders, moment: moment });
};

exports.store = (req, res, next) => {
    const { phone, address } = req.body;

    // Validate request
    if (!phone || !address) {
        req.flash("error", "All fields are required!");
        return res.redirect("/cart");
    }

    const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
    });

    order
        .save()
        .then((result) => {
            req.flash("success", "Order placed successfully");
            delete req.session.cart;
            return res.redirect("/customer/orders");
        })
        .catch((err) => {
            req.flash("error", "Something went wrong");
            return res.redirect("/cart");
        });
};