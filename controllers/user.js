const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const OTP = require('../models/otp');
const otpGenerator = require('otp-generator');

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User is already registered',
      });
    }

    // Generate a 6-digit OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure OTP is unique by checking in the database
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Save OTP to the database
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    // Send success response without revealing the OTP
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully. Please check your email.',
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending the OTP',
      error: error.message,
    });
  }
};

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone,role } = req.body;
  console.log(req.body);
  
  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    return res.status(400).json({ error: "User already registered" });
  }

  if (!username || !email || !password || !phone) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }



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
  const { email, password, otp } = req.body;
  
  // Check if all required fields are provided
  if (!email || !password || !otp) {
    return res.status(400).json({ error: "All fields are mandatory" });
  }

  // Check if the OTP exists and is valid
  const existOtp = await OTP.findOne({ email, otp });
  
  // Validate OTP existence
  if (!existOtp) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }
  
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate the JWT access token if OTP and credentials are valid
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
    { expiresIn: "1h" }
  );

  // Clean up: Optionally, delete the OTP after successful login
  await OTP.deleteOne({ email, otp });

  // Respond with the access token
  res.status(200).json({ token: accessToken });
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
