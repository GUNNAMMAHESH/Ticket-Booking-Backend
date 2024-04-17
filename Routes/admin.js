const express = require("express");
const {
  CreateAdmin,
  loginAdmin,
  adminProfile,
  deleteAdmin,
  GetAllUsers,
  AllTickets,
  DeleteUser,
} = require("../controllers/admin"); 
const validateToken = require("../middleware/validateTokenHandler");
const Router = express.Router();

Router.post("/create", CreateAdmin);
Router.post("/login", loginAdmin);
Router.get("/profile", validateToken, adminProfile);
Router.delete("/delete/:id", validateToken, deleteAdmin);

Router.get("/getusers", validateToken, GetAllUsers);
Router.get("/AllTickets", validateToken, AllTickets);
Router.delete("/deleteUser/:id", validateToken, DeleteUser);


module.exports = Router;
