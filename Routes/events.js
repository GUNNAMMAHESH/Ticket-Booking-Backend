const express = require("express");
const {
  CreateEvent,
  EventDetails,
  AllEvents,
  UpdateEvent,
  DeleteEvent,
} = require("../controllers/events");

// Import validateToken and hasRole from the middleware
const validateToken = require("../middleware/validateTokenHandler");

const Router = express.Router();

// Define your routes
Router.post("/create", validateToken, CreateEvent); //hasRole("admin")
Router.get("/eventdetails/:id", EventDetails);
Router.get("/allevents", AllEvents);
Router.patch("/editEvent", validateToken, UpdateEvent);
Router.delete("/delete/:id", validateToken, DeleteEvent);

module.exports = Router;
