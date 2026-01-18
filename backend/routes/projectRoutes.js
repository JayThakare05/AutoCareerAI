const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { projectChat } = require("../controllers/projectRecommendController");

router.post("/chat", auth, projectChat);

module.exports = router;
