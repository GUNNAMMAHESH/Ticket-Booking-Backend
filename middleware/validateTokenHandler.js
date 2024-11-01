const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

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

// const hasRole = (...roles) => {
//   return async (req, res, next) => {
//     try {
//       const userDetails = await User.findOne({ email: req.user.email });
//       if (!roles.includes(userDetails.role)) {
//         return res.status(403).json({
//           success: false,
//           message: "You do not have permission to access this route",
//         });
//       }
//       next();
//     } catch (error) {
//       return res
//         .status(500)
//         .json({ success: false, message: "User Role Can't be Verified" });
//     }
//   };
// };

// Correctly export both functions
module.exports =  validateToken ;
