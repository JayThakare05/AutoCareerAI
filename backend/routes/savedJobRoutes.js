const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  saveJob,
  getSavedJobs,
  removeSavedJob
} = require("../controllers/savedJobController");

const router = express.Router();

router.post("/", auth, saveJob);
router.get("/", auth, getSavedJobs);
router.delete("/:jobId", auth, removeSavedJob);

module.exports = router;
