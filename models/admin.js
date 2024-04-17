const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    role:{
      type:String,
      required:[true,"specify the user role"]
    },
    adminname: {
      type: String,
      required: [true, "Please enter a username"],
    },
    proof: {
      type: String,
      required: [true, "Please enter proof"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: [true, "Email address already exists"],
    },
    phone: {
      type: String, 
      required: [true, "please enter mobile number"],
      unique:[true,"Mobile number already Exists"]
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
