const UploadCard = ({
  title,
  desc,
  accept,
  multiple,
  onFileSelect,
  onUpload,
  buttonText,
  color
}) => (
  <div className="
    bg-white dark:bg-[#111118] 
    rounded-3xl p-8 border border-gray-100 dark:border-[#1e1e30] 
    shadow-sm dark:shadow-card-dark
    transition-all duration-300 hover:shadow-md
    animate-slide-up
  ">
    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 italic tracking-tight mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 font-medium">{desc}</p>

    <div className="relative group">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onFileSelect}
        className="
          block w-full text-sm text-gray-500 dark:text-slate-400
          file:mr-5 file:py-3 file:px-6
          file:rounded-2xl file:border-0
          file:text-xs file:font-black file:uppercase file:tracking-widest
          file:bg-blue-50 file:text-blue-700
          dark:file:bg-electric/10 dark:file:text-electric
          hover:file:bg-blue-100 dark:hover:file:bg-electric/20
          transition-all cursor-pointer
        "
      />
    </div>

    <button
      onClick={onUpload}
      className={`
        mt-8 w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em]
        shadow-xl transition-all active:scale-95
        ${color === "blue"
          ? "bg-blue-600 dark:bg-electric shadow-blue-500/20 dark:shadow-electric/20 hover:bg-blue-700 dark:hover:bg-electric-dark"
          : "bg-green-600 dark:bg-green-500 shadow-green-500/20 dark:shadow-green-500/20 hover:bg-green-700 dark:hover:bg-green-600"}
      `}
    >
      {buttonText}
    </button>
  </div>
);

export default UploadCard;