import { useEffect, useState } from "react";
import API from "../../../api/api";
import DashboardLayout from "../../Dashboard";
import {
  FileText,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ArrowUpRight,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResumeHistory() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/resume/history")
      .then(res => setHistory(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Resume Analysis History 🕰️">

      <div className="flex gap-6 relative">

        {/* LEFT CONTENT */}
        <div
          className={`transition-all duration-500 ${
            selectedReport ? "w-[70%]" : "w-full"
          }`}
        >

          <div className="pb-12">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-200 dark:border-white/10">

              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-500/10 dark:bg-electric/10 rounded-2xl text-blue-600 dark:text-electric">
                  <FileText size={26}/>
                </div>

                <div>
                  <h1 className="text-2xl font-black italic uppercase text-gray-900 dark:text-white">
                    Resume History
                  </h1>
                  <p className="text-xs uppercase tracking-widest text-gray-400">
                    Track resume optimization reports
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/resume-analyzer")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-100 dark:bg-electric/10 text-blue-600 dark:text-electric text-xs font-black uppercase tracking-widest hover:bg-blue-200 dark:hover:bg-electric/20 transition"
              >
                <ChevronLeft size={14}/>
                New Analysis
              </button>

            </div>

            {/* LOADING */}
            {loading && (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            )}

            {/* EMPTY */}
            {!loading && history.length === 0 && (
              <div className="text-center py-24 bg-gray-50 dark:bg-[#111118] border border-dashed border-gray-200 dark:border-[#1e1e30] rounded-[40px]">

                <TrendingUp size={40} className="mx-auto text-gray-400 mb-4"/>

                <h3 className="text-lg font-black uppercase text-gray-900 dark:text-white">
                  No Resume Reports
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Analyze your resume to generate reports
                </p>

                <button
                  onClick={() => navigate("/resume-analyzer")}
                  className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest"
                >
                  Start Analysis →
                </button>

              </div>
            )}

            {/* GRID */}
            {!loading && history.length > 0 && (

              <div
                className={`grid gap-6 transition-all duration-500 ${
                  selectedReport
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                }`}
              >

                {history.map((h, index) => (

                  <div
                    key={h._id || index}
                    className="bg-white dark:bg-[#111118] rounded-[32px] p-7 border border-gray-200 dark:border-[#1e1e30] shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
                  >

                    <div className="flex justify-between items-start mb-6">

                      <div>
                        <h3 className="text-lg font-black italic uppercase text-gray-900 dark:text-white">
                          {h.jobRole}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <Calendar size={12}/>
                          {new Date(h.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div
                        className={`p-3 rounded-xl border text-center min-w-[60px]
                        ${
                          h.atsScore >= 75
                            ? "bg-green-500/10 border-green-500/20 text-green-500"
                            : h.atsScore >= 50
                            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                            : "bg-red-500/10 border-red-500/20 text-red-500"
                        }`}
                      >
                        <div className="text-lg font-black">{h.atsScore}</div>
                        <div className="text-[9px] uppercase">Score</div>
                      </div>

                    </div>

                    <button
                      onClick={() => setSelectedReport(h)}
                      className="w-full py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2"
                    >
                      Access Full Report
                      <ArrowUpRight size={14}/>
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* RIGHT REPORT PANEL */}

        {selectedReport && (

          <div className="w-[30%] min-w-[360px] bg-white dark:bg-[#080810] border-l border-gray-200 dark:border-white/10 shadow-2xl p-6 space-y-6 transition-all duration-500">

            {/* HEADER */}
            <div className="flex justify-between items-center">

              <h2 className="text-lg font-black uppercase text-gray-900 dark:text-white">
                Resume Report
              </h2>

              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={20}/>
              </button>

            </div>

            {/* ROLE */}
            <div>
              <p className="text-xs uppercase text-gray-400 mb-1">Role</p>
              <p className="font-bold text-gray-800 dark:text-white">
                {selectedReport.jobRole}
              </p>
            </div>

            {/* ATS SCORE */}
            <div className="p-5 rounded-2xl bg-gray-100 dark:bg-white/10">
              <p className="text-xs uppercase text-gray-400 mb-2">ATS Score</p>
              <p className="text-4xl font-black text-blue-500 dark:text-cyan-400">
                {selectedReport.atsScore}
              </p>
            </div>

            {/* SUGGESTIONS */}
            <div>
              <p className="text-xs uppercase text-gray-400 mb-2">Suggestions</p>
              <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">
                {selectedReport.suggestions}
              </p>
            </div>

            {/* SKILLS */}
            <div>

              <p className="text-xs uppercase text-gray-400 mb-3">
                Skills
              </p>

              <div className="flex flex-wrap gap-2">

                {selectedReport.skills?.map((skill, i) => (

                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-slate-200"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </div>
            <div>

              <p className="text-xs uppercase text-gray-400 mb-3">
                Missing Skills
              </p>

              <div className="flex flex-wrap gap-2">

                {selectedReport.missingSkills?.map((skill, i) => (

                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-700 dark:text-slate-200"
                  >
                    {skill}
                  </span>

                ))}

              </div>

            </div>

          </div>

        )}

      </div>

    </DashboardLayout>
  );
}