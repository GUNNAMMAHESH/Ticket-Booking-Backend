const mongoose = require("mongoose");

const ticket = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    EventName: {
      type: String,
      required: [true, "Please enter contact number"],
    },
    location: {
      type: String,
      required: [true, "please enter location"],
    },
    date: {
      type: Date,
      required: [true, "please enter event date"],
    },
    SeatNumber: {
      type: String,
      required: [true, "Please enter contact email"],
    },
    price: {
      type: Number,
      required: [true, "please enter price"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ticket", ticket);
