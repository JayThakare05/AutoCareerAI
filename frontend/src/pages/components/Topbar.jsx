import { useState } from "react";
import ProfileDrawer from "./profile/ProfileDrawer";

const Topbar = ({ user, navigate }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">

        {/* CENTER */}
        <h2 className="text-lg font-semibold">
          Welcome, <span className="text-purple-600">{user.firstName}</span> 👋
        </h2>

        {/* RIGHT PROFILE */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="w-10 h-10 rounded-full bg-purple-500
                          flex items-center justify-center
                          text-white font-bold">
            {user.firstName?.charAt(0)}
          </div>

          <span className="hidden md:block text-sm font-medium">
          </span>
        </div>
      </div>

      {/* DRAWER */}
      <ProfileDrawer
        user={user}
        open={open}
        onClose={() => setOpen(false)}
        navigate={navigate}
      />
    </>
  );
};

export default Topbar;
