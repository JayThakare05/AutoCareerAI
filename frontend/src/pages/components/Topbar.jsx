import { useState } from "react";
import ProfileDrawer from "./profile/ProfileDrawer";
import ThemeToggle from "./ThemeToggle";

const Topbar = ({ user, navigate }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="
        bg-white dark:bg-[#111118]
        border-b border-gray-200 dark:border-[#1e1e30]
        pl-16 md:pl-6 pr-6 py-3 flex items-center justify-between
      ">
        {/* Welcome */}
        <h2 className="text-base font-semibold text-gray-800 dark:text-slate-100 animate-fade-in">
          Welcome,{" "}
          <span className="text-purple-600 dark:text-electric font-bold">
            {user.firstName}
          </span>{" "}
          👋
        </h2>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Avatar */}
          <div
            className="
              w-9 h-9 rounded-full cursor-pointer
              bg-purple-600 dark:bg-electric/20 dark:border dark:border-electric/50
              flex items-center justify-center
              text-white dark:text-electric font-bold text-sm
              hover:scale-110 transition-transform duration-200
              shadow-md dark:shadow-electric
            "
            onClick={() => setOpen(true)}
            title="Account"
          >
            {user.firstName?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      </div>

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
