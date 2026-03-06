import { CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

export default function SkillMatrix({ skills = [], missingSkills = [] }) {
  const total = skills.length + missingSkills.length;

  return (
    <div className="bg-white dark:bg-[#111118] p-8 rounded-3xl border border-gray-100 dark:border-[#1e1e30] shadow-sm dark:shadow-card-dark transition-all hover:shadow-md animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 italic tracking-tight flex items-center gap-2">
          <TrendingUp className="text-electric" size={18} />
          Skill Matrix
        </h4>
        <div className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {total} Total Skills
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/5 text-gray-500 dark:text-slate-400">
              <th className="px-6 py-4 text-left font-bold uppercase tracking-widest text-[10px]">Expertise Area</th>
              <th className="px-6 py-4 text-left font-bold uppercase tracking-widest text-[10px]">Proficiency Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {skills.map((skill, index) => (
              <tr key={index} className="group hover:bg-gray-50/50 dark:hover:bg-white-[0.02] transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-slate-100 transition-colors">
                    {skill}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-green-500/80 dark:text-green-400/80 font-bold group-hover:text-green-500 transition-colors cursor-default">
                    <CheckCircle size={14} className="group-hover:scale-120 transition-transform" />
                    <span className="text-[11px] uppercase tracking-wider">Ready to Deploy</span>
                  </div>
                </td>
              </tr>
            ))}

            {missingSkills.map((skill, index) => (
              <tr key={index} className="group hover:bg-gray-50/50 dark:hover:bg-red-400/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-400 dark:text-slate-500 group-hover:text-red-400 Transition-colors italic">
                    {skill}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-red-400/60 dark:text-red-500/60 font-medium group-hover:text-red-500 transition-colors cursor-default">
                    <AlertCircle size={14} className="group-hover:scale-120 transition-transform" />
                    <span className="text-[11px] uppercase tracking-wider">Skill Expansion Required</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
