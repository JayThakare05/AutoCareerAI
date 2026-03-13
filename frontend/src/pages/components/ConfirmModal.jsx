import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 h-screen w-screen overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-[#13131f] border border-gray-100 dark:border-[#1e1e30] rounded-[32px] shadow-2xl overflow-hidden z-10"
        >
          {/* Header decoration */}
          <div className={`h-2 w-full ${type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`} />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-all"
          >
            <X size={18} />
          </button>

          <div className="p-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 
              ${type === 'danger' ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'}`}>
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-xl font-black italic tracking-tighter text-gray-900 dark:text-slate-100 uppercase mb-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
              {message}
            </p>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all border border-gray-100 dark:border-white/5"
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-lg
                  ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
