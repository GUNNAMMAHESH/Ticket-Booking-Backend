const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    return res.status(400).json({ error: "User already registered" });
  }

  const role = "user";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    phone,
    role,
  });

  console.log("New user created:", user.username);
  res.status(201).json({
    _id: user.id,
    username: user.username,
    email: user.email,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.status(200).json({ accessToken });
});

const profile = asyncHandler(async (req, res) => {
  if (req.user.role === "user" || req.user.role === "admin") {
    res.status(200).json(req.user);
  } else {
    res.status(403).json({ error: "You do not have permission to access this data" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.id.toString() !== req.user.id) {
    return res.status(403).json({ error: "You do not have permission to delete this user" });
  }

  await user.deleteOne({ _id: req.params.id });
  res.status(200).json({
    message: "User deleted successfully",
    deletedUser: user,
  });
});

module.exports = { createUser, loginUser, deleteUser, profile };
