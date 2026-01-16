const User = require("../models/User");
const { fetchJobs } = require("../services/adzunaService");

exports.getRecommendedJobs = async (req, res) => {
  try {
    console.log("hiii")
     const { data } = req.query;
    console.log(data);
    const user = await User.findById(req.user);
    console.log(user[data])
     console.log("User",user[data]);
    if (!user[data] || user[data].length === 0) {
      return res.json({ jobs: [], message: "No skills found yet" });
    }
   
    // 🔥 Build search query from top skills
    const searchQuery = user[data].slice(0, 5).join(" ");
    // console.log("SQ",searchQuery)
    const jobs = await fetchJobs(searchQuery);
     console.log("jobs")
    const rankedJobs = jobs.map(job => {
      const text = (
        job.title + " " +
        job.description
      ).toLowerCase();
      let matchCount = 0;
      user[data].forEach(skill => {
        if (text.includes(skill.toLowerCase())) matchCount++;
      });

      return {
        title: job.title,
        company: job.company?.display_name,
        location: job.location?.display_name,
        url: job.redirect_url,
        description: job.description,
        matchScore: Math.round((matchCount / user[data].length) * 100)
      };
    });
    rankedJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    res.json({ jobs: rankedJobs });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
