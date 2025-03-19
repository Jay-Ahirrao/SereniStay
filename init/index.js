const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");
require('dotenv').config();

// Use environment variable for MongoDB connection
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/SereniStay";

main()
    .then(() => {
        console.log("Connected to DB in index.js");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
    initDB();
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("Data was initialised");
    
}

