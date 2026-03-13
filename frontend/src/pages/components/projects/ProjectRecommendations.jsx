import { useEffect, useState, useRef } from "react";
import DashboardLayout from "../../Dashboard";
import API from "../../../api/api";
import { Send, Bot, User, Sparkles, MessageSquare, Terminal, RefreshCcw, Trash2, PlusCircle, MessageCircle } from "lucide-react";
import ConfirmModal from "../ConfirmModal";

export default function ProjectRecommendations() {
  const [projects, setProjects] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const defaultMessage = { role: "ai", text: "Hi! I can suggest projects based on your skills. Type anything to start!" };
  const [messages, setMessages] = useState([defaultMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chatId: null });
  const chatEndRef = useRef(null);

  useEffect(() => {
    API.get("/profile/projects").then((res) => setProjects(res.data));
    fetchChatSessions();
  }, []);

  const fetchChatSessions = () => {
    API.get("/project-recommend/chat")
      .then(res => setChatSessions(res.data))
      .catch(err => console.error("Error fetching chats", err));
  };

  const loadChat = (chatId) => {
    API.get(`/project-recommend/chat/${chatId}`)
      .then(res => {
        setMessages(res.data.messages && res.data.messages.length > 0 ? res.data.messages : [defaultMessage]);
        setCurrentChatId(res.data._id);
      })
      .catch(console.error);
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([defaultMessage]);
  };

  const deleteChat = (e, chatId) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, chatId });
  };

  const handleConfirmDelete = async () => {
    const chatId = deleteModal.chatId;
    if (!chatId) return;
    try {
      await API.delete(`/project-recommend/chat/${chatId}`);
      setChatSessions(prev => prev.filter(c => c._id !== chatId));
      if (currentChatId === chatId) startNewChat();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/project-recommend/chat", {
        message: input,
        chatId: currentChatId
      });

      if (!currentChatId && res.data.chatId) {
        setCurrentChatId(res.data.chatId);
        fetchChatSessions();
      }

      const replyData = res.data.reply;
      let aiText = "";

      if (replyData) {
        if (replyData.feedback) aiText = replyData.feedback;
        if (replyData.recommendation && replyData.recommendation.title) {
          const rec = replyData.recommendation;
          aiText += `\n\n🚀 Project: ${rec.title}\n` +
            `💡 Reason: ${rec.reason}\n` +
            `🛠️ Stack: ${rec.techStack?.join(", ") || "N/A"}\n` +
            `📊 Difficulty: ${rec.difficulty} | Value: ${rec.resumeValue}`;
        }
        if (!aiText && typeof replyData === 'string') {
          aiText = replyData;
        }
      }

      const aiMsg = {
        role: "ai",
        text: aiText || "I couldn't generate a specific recommendation. Could you tell me more about your interests?"
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Project Architect 🚀">
      <div className="max-w-6xl mx-auto h-[calc(100vh-180px)] flex flex-col lg:flex-row gap-8 animate-fade-in stagger">

        {/* LEFT COLUMN: Your Stack & History */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 animate-slide-in h-full">

          {/* Top Half: Inventory */}
          <div className="bg-white dark:bg-[#111118] p-6 rounded-[24px] border border-gray-100 dark:border-[#1e1e30] shadow-sm flex flex-col flex-1 min-h-0 relative overflow-hidden group">
            <div className="absolute top-[-20%] left-[-10%] w-[100px] h-[100px] bg-blue-500/10 rounded-full blur-[40px]" />
            <div className="relative z-10 space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-blue-500 dark:text-electric" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory</span>
              </div>
              <h2 className="text-lg font-black italic text-gray-900 dark:text-slate-100 uppercase">Your Stack</h2>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {projects.length === 0 ? (
                <div className="text-center py-6 opacity-40 italic text-sm text-gray-400">No projects recorded yet</div>
              ) : (
                projects.map((p, i) => (
                  <div key={i} className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100/50 dark:border-white/5 transition-all">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{p.title || p}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Verified Skill <Sparkles size={10} className="text-yellow-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Half: Chat History */}
          <div className="bg-white dark:bg-[#111118] p-6 rounded-[24px] border border-gray-100 dark:border-[#1e1e30] shadow-sm flex flex-col flex-1 min-h-0 relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MessageSquare size={14} className="text-purple-500 dark:text-electric" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">History</span>
                </div>
                <h2 className="text-lg font-black italic text-gray-900 dark:text-slate-100 uppercase">Recent Chats</h2>
              </div>
              <button
                onClick={startNewChat}
                className="p-2 bg-blue-50 dark:bg-electric/10 text-blue-600 dark:text-electric rounded-xl hover:bg-blue-100 dark:hover:bg-electric/20 transition-all font-bold text-xs flex items-center gap-1"
                title="New Chat"
              >
                <PlusCircle size={14} /> New
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {chatSessions.length === 0 ? (
                <div className="text-center py-6 opacity-40 italic text-sm text-gray-400">No chat history</div>
              ) : (
                chatSessions.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => loadChat(chat._id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group/chat ${currentChatId === chat._id ? "bg-blue-50 dark:bg-electric/10 border-blue-200 dark:border-electric/30" : "bg-gray-50/50 dark:bg-white/5 border-gray-100/50 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10"}`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <MessageCircle size={14} className={currentChatId === chat._id ? "text-blue-500 dark:text-electric" : "text-gray-400"} />
                      <p className={`text-sm font-semibold truncate ${currentChatId === chat._id ? "text-blue-700 dark:text-electric" : "text-gray-700 dark:text-slate-300"}`}>
                        {chat.title}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteChat(e, chat._id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover/chat:opacity-100 transition-all focus:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* RIGHT: Chat Interface */}
        <div className="flex-1 flex flex-col gap-6 animate-slide-up h-full pb-4" style={{ animationDelay: '200ms' }}>
          <div className="bg-white dark:bg-[#111118] rounded-[32px] border border-gray-100 dark:border-[#1e1e30] shadow-sm flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <MessageSquare size={200} className="text-blue-500 dark:text-electric" />
            </div>

            {/* CHAT HEADER */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between relative z-10 backdrop-blur-md bg-white/50 dark:bg-[#111118]/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-electric dark:to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 dark:shadow-electric/20 animate-glow-pulse">
                  <Bot size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-black italic text-gray-900 dark:text-slate-100 tracking-tighter uppercase italic">AI Project Architect</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Intelligence Suite</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}>
                  <div className={`shadow-xl max-w-[85%] p-6 rounded-[28px] relative group transition-all duration-300
                       ${m.role === "user"
                      ? "bg-blue-600 dark:bg-electric text-white rounded-tr-none hover:shadow-blue-500/20 dark:hover:shadow-electric/20"
                      : "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-slate-200 rounded-tl-none hover:bg-gray-100/50 dark:hover:bg-white/[0.08]"
                    }`}>

                    <div className={`absolute top-0 ${m.role === "user" ? "right-[-12px]" : "left-[-12px]"} opacity-50`}>
                      {m.role === "user" ? <User size={20} className="text-blue-400 dark:text-electric" /> : <Bot size={20} className="text-blue-400 dark:text-electric" />}
                    </div>

                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{m.text}</p>

                    <div className={`mt-3 text-[9px] font-bold uppercase tracking-widest opacity-40 ${m.role === "user" ? "text-right" : "text-left"}`}>
                      {m.role === "user" ? "Transmitted" : "Generated Output"}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-slide-up">
                  <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[28px] rounded-tl-none border border-gray-100 dark:border-white/5">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500/40 dark:bg-electric/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-500/40 dark:bg-electric/40 animate-bounce" style={{ animationDelay: '200ms' }} />
                      <span className="w-2 h-2 rounded-full bg-blue-500/40 dark:bg-electric/40 animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 relative z-10 backdrop-blur-md bg-white/50 dark:bg-[#111118]/50">
              <div className="flex items-center gap-4 bg-gray-50/80 dark:bg-white/5 p-2 rounded-[24px] border border-gray-100 dark:border-white/5 shadow-inner group transition-all focus-within:ring-2 focus-within:ring-blue-400 dark:focus-within:ring-electric">
                <input
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm text-gray-900 dark:text-slate-100 placeholder:text-gray-400 font-medium"
                  placeholder="Ask for project ideas to master your skills..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="p-4 bg-blue-600 dark:bg-electric hover:bg-blue-700 dark:hover:bg-electric-dark text-white rounded-2xl shadow-lg transition-all active:scale-90 disabled:opacity-50 disabled:scale-100 disabled:shadow-none group"
                >
                  <Send size={18} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] opacity-60">Neural Network Assisted Architecture Decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chatId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation?"
        message="This will permanently delete this chat session from the architecture vault. This action cannot be undone."
        confirmText="Delete Data"
      />
    </DashboardLayout>
  );
}