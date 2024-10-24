const mongoose = require("mongoose");

const seatSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    EventName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: [true, "Event name is required"],
    },
    seatNumber: {
      type: Number,
      required: [true, "Please select seat number"],
      unique: [true, "seat is already reserved"],
    },
    date: {
      type: Date, //not less than current time
      required: [true, "Date is required to select seat"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("seat", seatSchema);
