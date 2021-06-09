const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
    const { phone, address, stripeToken, paymentType } = req.body;

    // Validate request
    if (!phone || !address) {
        return res.status(422).json({ message: "All field are required" });
        // req.flash("error", "All fields are required!");
        // return res.redirect("/cart");
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
            Order.populate(
                result,
                { path: "customerId" },
                (err, placedOrder) => {
                    // req.flash("success", "Order placed successfully");

                    // Stripe payment
                    if (paymentType === "card") {
                        stripe.charges
                            .create({
                                amount: req.session.cart.totalPrice * 100,
                                source: stripeToken,
                                currency: "inr",
                                description: `Pizza order: ${placedOrder._id}`,
                            })
                            .then(() => {
                                placedOrder.paymentStatus = true;
                                placedOrder.paymentType = paymentType;
                                placedOrder
                                    .save()
                                    .then((result) => {
                                        console.log(result);
                                        
                                        // Emit event
                                        const eventEmitter = req.app.get("eventEmitter");
                                        eventEmitter.emit("orderPlaced", result);

                                        delete req.session.cart;
                                        return res.json({ message: "Payment successful, order placed successfully" });
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            })
                            .catch((err) => {
                                // For payment failed
                                delete req.session.cart;
                                return res.status(500).json({message: 'Order placed but payment failed! You can pay at delivery time.'});
                            });
                    } else {
                        delete req.session.cart;
                        console.log('Cash on delivery');
                        return res.json({message: 'Order placed successfully.'});
                    }
                }
            );
        })
        .catch((err) => {
            // req.flash("error", "Something went wrong");
            return res.status(500).json({ message: "Something went wrong!" });
            // return res.redirect("/cart");
        });
};

exports.show = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    // Authorize user
    if (req.user._id.toString() === order.customerId.toString()) {
        res.render("customers/singleOrder", { order });
        return;
    }
    res.redirect("/");
};
