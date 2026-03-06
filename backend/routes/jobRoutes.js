const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getRecommendedJobs } = require("../controllers/jobController");

const router = express.Router();

router.get("/recommended", auth, getRecommendedJobs);

module.exports = router;
