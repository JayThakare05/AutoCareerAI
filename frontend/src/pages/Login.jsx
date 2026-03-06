import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-400 dark:from-slate-900 dark:via-black dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-electric/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Logo & Theme Toggle */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <div className="text-white text-2xl font-extrabold tracking-wide drop-shadow-lg">
          AutoCareer<span className="text-purple-300 dark:text-electric">AI</span>
        </div>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Center Card */}
      <div className="relative z-10 w-full max-w-[400px] animate-slide-up">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-electric/20
                        p-8 rounded-3xl shadow-2xl dark:shadow-electric/10 text-white">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">
              Welcome Back <span className="inline-block animate-float">👋</span>
            </h2>
            <p className="text-sm text-white/70 dark:text-slate-400">
              Login to continue your career journey
            </p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 ml-1">Email Address</label>
              <input
                className="w-full p-3.5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-white
                           placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-electric 
                           transition-all duration-300 group-hover:bg-white/20"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                className="w-full p-3.5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-white
                           placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-electric 
                           transition-all duration-300 group-hover:bg-white/20"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full mt-4 py-4 rounded-2xl font-bold text-white
                         bg-gradient-to-r from-blue-500 to-purple-500 dark:from-electric dark:to-purple-600
                         shadow-lg shadow-blue-500/20 dark:shadow-electric/20
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Login <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-sm text-center">
            <span className="text-white/60">New here? </span>
            <Link
              to="/register"
              className="text-blue-300 dark:text-electric font-bold hover:underline underline-offset-4 decoration-2"
            >
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
