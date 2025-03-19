const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");
const { listingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");



// Validations --------------------
// 1. listing joi
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
router.get("/new", wrapAsync((req, res) => {
    res.render("listings/new.ejs")
}))

// Show Route
router.get("", wrapAsync(async (req, res, next) => {
    try {
        console.log("Views directory:", router.get("views"));
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings })
    } catch (error) {
        next(error)
    }

}))

// Create Route
router.post("", validateListing, wrapAsync(async (req, res) => {
    let new_listing = new Listing(req.body.listing);
    await new_listing.save();
    res.redirect("/pathlistings");
}))

// Index Route 
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing_x = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing_x });
}))

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing_x = await Listing.findById(id)
    res.render("listings/edit.ejs", { listing_x })
}))

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {

    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/${id}`)
}))

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id)
    console.log(deletedListing);
    res.redirect("/pathlistings")
}))


module.exports = router;