const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    EventName: {
      type: String,
      required: [true, "please enter event name"],  // Fixed spelling from "reguired" to "required"
    },
    description: {  // Corrected spelling from "discription" to "description"
      type: String,
    },
    date: {
      type: Date,
      required: [true, "please enter event date"],
    },
    location: {
      type: String,
      required: [true, "please enter location"],
    },
    price: {
      type: Number,
      required: [true, "please enter price"],
    },
    photo: {  // Ensure photo is defined here
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("events", eventSchema);
