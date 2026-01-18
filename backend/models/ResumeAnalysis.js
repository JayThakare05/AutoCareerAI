const mongoose = require("mongoose");

const ResumeAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true   // 🔥 IMPORTANT
  },
  jobRole: String,
  atsScore: Number,
  skills: [String],
  missingSkills: [String],
  suggestions: [String],
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("ResumeAnalysis", ResumeAnalysisSchema);
