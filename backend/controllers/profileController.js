const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");
const { Readable } = require("stream");

// Helper to upload from buffer to Cloudinary
const uploadToCloudinary = (buffer, filename, publicId = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "AutoCareerAI",
        resource_type: "image",
        access_mode: "public",
        public_id: publicId || (filename.split(".")[0].replace(/\s+/g, "_") + "-" + Date.now()),
        overwrite: true
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

// GET profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user).select("-password");
  res.json(user);
};

// UPDATE profile
exports.updateProfile = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.user,
    req.body,
    { new: true }
  ).select("-password");

  res.json(updated);
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!req.file) return res.status(400).json({ error: "No photo provided" });

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname, `profile_${user._id}`);
    
    if (!user.documents) user.documents = {};
    user.documents.profilePhoto = result.secure_url;
    await user.save();

    res.json({ message: "Profile photo updated", profilePhoto: user.documents.profilePhoto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


