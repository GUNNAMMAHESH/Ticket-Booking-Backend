const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGOURL);
    console.log("database is connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectDb;
