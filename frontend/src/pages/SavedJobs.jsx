import { useEffect, useState } from "react";
import API from "../api/api";
import DashboardLayout from "./Dashboard";
import JobCard from "./components/JobCard";
import { Bookmark, Search, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/saved-jobs")
      .then(res => setJobs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const removeJob = async (jobId) => {
    try {
      await API.delete(`/saved-jobs/${encodeURIComponent(jobId)}`);
      setJobs(jobs.filter(j => j.jobId !== jobId));
    } catch {
      alert("Failed to remove job from bookmarks");
    }
  };

  return (
    <DashboardLayout title="Saved Jobs 🔖">
      <div className="max-w-4xl mx-auto pb-12 animate-fade-in stagger">

        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-white/5 animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 dark:bg-electric/10 rounded-2xl text-blue-600 dark:text-electric shadow-inner">
              <Bookmark size={24} className="fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tighter">Your Career Shortlist</h1>
              <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mt-1">High-priority roles & saved applications</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-300 flex items-center gap-2">
              <Trash2 size={12} className="text-red-400" />
              {jobs.length} Bookmarks
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-10 h-10 border-4 border-blue-500 dark:border-electric border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching bookmarks from vault...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-24 bg-gray-50 dark:bg-[#111118] border border-dashed border-gray-200 dark:border-[#1e1e30] rounded-[40px] animate-slide-up relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 dark:bg-electric/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
              <div className="p-6 bg-white dark:bg-white/5 rounded-3xl inline-block shadow-sm dark:shadow-electric/5 text-gray-300 dark:text-slate-600 animate-float">
                <Bookmark size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black italic text-gray-900 dark:text-slate-100 italic tracking-tight uppercase">Archive Empty</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-xs mx-auto font-medium">Your career shortlist is currently vacant. Explore hyper-relevant opportunities to add them here.</p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-electric dark:to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/10 dark:shadow-electric/20 hover:scale-[1.05] active:scale-95 transition-all"
              >
                Discover Roles →
              </button>
            </div>
          </div>
        )}

        {/* RESULTS LIST */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-6 stagger">
            {jobs.map((job, index) => (
              <div
                key={job.jobId}
                className="animate-slide-up relative group"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <JobCard job={job} isSavedPage={true} onRemove={removeJob} />

                {/* Visual Accent for saved card */}
                <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1.5 h-[60%] bg-blue-500 dark:bg-electric rounded-r-full group-hover:h-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        )}

        {/* BACK TO FEED */}
        {!loading && jobs.length > 0 && (
          <div className="mt-12 text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 dark:hover:text-electric transition-colors"
            >
              <ArrowLeft size={12} />
              Return to Global Discover Feed
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
