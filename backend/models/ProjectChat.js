const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const projectChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, default: "New Conversation" },
  messages: [messageSchema]
}, { timestamps: true });

module.exports = mongoose.model("ProjectChat", projectChatSchema);
