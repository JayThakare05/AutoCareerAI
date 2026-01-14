const express = require("express");
const auth = require("../middleware/authMiddleware");
const { resumeUpload, certificateUpload } = require("../middleware/uploadMiddleware");
const { uploadResume, uploadCertificates,getUploadedDocs } = require("../controllers/uploadController");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.post("/resume", auth, resumeUpload.single("resume"), uploadResume);
router.post("/certificates", auth, certificateUpload.array("certificates", 5), uploadCertificates);
router.get("/my-documents", auth, getUploadedDocs);

router.get("/file", auth, (req, res) => {
  const filePath = decodeURIComponent(req.query.filePath);
  res.sendFile(require("path").resolve(filePath));
});

module.exports = router;
