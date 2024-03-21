const mongoose = require('mongoose');
require('dotenv').config();

let URI = process.env.mongourl || 'mongodb://localhost:27017/assignment-travl';

// Check if running inside Docker or not


console.log("Attempting to connect to MongoDB...");

mongoose.connect('mongodb://localhost:27017/assignment-travl',{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("connected mongodb");
}).catch(err=>{
    console.log(err)
})

// Listen for the MongoDB connection events


module.exports = mongoose;