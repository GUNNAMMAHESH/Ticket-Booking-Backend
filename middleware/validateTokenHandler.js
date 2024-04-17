const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    if (decoded.admin) {
      req.user = decoded.admin;
    } else if (decoded.user) {
      req.user = decoded.user;
    } else {
      res.status(400);
      throw new Error("Invalid token format");
    }
    next();
  });
});

module.exports = validateToken;
