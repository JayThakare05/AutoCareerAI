const User = require("../models/User");

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
  const user = await User.findById(req.user);
  user.profilePhoto = req.file.path;
  await user.save();

  res.json({ message: "Profile photo updated" });
};
