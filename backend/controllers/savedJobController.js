const SavedJob = require("../models/SavedJob");

exports.saveJob = async (req, res) => {
  try {
    const job = await SavedJob.findOne({
      userId: req.user,
      jobId: req.body.jobId
    });

    if (job) {
      return res.status(400).json({ message: "Job already saved" });
    }

    await SavedJob.create({
      userId: req.user,
      ...req.body
    });

    res.json({ message: "Job saved successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save job" });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const jobs = await SavedJob
      .find({ userId: req.user })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch {
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
};

exports.removeSavedJob = async (req, res) => {
  try {
    const jobId = decodeURIComponent(req.params.jobId);

    await SavedJob.deleteOne({
      userId: req.user,
      jobId: jobId
    });

    res.json({ message: "Job removed" });
  } catch {
    res.status(500).json({ error: "Failed to remove job" });
  }
};
