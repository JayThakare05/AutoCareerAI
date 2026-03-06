import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function SkillPieChart({ skills = [], missingSkills = [] }) {
  const data = [
    { name: "Skills You Have", value: skills.length },
    { name: "Skills to Learn", value: missingSkills.length }
  ];

  // Electric Blue for have, Deep Red for missing
  const COLORS = ["#00b4ff", "#ef4444"];

  return (
    <div className="bg-white dark:bg-[#111118] p-8 rounded-3xl border border-gray-100 dark:border-[#1e1e30] shadow-sm dark:shadow-card-dark animate-slide-up">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-lg font-bold text-gray-900 dark:text-slate-100 italic tracking-tight">Readiness Overview</h4>
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visualization</div>
      </div>

      <div className="relative group transition-transform duration-500 hover:scale-105 cursor-pointer">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={8}
              stroke="none"
              animationDuration={1500}
              animationBegin={200}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} className="hover:opacity-80 transition-opacity outline-none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(20,20,30,0.95)',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-4xl font-black text-gray-900 dark:text-slate-100 italic">
            {Math.round((skills.length / (skills.length + missingSkills.length || 1)) * 100)}%
          </p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight">Prepared</p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-8 mt-6">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-electric group-hover:scale-125 transition-transform" />
          <span className="text-xs font-bold text-gray-600 dark:text-slate-400">Skills You Have</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-bold text-gray-600 dark:text-slate-400">To Learn</span>
        </div>
      </div>
    </div>
  );
}
