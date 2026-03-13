const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { projectChat, getAllChats, getSingleChat, deleteChat } = require("../controllers/projectRecommendController");

router.get("/chat", auth, getAllChats);
router.get("/chat/:chatId", auth, getSingleChat);
router.post("/chat", auth, projectChat);
router.delete("/chat/:chatId", auth, deleteChat);

module.exports = router;
