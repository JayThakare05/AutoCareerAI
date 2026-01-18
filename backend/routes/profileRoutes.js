const express = require("express");
const auth = require("../middleware/authMiddleware");
const { profileUpload } = require("../middleware/uploadMiddleware");
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto
} = require("../controllers/profileController");

const {
  getProjects,
  addProject,
  updateProject,
  deleteProject
} = require("../controllers/projectController");
const router = express.Router();

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.post("/photo", auth, profileUpload.single("photo"), uploadProfilePhoto);
router.get("/projects", auth, getProjects);
router.post("/projects", auth, addProject);
router.put("/projects/:index", auth, updateProject);
router.delete("/projects/:index", auth, deleteProject);

module.exports = router;
