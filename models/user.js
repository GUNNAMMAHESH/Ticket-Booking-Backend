const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
    },
    role: {
      type: String,
      default: "user",
      required: [true, "User role must be specified"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: [true, "Email address already exists"],
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
    },
    phone: {
      type: Number,
      required: [true, "Please enter a phone number"],
      unique: [true, "mobile number already exists"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
