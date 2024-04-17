//admin

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../models/admin");
const User = require("../models/user");
const Tickets = require("../models/ticket");

const CreateAdmin = asyncHandler(async (req, res) => {
  const { adminname, proof, email, phone, password } = req.body;
  if (!adminname || !proof || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const adminAvailable = await Admin.findOne({ email });
  if (adminAvailable) {
    return res.status(400).json({ message: "Admin already registered!" });
  }

  const role = "admin";
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    role,
    adminname,
    proof,
    email,
    phone,
    password: hashedPassword,
  });

  console.log(admin.role);

  res.status(201).json({
    id: admin.id,
    adminname: admin.adminname,
    proof: admin.proof,
    email: admin.email,
  });
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const admin = await Admin.findOne({ email });

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    {
      admin: {
        adminname: admin.adminname,
        email: admin.email,
        id: admin.id,
        role: admin.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({ accessToken });
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);

  if (!admin) {
    return res.status(404).json({ error: "Admin not found" });
  }

  await admin.deleteOne({ _id: req.params.id });

  res.status(200).json({
    message: "Admin deleted successfully",
    deletedAdmin: admin,
  });
});

const adminProfile = asyncHandler(async (req, res) => {
  console.log(req.user.role);
  console.log("current admin");
  res.status(200).json({ message: "current admin" });
});

const GetAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "Only admin can view all users" });
  }

  const users = await User.find();

  if (!users || users.length === 0) {
    return res.status(404).json({ error: "No users found" });
  }

  res.status(200).json(users);
});

const AllTickets = asyncHandler(async (req, res) => {
  const tickets = await Tickets.find();

  if (!tickets) {
    return res.status(404).json({ error: "No tickets found" });
  }

  res.status(200).json(tickets);
});

const DeleteUser = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({ error: "Only admin can delete user" });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await user.deleteOne({ _id: req.params.id });

  res.status(200).json({
    message: "User deleted successfully",
    deletedUser: user,
  });
});

module.exports = {
  CreateAdmin,
  loginAdmin,
  deleteAdmin,
  adminProfile,
  GetAllUsers,
  AllTickets,
  DeleteUser,
};
