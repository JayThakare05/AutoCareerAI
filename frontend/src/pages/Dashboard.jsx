import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import JobCard from "./components/JobCard";
import API from "../api/api";

export default function Dashboard({ children, title }) {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile").then(res => setUser(res.data));
    API.get("/jobs/recommended", { params: { data: "skills", source: "dashboard" } })
      .then(res => setJobs(res.data.jobs || []));
  }, []);

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#080810]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-blue-500 dark:border-electric border-t-transparent animate-spin" />
          <p className="text-gray-500 dark:text-slate-400 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#080810] overflow-hidden">

      <Sidebar navigate={navigate} />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky topbar */}
        <div className="sticky top-0 z-20 bg-white dark:bg-[#111118] border-b border-gray-200 dark:border-[#1e1e30]">
          <Topbar user={user} navigate={navigate} />
        </div>

        {/* Page title */}
        <div className="px-8 pt-6 pb-3 bg-gray-50 dark:bg-[#080810] shrink-0 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
            {title || "Jobs recommended for you 🚀"}
          </h2>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pb-10">

          {/* Child pages */}
          {children}

          {/* Default dashboard job list */}
          {!children && (
            jobs.length === 0 ? (
              <div className="mt-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-gray-500 dark:text-slate-400">
                  No jobs found yet. Complete your profile.
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-5 mt-4 stagger">
                {jobs.map((job, i) => (
                  <div key={i} className="animate-slide-up">
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}
