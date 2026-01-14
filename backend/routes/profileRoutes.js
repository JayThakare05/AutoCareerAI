const express = require("express");
const auth = require("../middleware/authMiddleware");
const { profileUpload } = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto
} = require("../controllers/profileController");

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.post("/photo", auth, profileUpload.single("photo"), uploadProfilePhoto);

module.exports = router;
