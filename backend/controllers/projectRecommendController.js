const User = require("../models/User");
const ProjectChat = require("../models/ProjectChat");
const axios = require("axios");

exports.getAllChats = async (req, res) => {
  try {
    const chats = await ProjectChat.find({ userId: req.user })
      .select("title updatedAt")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("Fetch chats error:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};

exports.getSingleChat = async (req, res) => {
  try {
    const chat = await ProjectChat.findOne({ _id: req.params.chatId, userId: req.user });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    res.json(chat);
  } catch (err) {
    console.error("Fetch single chat error:", err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    await ProjectChat.findOneAndDelete({ _id: req.params.chatId, userId: req.user });
    res.json({ success: true, message: "Chat deleted" });
  } catch (err) {
    console.error("Delete chat error:", err);
    res.status(500).json({ error: "Failed to delete chat" });
  }
};

exports.projectChat = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("projects");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { message: userMessage, chatId } = req.body;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    let chat;
    if (chatId) {
      chat = await ProjectChat.findOne({ _id: chatId, userId: req.user });
    }

    if (!chat) {
      let title = userMessage.split(" ").slice(0, 4).join(" ");
      if (title.length > 25) title = title.substring(0, 25) + "...";
      chat = new ProjectChat({ userId: req.user, title, messages: [] });
    }

    // Save user message
    chat.messages.push({ role: "user", text: userMessage });

    /* ---------- PREPARE PROJECT CONTEXT ---------- */
    const projectContext = user.projects.map((p, i) => ({
      index: i + 1,
      title: p.title,
      description: p.description,
      techStack: p.techStack
    }));

    /* ---------- PREPARE HISTORY FOR AI ---------- */
    const historyContext = chat.messages.map(m => ({
      role: m.role,
      text: m.text
    }));

    /* ---------- SEND TO AI SERVICE ---------- */
    const aiResponse = await axios.post(
      "http://localhost:8001/project-recommend",
      {
        projects: projectContext,
        message: userMessage,
        history: historyContext
      }
    );

    // Save AI message
    chat.messages.push({ role: "ai", text: aiResponse.data });
    await chat.save();

    res.json({
      reply: aiResponse.data,
      chatId: chat._id,
      title: chat.title
    });

  } catch (err) {
    console.error("Project AI error:", err.message);
    res.status(500).json({ error: "AI service failed" });
  }
};