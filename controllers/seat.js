const SEAT = require("../models/seat");
const asyncHandler = require("express-async-handler");
const USER = require("../models/user");
const EVENT = require("../models/events")
const selectSeat = asyncHandler(async (req, res) => {
  const { user, EventName, seatNumber, date } = req.body;

   const getUser = await USER.findOne(user).populate("username");
   const getEvent = await EVENT.findone(EventName).populate("EventName")

   const seat = SEAT.create({
    user:getUser,
    EventName:getEvent,
    seatNumber,
    date
   })

   if (seat) {
    res.status(200).json({success:True,message});
  } else {
    res.status(400).json({ error: "Error While creating Event" });
  }
});
