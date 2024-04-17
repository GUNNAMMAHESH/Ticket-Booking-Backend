require("../middleware/errorHandler").default;
const asyncHandler = require("express-async-handler");
const Tickets = require("../models/ticket");
const Event = require("../models/events");

const GetTickets = asyncHandler(async (req, res) => {
  const ticket = await Tickets.find({ user_id: req.user.id });
  if (!ticket) {
    res.status(200).json({ error: "Tickets not Found" });
  }
  res.status(200).json(ticket);
});

const GetTicketById = asyncHandler(async (req, res) => {
  const ticket = await Tickets.find({ _id: req.params.id });
  res.status(200).json(ticket);
});


const CreateTicket = asyncHandler(async (req, res) => {
  const { EventName, location, date, price } = req.body;

  if (!EventName || !location || !date || !price) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  const availableEvent = await Event.findOne({ EventName });
  if (!availableEvent) {
    res.status(404).json({ error: "Event not found" });
    return;
  }
  const generateSeat = () => {
    const randNum = Math.round(Math.random() * 100);
    return "TIC" + randNum;
  };

  let SeatNumber;
  let isUnique = false;
  while (!isUnique) {
    SeatNumber = generateSeat();
    const existingTicket = await Tickets.findOne({ SeatNumber });
    if (!existingTicket) {
      isUnique = true;
    }
  }
 

  const ticket = await Tickets.create({
    user_id: req.user.id,
    EventName,
    location,
    date,
    SeatNumber,
    price,
  });

  res.status(201).json(ticket);
});

const cancleTicketById = asyncHandler(async (req, res) => {
  const ticket = await Tickets.findById(req.params.id);
  console.log(ticket);
  if (!ticket) {
    return res.status(404).json({ error: "Ticket not found" });
  }

  if (ticket.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete this ticket");
  }

  try {
    const delTicket = await Tickets.deleteOne({ _id: req.params.id });

    res.status(200).json({
      message: "Ticket deleted successfully",
      deletedTicket: delTicket,
    });
  } catch (error) {
    
    console.error("Error in deleteTicket:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { GetTickets, GetTicketById, CreateTicket, cancleTicketById };
