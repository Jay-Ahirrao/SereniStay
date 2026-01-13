const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");
require('dotenv').config();

// Use environment variable for MongoDB connection
const MONGO_URL = process.env.MONGO_URL ;

// main()
//     .then(() => {
//         console.log("Connected to DB in index.js");
//     })
//     .catch((err) => {
//         console.log(err);
//     });


async function populatingDBAtFirst() {
    await mongoose.connect(MONGO_URL);
    const isdata = await Listing.find();
    if(isdata.length > 0) {
        console.log("Database already initialized with data.");
        return;
    }   
    // await Listing.deleteMany({});
    console.log(data);
    await Listing.insertMany(data);
    console.log("Data was initialised");

}
module.exports = populatingDBAtFirst;
