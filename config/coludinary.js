// config/coludinary.js
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImageToCloudinary = (filePath, folderName) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder: folderName }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = { uploadImageToCloudinary };
