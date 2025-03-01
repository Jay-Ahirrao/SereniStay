const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
// const routes = require('./routes/route1')
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js")

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/SereniStay"

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
    await mongoose.connect(MONGO_URL);
}

// Root 
app.get("/", (req, res) => {
    res.send("Helloww, I am root");
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// New Route
app.get("/pathlistings/new", wrapAsync((req, res) => {
    res.render("listings/new.ejs")
}))

// Show Route
app.get("/pathlistings", wrapAsync(async (req, res, next) => {
    try {
        console.log("Views directory:", app.get("views"));
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings })
    } catch (error) {
        next(error)
    }

}))

// Create Route
app.post("/pathlistings",validateListing, wrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, error);
    }
    let new_listing = new Listing(req.body.listing);
    await new_listing.save();
    res.redirect("/pathlistings")
}))

// Index Route 
app.get("/pathlistings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing_x = await Listing.findById(id)
    res.render("listings/show.ejs", { listing_x });
}))

// Edit Route
app.get("/pathlistings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing_x = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing_x })
}))

//Update Route
app.put("/pathlistings/:id", validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/pathlistings/${id}`)
}))

// Delete Route
app.delete("/pathlistings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/pathlistings")
}))

app.get("/testlisting", (req, res) => {
    let samplelisting = new Listing({
        title: "Canaught Palace",
        description: "most viewed palace",
        price: 3000,
        location: "Canaught city , Amritsar",
        country: "India"
    });

    samplelisting.save();
    console.log("sample was saved");
    res.send("successfull testing");
});


app.listen(8080, '0.0.0.0', () => {
    console.log("Server is listening to port 8080")
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"))
})

app.use((error, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = error;
    res.status(statusCode).render("error.ejs", { statusCode, message });
});


// app.use('/',routes)
// mongoose.connect('mongodb://127.0.0.1:27017/Smartphone_Details')
// .then(()=>{console.log('connnected to MongoDB ')})
// .catch(err=>{console.log(err);
// })
