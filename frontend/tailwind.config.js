export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        electric: {
          DEFAULT: "#00b4ff",
          light: "#33c5ff",
          dark: "#0090cc",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out both",
        "slide-up": "slideUp 0.45s ease-out both",
        "slide-in": "slideIn 0.35s ease-out both",
        "glow-pulse": "glowPulse 2.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-14px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 8px rgba(0,180,255,0.3)" },
          "50%": { boxShadow: "0 0 28px rgba(0,180,255,0.65)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        electric: "0 0 20px rgba(0,180,255,0.3)",
        "electric-lg": "0 0 40px rgba(0,180,255,0.5)",
        "card-dark": "0 4px 30px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
