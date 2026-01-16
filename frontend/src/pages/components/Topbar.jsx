const Topbar = ({ user, navigate }) => (
  <div className="bg-white border-b px-6 py-4 flex items-center justify-between">

    {/* CENTER */}
    <h2 className="text-lg font-semibold">
      Welcome, <span className="text-purple-600">{user.firstName}</span> 👋
    </h2>

    {/* RIGHT PROFILE */}
    <div className="flex items-center space-x-3 cursor-pointer"
         onClick={() => navigate("/profile")}>

      <div className="w-10 h-10 rounded-full bg-purple-500
                      flex items-center justify-center text-white font-bold">
        {user.name?.charAt(0)}
      </div>

      <span className="hidden md:block text-sm font-medium">
        My Profile
      </span>
    </div>
  </div>
);

export default Topbar;