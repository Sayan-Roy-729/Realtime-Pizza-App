const path = require("path");
const Emitter = require("events");
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const env = require("dotenv");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");

const passportInit = require("./app/config/passport");

const app = express();

// Global Variable
env.config();
app.use(express.urlencoded({ extended: false }));
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

// Event emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

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

// Passport config
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// set Template engine
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayout);
app.set("views", path.join(__dirname, "resources", "views"));
app.set("view engine", "ejs");

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

// Import all required routes
app.use("/", require("./routes/web"));

// For 404 error page
app.use((req, res, next) => {
    res.status(404).render('/errors/404');
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Socket
const io = require("socket.io")(server);
// Setup the connection
io.on("connection", (socket) => {
    // If Joined, then there will be unique connection id
    console.log(socket.id);

    // After the connection, join with the specific room
    socket.on("join", (roomName) => {
        console.log(roomName);
        socket.join(roomName);
    });
});

eventEmitter.on("orderUpdated", (data) => {
    io.to(`order_${data.id}`).emit("order", data);
});

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data);
});
