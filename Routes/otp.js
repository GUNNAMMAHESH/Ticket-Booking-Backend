const express = require('express');
const { sendOTP } = require('../controllers/otp');

const router = express.Router();

// Route to send OTP
router.post('/send-otp', sendOTP);

module.exports = router;
