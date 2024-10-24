const express = require("express");
const connectDb = require("./config/DBconnection");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();
const app = express();
const cookieParse = require("cookie-parser");
const cors = require("cors");

connectDb();
app.use(express.json());
app.use(cookieParse());
const corsOptions = {
  origin: "https://ticket-booking-backend-h8iyimsal-maheshs-projects-7b91ea20.vercel.app/",
  methods: "GET,POST,PUT,PATCH,DELETE",
  credentials: true, // Allow credentials (cookies, authentication headers, etc.)
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use("/tickets", require("./Routes/tickets"));
app.use("/admin", require("./Routes/admin"));
app.use("/user", require("./Routes/user"));
app.use("/events", require("./Routes/events"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/ `);
});
