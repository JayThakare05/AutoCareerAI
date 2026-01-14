const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: String,  
  qualification: String,
  address: String,
  profilePhoto: String,   // NEW

  skills: [String],           // Manually added
  extractedSkills: [String],  // From certificates (AI)

  resumePath: String,
  certificates: [String],

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
