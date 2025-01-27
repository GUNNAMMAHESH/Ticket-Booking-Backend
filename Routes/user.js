const express = require("express");
const {
  createUser,
  loginUser,
  deleteUser,
  profile,
} = require("../controllers/user");
const validateToken = require("../middleware/validateTokenHandler");
const { sendOTP ,verifyCaptcha} = require('../controllers/otp');
const Router = express.Router();

Router.post("/create", createUser);
Router.post("/login", loginUser);
Router.post('/login-send-otp', sendOTP);

Router.get("/profile", validateToken, profile); 
Router.delete("/delete/:id", validateToken, deleteUser);

module.exports = Router;
