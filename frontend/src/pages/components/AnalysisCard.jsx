export default function AnalysisCard({ title, content, list }) {
  return (
    <div className="
      bg-white dark:bg-[#111118] 
      rounded-3xl p-6 border border-gray-100 dark:border-[#1e1e30] 
      shadow-sm dark:shadow-card-dark
      transition-all duration-300 hover:shadow-md hover:scale-[1.01]
      animate-slide-up
    ">
      <h4 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-3 border-l-4 border-purple-500 dark:border-electric pl-3">
        {title}
      </h4>

      {content && (
        <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed pl-1">
          {content}
        </p>
      )}

      {list && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 mt-2 pl-1">
          {list.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-gray-600 dark:text-slate-400 group">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-electric/40 shrink-0 group-hover:scale-125 transition-transform" />
              <span className="group-hover:text-gray-900 dark:group-hover:text-slate-200 transition-colors">
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
