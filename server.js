const express = require("express");
const connectDb = require("./config/DBconnection");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();
connectDb();
app.use(express.json());
app.use("/tickets", require("./Routes/tickets"));
app.use("/admin", require("./Routes/admin"));
app.use("/user", require("./Routes/user"));
app.use("/events", require("./Routes/events"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/ `);
});
