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
    photo:{
      type:String
    },
    discription: {
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
      // required: [true, "please enter price"],
    },
    SeatNumber: {
      type: String,
      required: [true, "Please enter contact email"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ticket", ticket);
