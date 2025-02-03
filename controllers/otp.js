const axios = require("axios");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const OTP = require("../models/otp");
const User = require("../models/user");
require("dotenv").config();

const sendOTP = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("log", req.body);

    const checkUserPresent = await User.findOne({ email });

    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }
    console.log(checkUserPresent.password);

    if (!(await bcrypt.compare(password, checkUserPresent.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect Password" });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const verifyCaptcha = async (req, res) => {
  const { captchaValue } = req.body;

  if (!captchaValue) {
    return res
      .status(400)
      .json({ success: false, message: "Captcha value is required" });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: captchaValue,
        },
      }
    );

    if (response.data.success) {
      return res
        .status(200)
        .json({ success: true, message: "Captcha verified" });
    } else {
      return res.status(400).json({
        success: false,
        message: "Captcha verification failed",
        error: response.data,
      });
    }
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { sendOTP, verifyCaptcha };
