export default function AnalysisCard({ title, content, list }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h4 className="font-semibold mb-2">{title}</h4>

      {content && (
        <p className="text-sm text-gray-700">{content}</p>
      )}

      {list && (
        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
