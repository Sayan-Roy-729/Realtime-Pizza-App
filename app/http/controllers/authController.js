const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

exports.login = (req, res, next) => {
    res.render("auth/login");
};

exports.register = (req, res, next) => {
    res.render("auth/register");
};

exports.postRegister = async (req, res, next) => {
    const { name, email, password } = req.body;

    // validation request
    if (!name || !email || !password) {
        req.flash("error", "All fields are required");
        req.flash("name", name);
        req.flash("email", email);
        res.redirect("/register");
        return;
    }

    // Check if email already exits
    User.exists({ email }, (err, result) => {
        if (result) {
            req.flash("error", "Email already exits.");
            req.flash("name", name);
            req.flash("email", email);
            res.redirect("/register");
            return;
        }
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User
    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    user.save()
        .then((user) => {
            // Login
            return res.redirect("/");
        })
        .catch((err) => {
            req.flash("error", "Something went wrong. Try again!");
            res.redirect("/register");
        });
};

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;

    // validation request
    if (!email || !password) {
        req.flash("error", "All fields are required");
        res.redirect("/login");
        return;
    }
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            req.flash("error", info.message);
            return next(err);
        }
        if (!user) {
            req.flash("error", info.message);
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                req.flash("error", info.message);
                return next(err);
            }
            return res.redirect("/");
        });
    })(req, res, next);
};

exports.logout = (req, res, next) => {
    req.logout();
    return res.redirect("/login");
};
