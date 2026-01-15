const User = require("../models/User");
const { fetchJobs } = require("../services/adzunaService");

exports.getRecommendedJobs = async (req, res) => {
  try {
    console.log("hiii")
    const user = await User.findById(req.user);
    // console.log("User",user);
    if (!user.extractedSkills || user.extractedSkills.length === 0) {
      return res.json({ jobs: [], message: "No skills found yet" });
    }

    // 🔥 Build search query from top skills
    const searchQuery = user.extractedSkills.slice(0, 5).join(" ");
    // console.log(searchQuery)
    const jobs = await fetchJobs(searchQuery);

    const rankedJobs = jobs.map(job => {
      const text = (
        job.title + " " +
        job.description
      ).toLowerCase();

      let matchCount = 0;
      user.extractedSkills.forEach(skill => {
        if (text.includes(skill.toLowerCase())) matchCount++;
      });

      return {
        title: job.title,
        company: job.company?.display_name,
        location: job.location?.display_name,
        url: job.redirect_url,
        description: job.description,
        matchScore: Math.round((matchCount / user.extractedSkills.length) * 100)
      };
    });

    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ jobs: rankedJobs });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
