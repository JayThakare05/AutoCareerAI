import { Link } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="min-h-screen transition-colors duration-500 bg-gradient-to-br from-blue-600 via-indigo-500 to-blue-400 dark:from-slate-900 dark:via-black dark:to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-electric/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Logo & Theme Toggle */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <div className="text-white text-2xl font-extrabold tracking-wide drop-shadow-lg">
          AutoCareer<span className="text-blue-300 dark:text-electric">AI</span>
        </div>
      </div>
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-[500px] text-center animate-slide-up">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-black/40 border border-white/20 dark:border-electric/20
                        p-12 rounded-3xl shadow-2xl dark:shadow-electric/10 text-white">
          
          <h1 className="text-9xl font-black mb-4 tracking-tighter opacity-20">404</h1>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            Lost in Space? <span className="inline-block animate-float">🚀</span>
          </h2>
          <p className="text-lg text-white/70 dark:text-slate-400 mb-8">
            The page you're looking for doesn't exist or has been moved to another dimension.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white
                       bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-electric dark:to-blue-600
                       shadow-lg shadow-blue-500/20 dark:shadow-electric/20
                       hover:scale-[1.05] active:scale-[0.95]
                       transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Back to Dashboard <span className="group-hover:-translate-x-1 transition-transform">🏠</span>
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </Link>
        </div>
      </div>
    </div>
  );
}
