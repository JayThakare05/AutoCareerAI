import {
  LayoutDashboard, Upload, Briefcase,
  FileSearch, Bookmark, Lightbulb
} from "lucide-react";

const navItems = [
  { label: "See Jobs", icon: LayoutDashboard, path: "/dashboard" },
  // { label: "Upload Documents", icon: Upload, path: "/upload" },
  { label: "Jobs as per Certificates", icon: Briefcase, path: "/jobs" },
  { label: "Analyse Resume", icon: FileSearch, path: "/resume-analyzer" },
  { label: "Saved Jobs", icon: Bookmark, path: "/saved-jobs" },
  { label: "Recommend Project", icon: Lightbulb, path: "/project-recommend" },
];

const Sidebar = ({ navigate }) => (
  <div className="
    w-64 hidden md:flex flex-col shrink-0
    bg-white dark:bg-[#0f0f1a]
    border-r border-gray-200 dark:border-[#1e1e30]
    px-5 py-8
  ">
    {/* Logo */}
    <h1
      className="
        text-xl font-extrabold mb-10 cursor-pointer
        text-blue-600 dark:text-electric
        animate-fade-in hover:opacity-80 transition-opacity
      "
      onClick={() => navigate("/dashboard")}
    >
      AutoCareer<span className="text-purple-400 dark:text-electric-light">AI</span>
    </h1>

    {/* Nav */}
    <nav className="flex-1 space-y-1 stagger">
      {navItems.map(item => (
        <SidebarItem
          key={item.path}
          label={item.label}
          Icon={item.icon}
          onClick={() => navigate(item.path)}
        />
      ))}
    </nav>

    {/* Footer */}
    <p className="text-xs text-gray-400 dark:text-slate-600 mt-8 text-center">
      © {new Date().getFullYear()} AutoCareerAI
    </p>
  </div>
);

const SidebarItem = ({ label, Icon, onClick }) => (
  <div
    onClick={onClick}
    className="
      group flex items-center gap-3
      px-3 py-2.5 rounded-xl cursor-pointer
      font-medium text-sm
      text-gray-600 dark:text-slate-400
      hover:bg-blue-50 dark:hover:bg-electric/10
      hover:text-blue-700 dark:hover:text-electric
      transition-all duration-200 animate-slide-in
    "
  >
    <Icon
      size={16}
      className="shrink-0 opacity-60 group-hover:opacity-100 transition-opacity"
    />
    <span>{label}</span>
  </div>
);

export default Sidebar;
