const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const populatingDBAtFirst = require("./init/index.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

require('dotenv').config();

const app = express();

// app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

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
    res.send("Helloww, I am root");
});


app.use("/pathlistings", listings);
app.use("/pathlistings/:id/reviews", reviews);


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


