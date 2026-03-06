import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, ChevronRight, Zap } from "lucide-react";
import DashboardLayout from "./Dashboard";
import JobCard from "./components/JobCard";
import API from "../api/api";

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));

    API.get("/jobs/recommended", {
      params: {
        data: "extractedSkills",
        source: "certificates",
      },
    })
      .then(res => setJobs(res.data.jobs || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Jobs as per Certificates 🎯">
      <div className="max-w-4xl mx-auto pb-12 animate-fade-in stagger">

        {/* HEADER HERO */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#00b4ff]/20 dark:to-purple-900/40 
                        p-10 rounded-[32px] shadow-2xl shadow-blue-500/10 dark:shadow-electric/10 mb-10 relative overflow-hidden group animate-slide-up">
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/10 dark:bg-electric/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 dark:bg-electric/20 rounded-xl backdrop-blur-md">
                  <Zap size={16} className="text-white dark:text-electric animate-pulse" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/70 dark:text-electric/80">Skill-Matched Opportunities</p>
              </div>
              <h1 className="text-3xl font-black text-white italic tracking-tighter">Hyper-relevant career roles</h1>
              <p className="text-sm text-white/60 dark:text-slate-400 font-medium max-w-md">We've parsed your certificates to find roles that perfectly align with your verified expertise.</p>
            </div>

            {user?.extractedSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2 max-w-sm">
                {user.extractedSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-electric/10 border border-white/10 dark:border-electric/20 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-12 h-12 border-4 border-blue-500 dark:border-electric border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Searching job markets...</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-[32px] animate-slide-up">
            <div className="p-5 bg-gray-100 dark:bg-white/5 rounded-full inline-block mb-4 text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 italic">No exact matches found</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">Upload more certificates or try updating your profile to expand our search parameters.</p>
            <button onClick={() => navigate("/upload")} className="mt-6 px-8 py-3 rounded-2xl bg-blue-600 dark:bg-electric text-white font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all">
              Upload Now →
            </button>
          </div>
        )}

        {/* RESULTS GRID */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 ml-2">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-blue-500 dark:text-electric" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{jobs.length} Opportunities detected</span>
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                Sorted by Match <ChevronRight size={10} />
              </div>
            </div>
            <div className="space-y-5 stagger">
              {jobs.map((job, index) => (
                <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
