import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, Briefcase,
  FileSearch, Bookmark, Lightbulb, MessageSquare,
  Menu, X
} from "lucide-react";

const navItems = [
  { label: "See Jobs", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Jobs as per Certificates", icon: Briefcase, path: "/jobs" },
  { label: "Analyse Resume", icon: FileSearch, path: "/resume-analyzer" },
  { label: "Mock Interview", icon: MessageSquare, path: "/mock-interview" },
  { label: "Saved Jobs", icon: Bookmark, path: "/saved-jobs" },
  { label: "Recommend Project", icon: Lightbulb, path: "/project-recommend" },
];

const Sidebar = ({ navigate }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const sidebarContent = (
    <div className="flex flex-col h-full px-5 py-8">
      {/* Logo */}
      <h1
        className="text-xl font-extrabold mb-10 cursor-pointer text-blue-600 dark:text-electric animate-fade-in hover:opacity-80 transition-opacity"
        onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}
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
            active={location.pathname === item.path}
            onClick={() => { navigate(item.path); setMobileOpen(false); }}
          />
        ))}
      </nav>

      {/* Footer */}
      <p className="text-xs text-gray-400 dark:text-slate-600 mt-8 text-center">
        © {new Date().getFullYear()} AutoCareerAI
      </p>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (hidden on mobile) ── */}
      <div className="w-64 hidden md:flex flex-col shrink-0 bg-white dark:bg-[#0f0f1a] border-r border-gray-200 dark:border-[#1e1e30] h-full">
        {sidebarContent}
      </div>

      {/* ── Mobile: hamburger button ── */}
      <button
        id="mobile-sidebar-toggle"
        className="
          fixed top-4 left-4 z-50
          md:hidden
          p-2.5 rounded-xl
          bg-white dark:bg-[#0f0f1a]
          border border-gray-200 dark:border-[#1e1e30]
          shadow-md dark:shadow-electric/10
          text-gray-700 dark:text-slate-300
          hover:bg-gray-50 dark:hover:bg-[#1a1a2e]
          transition-all duration-200
          active:scale-95
        "
        onClick={() => setMobileOpen(prev => !prev)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ── Mobile: overlay backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile: slide-in drawer ── */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 z-40
          bg-white dark:bg-[#0f0f1a]
          border-r border-gray-200 dark:border-[#1e1e30]
          shadow-2xl dark:shadow-electric/10
          md:hidden
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
};

const SidebarItem = ({ label, Icon, onClick, active }) => (
  <div
    onClick={onClick}
    className={`
      group flex items-center gap-3
      px-3 py-2.5 rounded-xl cursor-pointer
      font-medium text-sm
      transition-all duration-200 animate-slide-in
      ${active
        ? "bg-blue-50 dark:bg-electric/10 text-blue-700 dark:text-electric font-semibold"
        : "text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-electric/10 hover:text-blue-700 dark:hover:text-electric"
      }
    `}
  >
    <Icon
      size={16}
      className={`shrink-0 transition-opacity ${active ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
    />
    <span>{label}</span>
  </div>
);

export default Sidebar;
