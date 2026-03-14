import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./Dashboard";
import API from "../api/api";
import AnalysisCard from "./components/AnalysisCard";
import SkillPieChart from "./components/charts/SkillPieChart";
import SkillMatrix from "./components/charts/SkillMatrix";
import { Upload, Briefcase, ChevronRight, Activity } from "lucide-react";
import toast from "react-hot-toast";

export default function ResumeAnalyzer() {
  const [resume, setResume] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const analyzeResume = async () => {
    if (!resume || !jobRole)
      return toast.error("Please upload a resume and specify the target job role");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobRole", jobRole);
    setLoading(true);
    const analysisToast = toast.loading("Analyzing resume with neural engine...");
    try {
      const res = await API.post("/ai/resume-analyze", formData);
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
      setResult(data);
      toast.success("Analysis complete!", { id: analysisToast });
    } catch {
      toast.error("Resume analysis failed. Please check the file and try again.", { id: analysisToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Resume Analyzer 🧠">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">

        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#111118] rounded-3xl p-8 border border-gray-100 dark:border-[#1e1e30] shadow-sm dark:shadow-card-dark transition-all hover:shadow-md animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-blue-100 dark:bg-electric/10 rounded-2xl text-blue-600 dark:text-electric">
                <Upload size={22} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 italic tracking-tight">Upload Your Resume</h3>
            </div>

            <div className="space-y-6">
              {/* File Input */}
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div className={`p-8 border-2 border-dashed rounded-3xl flex flex-col items-center gap-3 transition-all duration-300
                                ${resume
                    ? "border-green-400/50 bg-green-50/10 dark:bg-green-400/5"
                    : "border-gray-200 dark:border-white/10 group-hover:border-blue-400 dark:group-hover:border-electric/50"}`}>
                  <div className={`p-4 rounded-full ${resume ? "bg-green-100 dark:bg-green-400/20 text-green-600" : "bg-gray-50 dark:bg-white/5 text-gray-400"}`}>
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700 dark:text-slate-200">{resume ? resume.name : "Click to select or drag PDF"}</p>
                    <p className="text-xs text-gray-400 mt-1">Maximum file size: 5MB</p>
                  </div>
                </div>
              </div>

              {/* Job Role Input */}
              <div>
                <div className="flex items-center gap-2 mb-2 ml-1">
                  <Briefcase size={14} className="text-blue-500 dark:text-electric" />
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Target job role</label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Backend Developer"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5
                             text-gray-900 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-electric transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={analyzeResume}
                  disabled={loading}
                  className="flex-1 bg-blue-600 dark:bg-electric hover:bg-blue-700 dark:hover:bg-electric-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/10 dark:shadow-electric/20 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Analyze Resume <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
                <button
                  onClick={() => navigate("/resume-history")}
                  className="px-6 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 text-sm font-bold border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all"
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* QUICK STATS/INFO */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-electric/20 dark:to-blue-900/40 p-1 rounded-3xl shadow-xl">
              <div className="bg-white dark:bg-[#111118]/80 backdrop-blur-xl rounded-[22px] p-8 h-full">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-slate-100">
                  <Activity size={18} className="text-blue-400" />
                  Why Analyze?
                </h4>
                <ul className="space-y-4">
                  {[
                    "Boost ATS performance to pass recruiter filters",
                    "Identify critical technology gaps for the role",
                    "Improve resume keyword density dynamically",
                    "Get hyper-personalized improvement tasks"
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 dark:text-slate-400">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result && (
              <div className="bg-white dark:bg-[#111118] p-8 rounded-3xl border border-gray-100 dark:border-[#1e1e30] shadow-sm animate-pulse-slow">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Current Score</p>
                  <div className={`text-6xl font-black italic tracking-tighter
                      ${result.atsScore >= 75 ? "text-green-500" : result.atsScore >= 50 ? "text-yellow-500" : "text-red-500"}`}>
                    {result.atsScore}<span className="text-2xl opacity-50 font-normal">/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div className="space-y-8 stagger">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SkillPieChart skills={result.skills || []} missingSkills={result.missingSkills || []} />
              <SkillMatrix skills={result.skills || []} missingSkills={result.missingSkills || []} />
            </div>

            {result.summary && (
              <div className="animate-slide-up">
                <AnalysisCard title="Professional Summary" content={result.summary} />
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div className="animate-slide-up">
                <AnalysisCard title="Key Suggestions" list={result.suggestions} />
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
