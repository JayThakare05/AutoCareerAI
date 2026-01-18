const express = require("express");
const auth = require("../middleware/authMiddleware");
const { resumeUpload, certificateUpload } = require("../middleware/uploadMiddleware");
const { uploadResume, uploadCertificates,getUploadedDocs,deleteResume,deleteCertificate } = require("../controllers/uploadController");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.post("/resume", auth, resumeUpload.single("resume"), uploadResume);
router.delete("/resume", auth, deleteResume);
router.post("/certificates", auth, certificateUpload.array("certificates", 5), uploadCertificates);
router.delete("/certificates/:index", auth, deleteCertificate);
router.get("/my-documents", auth, getUploadedDocs);

router.get("/file", auth, (req, res) => {
  const filePath = decodeURIComponent(req.query.filePath);
  console.log(filePath)
  res.sendFile(require("path").resolve(filePath));
});

module.exports = router;
