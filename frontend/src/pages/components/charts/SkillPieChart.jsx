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

  const COLORS = ["#22c55e", "#ef4444"]; // green, red

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h4 className="font-semibold mb-4">Skill Readiness Overview</h4>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <span className="flex items-center gap-2 text-green-600">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          Skills You Have
        </span>
        <span className="flex items-center gap-2 text-red-500">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          Skills to Learn
        </span>
      </div>
    </div>
  );
}
