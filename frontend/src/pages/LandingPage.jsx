import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Search,
  MessageSquare,
  FileText,
  MousePointerClick,
  Sparkles,
  ChevronRight,
  Star,
  Brain,
  Target,
} from "lucide-react";

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function useCounter(end, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * end));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end, duration]);
  return val;
}

function StatCounter({ value, suffix, label }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const count = useCounter(value, 1600, started);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStarted(true); },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <span className="text-4xl md:text-5xl font-black tracking-tighter text-white">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, description, delay, image, accent = "#3b82f6" }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    className="group relative flex flex-col rounded-[28px] overflow-hidden border border-white/8
               bg-gradient-to-b from-white/[0.05] to-white/[0.02]
               hover:border-blue-500/35 hover:from-white/[0.08] transition-all duration-500"
  >
    {image && (
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-55 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-[#0a0a10]/30 to-transparent" />
        <div className="absolute top-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
    )}
    <div className="p-6 flex flex-col gap-3 flex-1">
      {!image && (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-1"
          style={{ background: `${accent}18`, border: `1px solid ${accent}33` }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
      )}
      <h3 className="text-[15px] font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      <div className="mt-auto pt-3 flex items-center gap-1 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
        Learn more <ChevronRight size={12} />
      </div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   STEP
───────────────────────────────────────────── */
const Step = ({ num, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="flex gap-5 group"
  >
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full border border-blue-500/40 bg-blue-600/10 flex items-center justify-center text-blue-400 font-black text-sm flex-shrink-0 group-hover:bg-blue-600/25 transition-colors">
        {num}
      </div>
      {num < 4 && <div className="w-px flex-1 min-h-[40px] bg-gradient-to-b from-blue-500/25 to-transparent mt-1" />}
    </div>
    <div className="pb-8">
      <p className="text-white font-bold text-[15px] mb-1.5 tracking-tight">{title}</p>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   FLOATING BADGE
───────────────────────────────────────────── */
const FloatingBadge = ({ icon: Icon, label, value, color, style, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-xl border border-white/10 bg-black/50 shadow-2xl"
    style={style}
  >
    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
      <Icon size={15} style={{ color }} />
    </div>
    <div>
      <div className="text-[9px] uppercase tracking-[0.15em] font-bold text-gray-400">{label}</div>
      <div className="text-sm font-black text-white">{value}</div>
    </div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#07070c] text-white overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,900&family=Syne:wght@700;800&display=swap');`}</style>

      {/* ── AMBIENT BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-700/7 blur-[180px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[60%] rounded-full bg-indigo-700/7 blur-[160px]" />
        <div className="absolute inset-0 opacity-[0.018]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-50 max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <div className="relative">
            <img
              src="icon.png"
              alt="AutoCareerAI Icon"
              className="w-9 h-9 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight leading-none">
              AUTOCAREER<span className="text-blue-500">AI</span>
            </span>
            <span className="text-[8px] font-black text-blue-400/60 uppercase tracking-[0.3em] mt-1">Development Beta</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="hidden md:flex items-center gap-7 text-[13px] font-medium text-gray-400"
        >
          {[
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            { name: "Pricing", href: "#pricing" },
          ].map((link) => (
            <a key={link.name} href={link.href} className="hover:text-white transition-colors">
              {link.name}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block text-[13px] font-semibold text-gray-400 hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-[13px] tracking-wide hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-600/25"
          >
            Get Started
          </button>
        </motion.div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-14 pb-28 px-6 text-center overflow-hidden">
        {/* Background Image Addition */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <img 
            src="/electrify.png" 
            alt="Background Effect" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[#07070c]/60" /> {/* Subtle overlay to keep text readable */}
        </div>

        <div className="max-w-5xl mx-auto flex flex-col items-center relative z-10">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/25 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-8"
          >
            <Sparkles size={10} className="animate-pulse" />
            Next-Gen AI Career Suite
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.88] mb-6 uppercase italic"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Elevate Your Career{" "}
            <br className="hidden sm:block" />
            with{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
                Intelligence
              </span>
              <svg className="absolute -bottom-1 left-0 w-full overflow-visible" height="6" viewBox="0 0 100 6" preserveAspectRatio="none">
                <path d="M0 5 Q50 0 100 5" stroke="url(#ug)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <defs>
                  <linearGradient id="ug" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="text-base md:text-lg text-gray-400 font-medium max-w-xl leading-relaxed mb-10"
          >
            Analyze resumes, master mock interviews, and find your dream job with our all-in-one AI-powered career platform. Built for the modern professional.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <button
              onClick={() => navigate("/register")}
              className="group px-9 py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[13px] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-2xl"
            >
              Start Your Journey
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-9 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-[13px] hover:bg-white/8 transition-all backdrop-blur-md"
            >
              Sign In
            </button>
          </motion.div>

          {/* ── HERO MOSAIC — 3 relevant feature images in a grid ── */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl"
          >
            <div className="absolute -inset-6 rounded-[48px] bg-gradient-to-br from-blue-600/12 via-indigo-600/8 to-violet-600/12 blur-3xl" />

            <div className="relative grid grid-cols-12 gap-3" style={{ gridTemplateRows: "180px 160px" }}>

              {/* LEFT TALL — Resume Analysis */}
              <div className="col-span-5 row-span-2 rounded-[24px] overflow-hidden border border-white/8 bg-[#0d0d14] relative group">
                <img
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=700&auto=format&fit=crop"
                  alt="Resume Analysis"
                  className="w-full h-full object-cover opacity-45 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] via-[#0d0d14]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/25 border border-blue-500/30 text-[9px] font-black uppercase tracking-[0.15em] text-blue-400 mb-2">
                    <FileText size={8} /> Resume AI
                  </div>
                  <p className="text-white font-bold text-sm leading-snug">Smart resume scoring &amp; gap analysis</p>
                </div>
              </div>

              {/* TOP RIGHT — Mock Interview */}
              <div className="col-span-7 rounded-[24px] overflow-hidden border border-white/8 bg-[#0d0d14] relative group">
                <img
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=900&auto=format&fit=crop"
                  alt="AI Mock Interview"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d14]/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-600/25 border border-violet-500/30 text-[9px] font-black uppercase tracking-[0.15em] text-violet-300 mb-2">
                    <MessageSquare size={8} /> Mock Interviews
                  </div>
                  <p className="text-white font-bold text-sm">Practice. Get feedback. Get hired.</p>
                </div>
              </div>

              {/* BOTTOM RIGHT — Job Search */}
              <div className="col-span-4 rounded-[24px] overflow-hidden border border-white/8 bg-[#0d0d14] relative group">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600&auto=format&fit=crop"
                  alt="Job Matching"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d14] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-600/20 border border-green-500/25 text-[9px] font-black uppercase tracking-[0.15em] text-green-400 mb-1.5">
                    <Search size={8} /> Job Match
                  </div>
                  <p className="text-white font-bold text-[13px]">Neural job matching engine</p>
                </div>
              </div>

              {/* BOTTOM FAR RIGHT — Skill */}
              <div className="col-span-3 rounded-[24px] border border-white/8 bg-[#0d0d14] relative p-5 flex flex-col justify-between overflow-hidden group hover:border-blue-500/30 transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1508317469940-e3de49ba902e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Job Matching"
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent" />
                <Zap size={24} className="text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity relative z-10" />
                <div className="relative z-10">
                  <p className="text-white font-bold text-[13px] leading-snug">Skill Verification</p>
                  <p className="text-gray-500 text-[11px] mt-1">AI-verified skill stack</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-500 mb-3">Capabilities</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Everything you need to{" "}
              <span className="text-blue-500">Scale</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={FileText}
              title="Resume Intelligence"
              description="Get deep insights and AI scoring on your resume compared to target job descriptions. Know exactly what to fix."
              delay={0.05}
              image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=700&auto=format&fit=crop"
              accent="#3b82f6"
            />
            <FeatureCard
              icon={MessageSquare}
              title="AI Mock Interviews"
              description="Practice with an adaptive AI interviewer. Receive real-time feedback on your answers, pacing, and clarity."
              delay={0.12}
              image="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=700&auto=format&fit=crop"
              accent="#8b5cf6"
            />
            <FeatureCard
              icon={Search}
              title="Neural Job Matching"
              description="Our algorithms find the perfect roles based on your verified skills, experience, and career interests."
              delay={0.19}
              image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=700&auto=format&fit=crop"
              accent="#22c55e"
            />
            <FeatureCard
              icon={Zap}
              title="Skill Verification"
              description="Upload certificates and let our AI verify and extract skills to build your verified professional stack."
              delay={0.26}
              image="https://plus.unsplash.com/premium_photo-1661963212517-830bbb7d76fc?q=80&w=1086&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              accent="#f59e0b"
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Project Architect"
              description="Receive personalized project recommendations to bridge experience gaps and impress hiring managers."
              delay={0.33}
              image="https://plus.unsplash.com/premium_photo-1661290256778-3b821d52c514?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D"
              accent="#06b6d4"
            />
            <FeatureCard
              icon={MousePointerClick}
              title="One-Click Apply"
              description="Seamlessly apply to matched jobs with your AI-optimized profile and track every application in one place."
              delay={0.4}
              image="https://media.istockphoto.com/id/185277608/photo/hand-with-computer-mouse.webp?a=1&b=1&s=612x612&w=0&k=20&c=nNIjp0dA-YhZeHQYp9s3dDzibcxaphlmHqiGoOlJ-ZM="
              accent="#ec4899"
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-24 px-6 border-y border-white/5 bg-white/[0.018]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-500 mb-3">Process</p>
              <h2
                className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                How It Works
              </h2>
            </motion.div>
            <Step num={1} title="Build your profile" desc="Upload your resume and certificates. Our AI parses everything into a structured career profile in seconds." delay={0.08} />
            <Step num={2} title="Get your AI report" desc="Receive a full resume score, skill gap analysis, and improvement suggestions tailored to your target roles." delay={0.16} />
            <Step num={3} title="Practice interviews" desc="Run unlimited AI mock interviews with role-specific questions and get scored feedback after each session." delay={0.24} />
            <Step num={4} title="Apply and track" desc="Browse matched jobs, one-click apply, and monitor your entire pipeline from a single smart dashboard." delay={0.32} />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-blue-600/12 to-violet-600/10 blur-2xl" />
            <div className="relative rounded-[28px] overflow-hidden border border-white/8">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=900&auto=format&fit=crop"
                alt="Team using AutoCareerAI"
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070c] via-[#07070c]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="p-4 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">Resume Score</span>
                    <span className="text-green-400 font-black text-sm">92 / 100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "92%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-400"
                    />
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["ATS Ready", "Strong Keywords", "Clear Format"].map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-[9px] text-gray-300 font-bold uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EARLY ACCESS TRUST BLOCK (PRICING) ── */}
      <section id="pricing" className="relative z-10 py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-500 mb-3">Why Join Now</p>
            <h2
              className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Built for Builders,
              <br />
              <span className="text-blue-500">Not Bureaucrats.</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-lg mx-auto text-base leading-relaxed">
              We're in early access — and that's an advantage. Shape the product, get priority features, and lock in free tier access before we open up.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: Zap,
                color: "#f59e0b",
                title: "Early Mover Advantage",
                desc: "Early access users get permanent priority queue for new features and beta tools before public launch.",
              },
              {
                icon: ShieldCheck,
                color: "#22c55e",
                title: "Free Tier — Always",
                desc: "Core features like resume scoring and job matching will remain free. No bait-and-switch, no hidden paywalls.",
              },
              {
                icon: Star,
                color: "#8b5cf6",
                title: "Shape the Product",
                desc: "Direct line to the team. Your feedback drives what we build next. This is a platform built with its users.",
              },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-7 rounded-[24px] bg-white/[0.03] border border-white/8 hover:border-white/15 transition-all duration-300 flex flex-col gap-4"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-[15px] mb-2 tracking-tight">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[40px] overflow-hidden p-12 md:p-20 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800" />
            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "160px" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-white/6 rounded-full blur-[80px]" />
            <div className="absolute top-8 right-10 opacity-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                <Zap size={180} />
              </motion.div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">
                <Sparkles size={10} />
                Free Early Access
              </div>
              <h2
                className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-5"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Ready to transform <br /> your career?
              </h2>
              <p className="text-blue-100/80 text-base md:text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Join thousands of professionals using AutoCareerAI to secure their future.
              </p>
              <button
                onClick={() => navigate("/register")}
                className="px-12 py-5 rounded-2xl bg-white text-blue-700 font-black uppercase tracking-widest text-sm hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                Create Free Account
              </button>
              <p className="mt-5 text-white/30 text-xs font-medium">No credit card required · Always free core features</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-10 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            <img src="icon.png" className="w-6 h-6 object-contain" alt="Icon" />
            <span className="text-sm font-extrabold tracking-tight text-gray-400">
              AUTOCAREER<span className="text-blue-500">AI</span>
            </span>
          </div>
          <p className="text-gray-600 text-xs font-medium">© 2026 AutoCareerAI Intelligence Suite. Experimental Build.</p>
          <div className="flex items-center gap-5 text-xs text-gray-600">
            {["Privacy", "Terms", "Contact"].map((t) => (
              <a key={t} href="#" className="hover:text-gray-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
