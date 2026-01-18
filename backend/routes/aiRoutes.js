const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const ResumeAnalysis =require("../models/ResumeAnalysis");
const auth = require("../middleware/authMiddleware");
const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post(
  "/resume-analyze",auth,
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Resume not uploaded" });
      }

      const formData = new FormData();
      formData.append("resume", fs.createReadStream(req.file.path));
      formData.append("jobRole", req.body.jobRole);


      const aiRes = await axios.post(
        "http://localhost:8001/resume-analyze",
        formData,
        {
          headers: formData.getHeaders()
        }
      );
      await ResumeAnalysis.create({
  userId: req.user,
  jobRole: req.body.jobRole,
  atsScore: aiRes.data.atsScore,
  skills: aiRes.data.skills,
  missingSkills: aiRes.data.missingSkills,
  suggestions: aiRes.data.suggestions
});
      console.log(typeof aiRes.data)
      // ✅ delete temp file
      fs.unlinkSync(req.file.path);

      res.json(aiRes.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "AI resume analysis failed" });
    }
  }
);

module.exports = router;
