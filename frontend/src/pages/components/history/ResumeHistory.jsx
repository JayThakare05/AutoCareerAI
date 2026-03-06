import { useEffect, useState } from "react";
import API from "../../../api/api";
import DashboardLayout from "../../Dashboard";
import { FileText, Calendar, TrendingUp, ChevronLeft, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/resume/history")
      .then((res) => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Resume Analysis History 🕰️">
      <div className="max-w-5xl mx-auto pb-12 animate-fade-in stagger">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100 dark:border-white/5 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 dark:bg-electric/10 rounded-2xl text-blue-600 dark:text-electric shadow-inner relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/20 dark:bg-electric/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <FileText size={28} className="relative z-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase">Audit Archive</h1>
              <p className="text-[10px] font-black italic text-gray-400 uppercase tracking-[0.2em] mt-1 italic">Tracking career progression & optimization audits</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/resume-analyzer")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-100 dark:bg-electric/10 text-blue-600 dark:text-electric text-[11px] font-black uppercase tracking-widest hover:bg-blue-200 dark:hover:bg-electric/20 active:scale-95 transition-all group"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> New Analysis Audit
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-500 dark:border-electric border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Accessing optimization logs from mainframe...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && history.length === 0 && (
          <div className="text-center py-24 bg-gray-50 dark:bg-[#111118] border border-dashed border-gray-100 dark:border-[#1e1e30] rounded-[40px] animate-slide-up group overflow-hidden relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
              <FileText size={400} className="text-blue-500 dark:text-electric scale-150 rotate-12" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="p-6 bg-white dark:bg-white/5 rounded-3xl inline-block shadow-sm dark:shadow-electric/5 text-gray-300 dark:text-slate-700 animate-float">
                <TrendingUp size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black italic text-gray-900 dark:text-slate-100 tracking-tight uppercase">No Metrics Recorded</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-xs mx-auto font-medium lowercase">Initialize your first professional identity audit to start tracking progression cycles.</p>
              </div>
              <button
                onClick={() => navigate("/resume-analyzer")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-electric dark:to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10 dark:shadow-electric/20 hover:scale-105 transition-all"
              >
                Start First Audit →
              </button>
            </div>
          </div>
        )}

        {/* HISTORY GRID */}
        {!loading && history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger">
            {history.map((h, index) => (
              <div
                key={h._id || index}
                className="bg-white dark:bg-[#111118] rounded-[32px] p-7 border border-gray-100 dark:border-[#1e1e30] shadow-sm dark:shadow-card-dark transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up group"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter uppercase leading-none drop-shadow-sm">{h.jobRole}</h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] italic">
                      <Calendar size={10} className="text-blue-400 dark:text-electric" />
                      {new Date(h.createdAt).toLocaleDateString()} at {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[64px] transition-all duration-500 
                      ${h.atsScore >= 75 ? "border-green-500/20 bg-green-500/10 text-green-500" : h.atsScore >= 50 ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-500" : "border-red-500/20 bg-red-500/10 text-red-500"}`}>
                    <span className="text-xl font-black italic leading-none drop-shadow-sm italic">{h.atsScore}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">AUDIT</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 flex items-center gap-1.5 italic">
                      <TrendingUp size={10} className="text-purple-400" /> Optimization insight
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed lowercase">
                      {h.summary || "Complete audit successful. Ready for high-performance job market deployment with verified metrics."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {h.skills?.slice(0, 3).map((skill, si) => (
                      <span key={si} className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[9px] font-bold text-gray-500 dark:text-slate-400 lowercase tracking-wider hover:text-blue-500 dark:hover:text-electric hover:border-blue-500/30 dark:hover:border-electric/30 transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                    {h.skills?.length > 3 && (
                      <span className="px-2.5 py-1 text-[9px] font-black text-gray-300 uppercase tracking-widest">+{h.skills.length - 3}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate("/resume-analyzer", { state: { auditId: h._id } })}
                  className="w-full py-3.5 rounded-2xl border border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 hover:bg-blue-600 dark:hover:bg-electric hover:text-white dark:hover:text-[#080810] hover:border-blue-600 dark:hover:border-electric transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Access Full Auditor Report <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
