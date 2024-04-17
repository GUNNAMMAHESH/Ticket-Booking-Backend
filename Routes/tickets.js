const express = require("express");
const Router = express.Router();
const {GetTickets,GetTicketById,CreateTicket,cancleTicketById} = require("../controllers/Tickets");
const validateToken = require("../middleware/validateTokenHandler");

Router.use(validateToken)
Router.route("/createTicket").post(CreateTicket)
Router.route("/DeleteTicket/:id").delete(cancleTicketById)

Router.route("/getTickets").get(GetTickets)
Router.route("/getTicket/:id").get(GetTicketById)



module.exports = Router;
