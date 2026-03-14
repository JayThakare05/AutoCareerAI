const User = require("../models/User");
const axios = require("axios");
const { cloudinary } = require("../config/cloudinary");
const { Readable } = require("stream");

// Helper to upload from buffer to Cloudinary
const uploadToCloudinary = (buffer, filename, isPDF = false, customPublicId = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "AutoCareerAI",
        resource_type: isPDF ? "raw" : "image",
        access_mode: "public",
        public_id: (customPublicId || filename.split(".")[0].replace(/\s+/g, "_") + "-" + Date.now()) + (isPDF ? ".pdf" : ""),
        overwrite: true, // Ensure we overwrite if public_id is provided
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};
exports.uploadToCloudinary = uploadToCloudinary;

// Upload / Update Resume (NO AI SKILL EXTRACTION)
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!req.file) {
      return res.status(400).json({ error: "No resume file provided" });
    }

    /* ---------- SAVE NEW RESUME PATH (Cloudinary URL) ---------- */
    const isPDF = req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf");
    const resumePublicId = `resume_${user._id}`;
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, isPDF, resumePublicId);

    user.documents = user.documents || {};
    user.documents.resume = result.secure_url;

    await user.save();

    res.json({
      message: "Resume updated successfully",
      resume: user.documents.resume
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.deleteResume = async (req, res) => {
  const user = await User.findById(req.user);

  if (!user.documents?.resume) {
    return res.status(404).json({ error: "No resume found" });
  }

  // Note: To delete from Cloudinary, we'd need the public_id.
  // For now, just removing the reference from DB as requested.
  user.documents.resume = null;
  await user.save();

  res.json({ message: "Resume deleted from database" });
};
// Upload Certificates
exports.uploadCertificates = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No certificates provided" });
    }

    user.documents = user.documents || {};
    user.documents.certificates = user.documents.certificates || [];

    // 🔥 Call AI service for each certificate
    let globalExtractedSkills = new Set(user.extractedSkills || []);

    for (let file of req.files) {
      const isPDF = file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf");
      const result = await uploadToCloudinary(file.buffer, file.originalname, isPDF);
      const fileUrl = result.secure_url;

      let certSkills = [];
      try {
        const aiRes = await axios.post(`${process.env.AI_SERVICE_URL}/extract-skills`, {
          file_path: fileUrl
        });

        if (aiRes.data.skills) {
          certSkills = aiRes.data.skills;
          certSkills.forEach(s => globalExtractedSkills.add(s));
        }
      } catch (aiErr) {
        console.error("AI Skill Extraction failed for:", fileUrl, aiErr.message);
      }

      // Store certificate with its specific skills
      user.documents.certificates.push({
        url: fileUrl,
        skills: certSkills
      });
    }

    user.extractedSkills = Array.from(globalExtractedSkills);
    await user.save();

    res.json({
      message: "Certificates uploaded & skills extracted",
      skills: user.extractedSkills,
      certificates: user.documents.certificates.map(c => c.url) 
    });

  } catch (err) {
    console.error("Upload certificates error:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteCertificate = async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.user);

    if (!user.documents?.certificates[index]) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    // Remove the certificate
    user.documents.certificates.splice(index, 1);

    // 🔥 Rebuild extractedSkills from remaining certificates
    const remainingSkills = new Set();
    user.documents.certificates.forEach(cert => {
      if (cert.skills) {
        cert.skills.forEach(s => remainingSkills.add(s));
      }
    });
    
    user.extractedSkills = Array.from(remainingSkills);
    await user.save();

    res.json({ 
      message: "Certificate and related skills deleted",
      skills: user.extractedSkills 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUploadedDocs = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .select("documents extractedSkills");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      resume: user.documents?.resume || null,
      certificates: user.documents?.certificates.map(c => c.url) || [], // Return only URLs for frontend compatibility
      profilePhoto: user.documents?.profilePhoto || null,
      extractedSkills: user.extractedSkills || []
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

