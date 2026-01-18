import { X, LogOut, User, FileText, HelpCircle, Briefcase } from "lucide-react";

const ProfileDrawer = ({ user, open, onClose, navigate }) => {
  const logout = () => {
    localStorage.removeItem("token");
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-xl
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">My Account</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* PROFILE INFO */}
        <div className="flex flex-col items-center p-6 border-b">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-3 border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-purple-500
                            flex items-center justify-center
                            text-white text-2xl font-bold mb-3">
              {user.surname?.charAt(0)}
            </div>
          )}

          <p className="font-semibold text-gray-800">
            {/* {user.firstName} {user.surname} */}       </p>

          <p className="text-xs text-gray-500">
            {user.email}
          </p>
        </div>

        {/* MENU */}
        <div className="p-4 space-y-1">
          <MenuItem
            icon={<User size={16} />}
            label="My Profile"
            onClick={() => { navigate("/profile"); onClose(); }}
          />
          <MenuItem
            icon={<FileText size={16} />}
            label="My Certificates"
            onClick={() => { navigate("/documents"); onClose(); }}
          />
          <MenuItem
            icon={<Briefcase size={16} />}
            label="Applied Scheme"
            onClick={() => { navigate("/applied"); onClose(); }}
          />
          <MenuItem
            icon={<HelpCircle size={16} />}
            label="Help Desk"
            onClick={() => { navigate("/help"); onClose(); }}
          />
        </div>

        {/* LOGOUT */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2
                       text-red-600 font-semibold py-2 rounded-lg
                       hover:bg-red-50 transition"
          >
            <LogOut size={18} />
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
    className="flex items-center gap-3 px-4 py-2 rounded-lg
               cursor-pointer text-gray-700 font-medium
               hover:bg-purple-100 transition"
  >
    {icon}
    {label}
  </div>
);

export default ProfileDrawer;
