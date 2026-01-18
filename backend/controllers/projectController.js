const User = require("../models/User");

/* ---------------- GET PROJECTS ---------------- */
exports.getProjects = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("projects");
    res.json(user.projects || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

/* ---------------- ADD PROJECT ---------------- */
exports.addProject = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const project = {
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack || [],
      githubUrl: req.body.githubUrl || "",
      deployedUrl: req.body.deployedUrl || ""
    };

    user.projects.push(project);
    await user.save();

    res.json({ message: "Project added", project });
  } catch (err) {
    res.status(500).json({ error: "Failed to add project" });
  }
};

/* ---------------- UPDATE PROJECT ---------------- */
exports.updateProject = async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.user);

    if (!user.projects[index]) {
      return res.status(404).json({ error: "Project not found" });
    }

    Object.assign(user.projects[index], req.body);
    await user.save();

    res.json({ message: "Project updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update project" });
  }
};

/* ---------------- DELETE PROJECT ---------------- */
exports.deleteProject = async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.user);

    if (!user.projects[index]) {
      return res.status(404).json({ error: "Project not found" });
    }

    user.projects.splice(index, 1);
    await user.save();

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};
