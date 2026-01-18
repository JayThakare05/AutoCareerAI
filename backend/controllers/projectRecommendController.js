const User = require("../models/User");
const axios = require("axios");

exports.projectChat = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("projects");
    console.log("pro")
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    /* ---------- PREPARE PROJECT CONTEXT ---------- */
    const projectContext = user.projects.map((p, i) => ({
      index: i + 1,
      title: p.title,
      description: p.description,
      techStack: p.techStack
    }));

    /* ---------- SEND TO AI SERVICE ---------- */
    const aiResponse = await axios.post(
      "http://localhost:8001/project-recommend",
      {
        projects: projectContext,
        message: userMessage
      }
    );
    console.log("Data",aiResponse);
    res.json({
      reply: aiResponse.data
    });

  } catch (err) {
    console.error("Project AI error:", err.message);
    res.status(500).json({ error: "AI service failed" });
  }
};
