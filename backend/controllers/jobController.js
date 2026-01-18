const User = require("../models/User");
const { fetchJobs } = require("../services/adzunaService");

exports.getRecommendedJobs = async (req, res) => {
  try {
    const { data } = req.query; // skills source

    // ✅ Allow only specific fields
    const allowedFields = ["skills", "extractedSkills"];
    if (!allowedFields.includes(data)) {
      return res.status(400).json({ error: "Invalid skill source" });
    }

    const user = await User.findById(req.user);

    const skills = user[data] || [];

    if (skills.length === 0) {
      return res.json({
        jobs: [],
        message: "No skills found yet"
      });
    }

    // 🔍 Build search query
    const searchQuery = skills.slice(0, 5).join(" ");

    const jobs = await fetchJobs(searchQuery);

    const rankedJobs = jobs.map(job => {
      const title = job.title || "";
      const description = job.description || "";

      const text = (title + " " + description).toLowerCase();

      const matchedSkills = [];
      const missingSkills = [];

      skills.forEach(skill => {
        if (text.includes(skill.toLowerCase())) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      });

      const matchScore = Math.round(
        (matchedSkills.length / skills.length) * 100
      );

      return {
        title,
        company: job.company?.display_name || "Unknown",
        location: job.location?.display_name || "Remote",
        url: job.redirect_url,
        description,
        matchScore,
        matchedSkills,
        missingSkills: missingSkills.slice(0, 5) // 👈 limit for UI
      };
    });

    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ jobs: rankedJobs });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};
