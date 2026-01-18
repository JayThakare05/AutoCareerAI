const Sidebar = ({ navigate }) => (
  <div className="w-64 bg-white border-r px-6 py-8 hidden md:flex flex-col">

    {/* LOGO */}
    <h1
      className="text-2xl font-extrabold text-purple-600 mb-10
                 cursor-pointer"
      onClick={() => navigate("/dashboard")}
    >
      AutoCareer<span className="text-pink-500">AI</span>
    </h1>

    {/* NAV */}
    <nav className="flex-1 space-y-2">
      <SidebarItem
        label="See Jobs"
        onClick={() => navigate("/dashboard")}
      />

      <SidebarItem
        label="Upload Documents"
        onClick={() => navigate("/upload")}
      />

      <SidebarItem
        label="Jobs as per Certificates"
        onClick={() => navigate("/jobs")}
      />

      <SidebarItem
        label="Analyse Resume"
        onClick={() => navigate("/resume-analyzer")}
      />

      <SidebarItem
        label="Saved Jobs"
        onClick={() => navigate("/saved-jobs")}
      />
      <SidebarItem
        label="Recommend Project "
        onClick={() => navigate("/project-recommend")}
      />
    </nav>

    {/* FOOTER (OPTIONAL FUTURE USE) */}
    <div className="text-xs text-gray-400 mt-10">
      © {new Date().getFullYear()} AutoCareerAI
    </div>
  </div>
);

const SidebarItem = ({ label, onClick, primary }) => (
  <div
    onClick={onClick}
    className={`
      cursor-pointer px-4 py-2 rounded-xl font-medium transition
      ${
        primary
          ? "bg-purple-600 text-white hover:bg-purple-700"
          : "text-gray-700 hover:bg-purple-100"
      }
    `}
  >
    {label}
  </div>
);

export default Sidebar;
