const mongoose = require("mongoose");

const SavedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  jobId: String, // Adzuna redirect_url or adref
  title: String,
  company: String,
  location: String,
  url: String,
  matchScore: Number,
  description: String,
  matchedSkills: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("SavedJob", SavedJobSchema);
