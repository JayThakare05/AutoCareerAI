const User = require("../models/User");
const axios = require("axios");

// Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    user.documents.resume = req.file.path;
    await user.save();

    res.json({ message: "Resume uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload Certificates
exports.uploadCertificates = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    console.log("here");
    const files = req.files.map(f => f.path);
    user.documents = user.documents || {};
    user.documents.certificates = user.documents.certificates || [];
    user.documents.certificates.push(...files);


    await user.save();
    
    // 🔥 Call AI service for each certificate
    let extractedSkills = new Set(user.extractedSkills || []);

    for (let file of files) {
      const aiRes = await axios.post("http://localhost:8001/extract-skills", {
        file_path: file
      });

      aiRes.data.skills.forEach(s => extractedSkills.add(s));
    }

    user.extractedSkills = Array.from(extractedSkills);
    await user.save();

    res.json({
      message: "Certificates uploaded & skills extracted",
      skills: user.extractedSkills
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUploadedDocs = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("resumePath certificates");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

