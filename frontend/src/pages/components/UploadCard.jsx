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
  <div className="bg-white rounded-xl shadow p-6">

    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-sm text-gray-600 mb-4">{desc}</p>

    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={onFileSelect}
      className="block w-full text-sm text-gray-600
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:bg-purple-50 file:text-purple-700
                 hover:file:bg-purple-100"
    />

    <button
      onClick={onUpload}
      className={`mt-4 px-5 py-2 rounded-lg text-white font-medium
        ${color === "blue" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
    >
      {buttonText}
    </button>
  </div>
);
export default UploadCard;