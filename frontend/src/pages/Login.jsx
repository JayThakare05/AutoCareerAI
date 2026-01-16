import { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative">

      {/* Logo */}
      <div className="absolute top-6 left-6 text-white text-2xl font-extrabold tracking-wide">
        AutoCareer<span className="text-pink-300">AI</span>
      </div>

      {/* Center Card */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30
                        p-8 rounded-2xl shadow-2xl w-[380px] text-white">

          <h2 className="text-3xl font-bold mb-2 text-center">
            Welcome Back 👋
          </h2>
          <p className="text-sm text-center text-white/80 mb-6">
            Login to continue your career journey
          </p>

          {/* Email */}
          <input
            className="w-full p-3 mb-4 rounded-xl bg-white/90 text-black
                       focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            className="w-full p-3 mb-5 rounded-xl bg-white/90 text-black
                       focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl font-semibold text-white
                       bg-gradient-to-r from-pink-500 to-purple-500
                       hover:scale-[1.02] hover:shadow-lg
                       transition-all duration-200"
          >
            Login →
          </button>

          {/* Register */}
          <p className="mt-6 text-sm text-center text-white/80">
            New here?{" "}
            <Link
              to="/register"
              className="text-pink-300 font-semibold hover:underline"
            >
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
