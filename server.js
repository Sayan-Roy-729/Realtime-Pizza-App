const path = require("path");
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const env = require("dotenv");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");

const app = express();

// Global Variable
env.config();
app.use(express.json());

// Database connection
const url = process.env.MONGODB_URI;
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
});
const connection = mongoose.connection;
connection
    .once("open", () => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log("Database connection failed");
    });

// Session store
// const mongoStore = new MongoDbStore({
//     mongooseConnection: connection,
//     collection: "sessions",
// });

// Session config
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
        store: MongoDbStore.create({
            mongoUrl: process.env.MONGODB_URI,
            collectionName: "sessions",
        }),
    })
);

app.use(flash());

// set Template engine
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayout);
app.set("views", path.join(__dirname, "resources", "views"));
app.set("view engine", "ejs");

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Import all required routes
app.use("/", require("./routes/web"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
