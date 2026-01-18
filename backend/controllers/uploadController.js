const User = require("../models/User");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Upload / Update Resume (NO AI SKILL EXTRACTION)
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!req.file) {
      return res.status(400).json({ error: "No resume file provided" });
    }
    console.log("why")
    /* ---------- DELETE OLD RESUME IF EXISTS ---------- */
    if (user.documents?.resume) {
      try {
        fs.unlinkSync(
          path.join(__dirname, "..", user.documents.resume)
        );
      } catch (err) {
        console.warn("Old resume delete failed:", err.message);
      }
    }
    console.log("why1")

    /* ---------- SAVE NEW RESUME PATH ---------- */
    user.documents = user.documents || {};
    user.documents.resume = req.file.path;

    await user.save();

    res.json({
      message: "Resume updated successfully",
      resume: user.documents.resume
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteResume = async (req, res) => {
  const user = await User.findById(req.user);

  if (!user.documents?.resume) {
    return res.status(404).json({ error: "No resume found" });
  }

  try {
    fs.unlinkSync(path.join(__dirname, "..", user.documents.resume));
  } catch {}

  user.documents.resume = null;
  await user.save();

  res.json({ message: "Resume deleted" });
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
exports.deleteCertificate = async (req, res) => {
  const { index } = req.params;
  const user = await User.findById(req.user);

  const certPath = user.documents.certificates[index];
  if (!certPath) return res.status(404).json({ error: "Not found" });

  try {
    fs.unlinkSync(path.join(__dirname, "..", certPath));
  } catch {}

  user.documents.certificates.splice(index, 1);
  await user.save();

  res.json({ message: "Certificate deleted" });
};
exports.getUploadedDocs = async (req, res) => {
  try {
    console.log("docs")
    const user = await User.findById(req.user)
      .select("documents extractedSkills");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      resume: user.documents?.resume || null,
      certificates: user.documents?.certificates || [],
      profilePhoto: user.documents?.profilePhoto || null,
      extractedSkills: user.extractedSkills || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

