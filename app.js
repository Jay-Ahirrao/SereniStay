const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const populatingDBAtFirst = require("./init/index.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

require('dotenv').config();

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const User = require('./models/user.js');

const app = express();

// Ensure a session secret is available; use a safe fallback for development
const sessionSecret = process.env.SECRET || 'dev-secret-change-me';
if (!process.env.SECRET) {
    console.warn('Warning: environment variable SECRET is not set. Using a fallback session secret. Set SECRET in your .env for production.');
}

// app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        touchAfter: 24 * 3600
    }),
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}));
app.use(flash());

// Set currentUser middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.session ? req.session.userId : null;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    populatingDBAtFirst();
}

// Root 
app.get("/", (req, res) => {
    res.render("home");
});



app.use("/pathlistings", listings);
app.use("/pathlistings/:id/reviews", reviews);
app.use('/', user);


app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server is listening to port ${process.env.PORT}`);
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})

app.use((error, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = error;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});


