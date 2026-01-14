const multer = require("multer");
const fs = require("fs");
const path = require("path");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Resume upload
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${req.user}/resumes`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Certificate upload
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${req.user}/certificates`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `uploads/${req.user}/profile`;
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const profileUpload = multer({ storage: profileStorage });

module.exports = {
  resumeUpload: multer({ storage: resumeStorage }),
  certificateUpload: multer({ storage: certificateStorage }),
  profileUpload   // ✅ export
};
