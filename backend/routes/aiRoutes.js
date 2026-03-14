const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const auth = require("../middleware/authMiddleware");
const { uploadToCloudinary } = require("../controllers/uploadController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/resume-analyze", auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Resume not uploaded" });
      }

      // 1. Upload to Cloudinary first
      const isPDF = req.file.mimetype === "application/pdf" || req.file.originalname.toLowerCase().endsWith(".pdf");
      const cloudRes = await uploadToCloudinary(req.file.buffer, req.file.originalname, isPDF);
      const fileUrl = cloudRes.secure_url;

      // 2. Send URL to AI service
      const formData = new FormData();
      formData.append("file_url", fileUrl);
      formData.append("jobRole", req.body.jobRole);

      const aiRes = await axios.post(
        `${process.env.AI_SERVICE_URL}/resume-analyze`,
        formData,
        {
          headers: formData.getHeaders()
        }
      );

      // 3. Save analysis to DB
      await ResumeAnalysis.create({
        userId: req.user,
        jobRole: req.body.jobRole,
        atsScore: aiRes.data.atsScore,
        skills: aiRes.data.skills,
        missingSkills: aiRes.data.missingSkills,
        suggestions: aiRes.data.suggestions,
        summary: aiRes.data.summary
      });

      res.json(aiRes.data);
    } catch (err) {
      console.error("AI Analysis Route Error:", err.message);
      res.status(500).json({ error: "AI resume analysis failed" });
    }
  }
);

module.exports = router;
