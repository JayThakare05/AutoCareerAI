const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post(
  "/resume-analyze",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Resume not uploaded" });
      }

      const formData = new FormData();
      formData.append("resume", fs.createReadStream(req.file.path));
      formData.append("jobRole", req.body.jobRole);

      console.log("AI route hit");

      const aiRes = await axios.post(
        "http://localhost:8001/resume-analyze",
        formData,
        {
          headers: formData.getHeaders()
        }
      );
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
