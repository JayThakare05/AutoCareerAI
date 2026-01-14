const User = require("../models/User");

// Upload Resume
exports.uploadResume = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    user.resumePath = req.file.path;
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

    const files = req.files.map(file => file.path);
    user.certificates.push(...files);
    await user.save();

    res.json({ message: "Certificates uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

