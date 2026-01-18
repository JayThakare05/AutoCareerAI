export default function SkillMatrix({ skills = [], missingSkills = [] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h4 className="font-semibold mb-4">Skill Matrix</h4>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Skill</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((skill, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{skill}</td>
                <td className="px-4 py-2 text-green-600 font-medium">
                  ✅ Have
                </td>
              </tr>
            ))}

            {missingSkills.map((skill, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{skill}</td>
                <td className="px-4 py-2 text-red-500 font-medium">
                  ❌ To Learn
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
