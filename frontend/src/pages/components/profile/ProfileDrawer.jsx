import { X, LogOut, User, FileText, HelpCircle, Briefcase } from "lucide-react";

const ProfileDrawer = ({ user, open, onClose, navigate }) => {
  const logout = () => {
    localStorage.removeItem("token");
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 dark:bg-black/70 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full w-80
          bg-white dark:bg-[#111118]
          border-l border-gray-200 dark:border-[#1e1e30]
          shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.8)]
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-[#1e1e30]">
          <h3 className="font-semibold text-gray-900 dark:text-slate-100">My Account</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-[#1a1a28] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile info */}
        <div className="flex flex-col items-center p-7 border-b border-gray-200 dark:border-[#1e1e30]">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-purple-400 dark:border-electric shadow"
            />
          ) : (
            <div className="
              w-20 h-20 rounded-full mb-3
              bg-purple-600 dark:bg-electric/20 dark:border-2 dark:border-electric
              flex items-center justify-center
              text-white dark:text-electric text-2xl font-bold
              shadow-lg dark:shadow-electric
              animate-float
            ">
              {user.firstName?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <p className="font-semibold text-gray-800 dark:text-slate-100 mt-1">
            {user.firstName} {user.surname}
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{user.email}</p>
        </div>

        {/* Menu */}
        <div className="p-3 space-y-0.5">
          <MenuItem icon={<User size={15} />} label="My Profile" onClick={() => { navigate("/profile"); onClose(); }} />
          <MenuItem icon={<FileText size={15} />} label="My Certificates" onClick={() => { navigate("/documents"); onClose(); }} />
          <MenuItem icon={<Briefcase size={15} />} label="Applied Scheme" onClick={() => { navigate("/applied"); onClose(); }} />
          <MenuItem icon={<HelpCircle size={15} />} label="Help Desk" onClick={() => { navigate("/help"); onClose(); }} />
        </div>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-[#1e1e30]">
          <button
            onClick={logout}
            className="
              w-full flex items-center justify-center gap-2
              text-red-500 dark:text-red-400 font-semibold py-2.5 rounded-xl
              hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200
            "
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="
      flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer
      text-gray-700 dark:text-slate-300 font-medium text-sm
      hover:bg-purple-50 dark:hover:bg-electric/10
      hover:text-purple-700 dark:hover:text-electric
      transition-all duration-200
    "
  >
    <span className="opacity-70">{icon}</span>
    {label}
  </div>
);

export default ProfileDrawer;
