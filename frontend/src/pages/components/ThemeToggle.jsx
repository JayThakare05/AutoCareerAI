import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
    const { dark, toggle } = useTheme();

    return (
        <button
            onClick={toggle}
            title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={`
        relative w-14 h-7 rounded-full focus:outline-none shrink-0
        transition-all duration-300
        ${dark
                    ? "bg-electric/20 border border-electric/40 shadow-electric"
                    : "bg-blue-100 border border-blue-200"
                }
      `}
        >
            {/* Track label icons */}
            <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
                <Sun size={11} className={`transition-opacity duration-300 ${dark ? "opacity-30 text-white" : "opacity-0"}`} />
                <Moon size={11} className={`transition-opacity duration-300 ${dark ? "opacity-0" : "opacity-30 text-blue-500"}`} />
            </span>

            {/* Thumb */}
            <span
                className={`
          absolute top-0.5 left-0.5 w-6 h-6 rounded-full
          flex items-center justify-center shadow-md
          transition-all duration-300
          ${dark
                        ? "translate-x-7 bg-electric text-white"
                        : "translate-x-0 bg-blue-600 text-white"
                    }
        `}
            >
                {dark
                    ? <Moon size={12} />
                    : <Sun size={12} />
                }
            </span>
        </button>
    );
}
