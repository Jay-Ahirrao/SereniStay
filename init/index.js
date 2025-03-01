const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const data = require("./data.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/SereniStay";


main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

    
async function main(){
    await mongoose.connect(MONGO_URL);
    initDB();
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("Data was initialised");
    
}

initDB();
