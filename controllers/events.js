const asyncHandler = require("express-async-handler");
const { uploadImageToCloudinary } = require("../config/coludinary");
const Event = require("../models/events");
const mongoose = require("mongoose");

const CreateEvent = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "only admin can access" });
  }

  const { EventName, date, location, price } = req.body;

  if (!EventName || !date || !location || !price) {
    return res.status(400).json({ error: "Enter all fields" });
  }

  let photoUrl = null;
  console.log("body:", req.body);
  console.log("files:", req.files);

  if (req.files && req.files.photo) {
    const photo = req.files.photo;

    try {
      const uploadedImage = await uploadImageToCloudinary(
        photo.tempFilePath, // Corrected path to tempFilePath
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      photoUrl = uploadedImage.secure_url;
    } catch (error) {
      return res.status(500).json({ error: "Error uploading image" });
    }
  }

  const event = await Event.create({
    EventName,
    date,
    location,
    price,
    photo: photoUrl,
  });

  return res.status(201).json(event);

  // console.log("uploadImageToCloudinary:", uploadImageToCloudinary);

  // if (!req.files || !req.files.photo) {
  //   return res.status(400).json({ error: "No file uploaded." });
  // }

  // const photo = req.files.photo;
});

const EventDetails = asyncHandler(async (req, res) => {
  const eventId = await Event.findById(req.params.id);
  if (eventId) {
    return res.status(200).json(eventId);
  } else {
    return res.status(404).json({ error: "Event not found" });
  }
});

const AllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();
  return res.status(200).json(events);
});

const UpdateEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(404).json({
      success: false,
      message: "Event Id is required for updating event",
    });
  }

  const empData = req.body;
  let photoUrl = null;

  if (req.files && req.files.photo) {
    const photo = req.files.photo;

    try {
      const uploadedImage = await uploadImageToCloudinary(
        photo.tempFilePath,
        process.env.FOLDER_NAME,
        1000,
        1000
      );
      photoUrl = uploadedImage.secure_url;
    } catch (error) {
      return res.status(500).json({ error: "Error uploading image" });
    }
  }

  // Include photo URL in the update if it exists
  if (photoUrl) {
    empData.photo = photoUrl;
  }

  const updatedEvent = await Event.findByIdAndUpdate(id, empData, {
    new: true,
  });
  if (!updatedEvent) {
    return res.status(404).json({ success: false, message: "Event Not Found" });
  }

  return res.status(200).json({
    success: true,
    data: updatedEvent,
    message: "Event Updated Successfully...",
  });
});

const DeleteEvent = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "Only admin can access this" });
  }

  const eventId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  await Event.deleteOne({ _id: eventId });

  return res
    .status(200)
    .json({ message: "Event deleted successfully", eventId });
});

module.exports = DeleteEvent;

module.exports = {
  CreateEvent,
  EventDetails,
  AllEvents,
  UpdateEvent,
  DeleteEvent,
};
