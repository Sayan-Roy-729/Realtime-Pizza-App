const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

const init = (passport) => {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                // Login
                // check if email exits
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, {
                        message: "No user with this email exits",
                    });
                }

                bcrypt
                    .compare(password, user.password)
                    .then((match) => {
                        if (match) {
                            return done(null, user, {
                                message: "Logged in successfully",
                            });
                        }
                        return done(null, false, {
                            message: "Wrong username or password",
                        });
                    })
                    .catch((err) => {
                        return done(null, false, {
                            message: "Something went wrong. Try again!",
                        });
                    });
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};

module.exports = init;
