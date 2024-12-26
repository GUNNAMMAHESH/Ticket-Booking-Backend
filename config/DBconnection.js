require("dotenv").config();
const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); 
  }
};
// const client = new MongoClient(process.env.MONGO_URL)

// const connectDb = async ()=>{
//   try {
//     await client.connect()
//     const db = client.db();
//     console.log(`Database Connected: ${db.databaseName}`);
//   } catch (error) {
//     console.log(error.message);
//     process.exit(1);
//   }
// }


module.exports = connectDb;
