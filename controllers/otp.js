const otpGenerator = require('otp-generator');
const OTP = require('../models/otp');
const User = require('../models/user');

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
  
    // Check if user already exists
    const checkUserPresent = await User.findOne({ email });
    
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'User is not registered',
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Check for unique OTP
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Create OTP document
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    // Send response back
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,  // This is usually not returned in production for security
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};
