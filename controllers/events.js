const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const Event = require("../models/events");

const CreateEvent = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(401).json({error:"only admin can access"})
  }

  const { EventName, date, location, price } = req.body;

  if (!EventName || !date || !location || !price) {
    res.status(400).json({ error: "Enter all fields" });
  }

  const event = await Event.create({
    EventName,
    date,
    location,
    price,
  });

  if (event) {
    res.status(200).json(event);
  } else {
    res.status(400).json({ error: "Error While creating Event" });
  }
});

const EventDetails = asyncHandler(async (req, res) => {
  const eventId = await Event.findOne({ _id: req.params.id });
  if (eventId) {
    res.status(200).json(eventId);
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

const AllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();
  if (events) {
    res.status(200).json(events);
  } else {
    res.status(404).json({ error: "Events not found" });
  }
});

const DeleteEvent = asyncHandler(async (req, res) => {

  if (req.user.role !== "admin") {
    res.status(401).json({error:"only admin can access"})
  }
  
  const eventId = await Event.findById(req.params.id);

  if (eventId) {
    await Event.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Deleted successfully", eventId });
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

module.exports = {
  CreateEvent,
  EventDetails,
  AllEvents,
  DeleteEvent,
};
