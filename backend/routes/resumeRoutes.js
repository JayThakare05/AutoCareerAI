const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getResumeHistory } = require("../controllers/resumeController");

const router = express.Router();

router.get("/history", auth, getResumeHistory);

module.exports = router;
