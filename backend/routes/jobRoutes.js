const express = require("express");
const auth = require("../middleware/authMiddleware");
const { getRecommendedJobs } = require("../controllers/jobController");

const router = express.Router();
const hii=()=>{
    console.log("say")
}
router.get("/recommended",auth, getRecommendedJobs);

module.exports = router;
