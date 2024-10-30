const express = require("express");
const {
  CreateEvent,
  EventDetails,
  AllEvents,
  UpdateEvent,
  DeleteEvent,
} = require("../controllers/events");
const validateToken = require("../middleware/validateTokenHandler");
const Router = express.Router();

Router.use(validateToken)
Router.post("/create", CreateEvent);
Router.get("/eventdetails/:id", EventDetails);
Router.get("/allevents", AllEvents);
Router.patch("/editEvent",UpdateEvent)
Router.delete("/delete/:id", DeleteEvent);

module.exports = Router;
