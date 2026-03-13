import DashboardLayout from "./Dashboard";
import { Mic, Bell } from "lucide-react";

export default function Mock() {
  return (
    <DashboardLayout title="Mock Interview 🎤">
      <div className="max-w-4xl mx-auto pb-12 animate-fade-in">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-white/5 animate-slide-up">
          <div className="p-4 bg-blue-500/10 dark:bg-electric/10 rounded-2xl text-blue-600 dark:text-electric shadow-inner">
            <Mic size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-gray-900 dark:text-slate-100">
              Mock Interview
            </h1>
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mt-1">
              Practice interviews powered by AI
            </p>
          </div>
        </div>

        {/* COMING SOON CARD */}
        <div className="text-center py-24 bg-gray-50 dark:bg-[#111118] border border-dashed border-gray-200 dark:border-[#1e1e30] rounded-[40px] relative overflow-hidden group animate-slide-up">

          {/* Glow background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          w-[320px] h-[320px] bg-blue-500/5 dark:bg-electric/5 rounded-full 
          blur-[100px] group-hover:scale-125 transition-transform duration-700" />

          <div className="relative z-10 space-y-6">

            {/* Icon */}
            <div className="p-6 bg-white dark:bg-white/5 rounded-3xl inline-block shadow-sm dark:shadow-electric/5 text-gray-400 dark:text-slate-600 animate-float">
              <Mic size={48} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-black italic uppercase tracking-tight text-gray-900 dark:text-slate-100">
              Feature Under Development
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto font-medium">
              The Mock Interview module has not been uploaded yet.  
              We are currently building an AI-powered interview simulator 
              to help you practice real-world job interviews.
            </p>

            {/* Notification message */}
            <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
              <Bell size={14} />
              You will be notified once it becomes available
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}