const multer = require("multer");

// Using memory storage to handle manual upload to Cloudinary in the controller
const storage = multer.memoryStorage();

const resumeUpload = multer({ storage });
const certificateUpload = multer({ storage });
const profileUpload = multer({ storage });

module.exports = {
  resumeUpload,
  certificateUpload,
  profileUpload
};

