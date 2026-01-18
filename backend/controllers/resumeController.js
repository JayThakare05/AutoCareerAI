const ResumeAnalysis = require("../models/ResumeAnalysis");
const mongoose = require("mongoose");

exports.getResumeHistory = async (req, res) => {
  try {
    console.log(req.user)
    const history = await ResumeAnalysis.find({
      userId: new mongoose.Types.ObjectId(req.user)
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch resume history" });
  }
};
