import { useEffect, useState } from "react";
import API from "../../../api/api";
import DashboardLayout from "../../Dashboard";
export default function ProjectRecommendations() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hi 👋 I’ve analyzed your existing projects. Ask me for project ideas, improvements, or validation of new ideas."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/profile/projects").then(res => {
        setProjects(res.data)

    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await API.post("/project-recommend/chat", {
      message: input
    });
    console.log(res.data)

    setMessages(prev => [
        ...prev,
        { role: "ai", content: res.data.reply }
        ]);

    setLoading(false);
  };

  return (
    <DashboardLayout title="project recommendation">
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        <h2 className="text-2xl font-bold">
          Project Recommendation AI 🚀
        </h2>

        {/* EXISTING PROJECTS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">
            Your Existing Projects
          </h3>
          <div className="flex flex-wrap gap-2">
            {projects.map((p, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm rounded-full
                           bg-purple-100 text-purple-700"
              >
                {p.title}
              </span>
            ))}
          </div>
        </div>

        {/* CHAT */}
        <div className="bg-white rounded-xl shadow p-4 h-[400px] overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] p-3 rounded-lg text-sm
                ${m.role === "user"
                  ? "bg-purple-600 text-white ml-auto"
                  : "bg-gray-100 text-gray-800"
                }`}
            >
              {typeof m.content === "string" ? (
  m.content
) : (
  <div className="space-y-2">
    <h4 className="font-semibold text-purple-700">
      {m.content.recommendation.title}
    </h4>

    <p className="text-sm">
      {m.content.recommendation.reason}
    </p>

    <div className="flex flex-wrap gap-2 text-xs">
      {m.content.recommendation.techStack.map((tech, idx) => (
        <span
          key={idx}
          className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
        >
          {tech}
        </span>
      ))}
    </div>

    <p className="text-xs text-gray-500">
      Difficulty: {m.content.recommendation.difficulty} •
      Resume Value: {m.content.recommendation.resumeValue}
    </p>
  </div>
)}

            </div>
          ))}
          {loading && (
            <p className="text-sm text-gray-400">
              AI is thinking...
            </p>
          )}
        </div>

        {/* INPUT */}
        <div className="flex gap-3">
          <input
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="Ask about project ideas, improvements, validation..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white px-5 rounded-lg"
          >
            Send
          </button>
        </div>

      </div>
    </div>
    </DashboardLayout>
  );
}
