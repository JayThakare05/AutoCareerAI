import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const loadingToast = toast.loading("Authenticating...");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back!", { id: loadingToast });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-400 dark:from-slate-900 dark:via-black dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-electric/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Logo & Theme Toggle */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <Link to="/" className="text-white text-2xl font-extrabold tracking-tight drop-shadow-lg hover:scale-105 transition-transform">
          AUTOCAREER<span className="text-blue-300 dark:text-electric">AI</span>
        </Link>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Center Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-electric/20
                        p-10 rounded-[32px] shadow-2xl dark:shadow-electric/10 text-white">

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black italic tracking-tighter mb-2 italic uppercase">
              Welcome Back
            </h2>
            <p className="text-sm text-white/70 dark:text-slate-400 font-medium">
              Login to continue your career journey
            </p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 ml-1">Email Address</label>
              <input
                className="w-full p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-white
                           placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-electric 
                           transition-all duration-300 group-hover:bg-white/20 font-medium"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 ml-1">Password</label>
              <input
                type="password"
                className="w-full p-4 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 text-white
                           placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-electric 
                           transition-all duration-300 group-hover:bg-white/20 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-4 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm text-white
                         bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-electric dark:to-blue-600
                         shadow-lg shadow-blue-500/20 dark:shadow-electric/20
                         hover:scale-[1.05] active:scale-[0.95]
                         transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Authenticating..." : "Login"} <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-sm text-center">
            <span className="text-white/60 font-medium">New here? </span>
            <Link
              to="/register"
              className="text-blue-300 dark:text-electric font-black uppercase tracking-widest text-xs hover:underline underline-offset-4 decoration-2 ml-1"
            >
              Create Account
            </Link>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
