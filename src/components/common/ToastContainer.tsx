import React from 'react';
import { useToast, ToastType } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, Heart, Bookmark, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  const getIcon = (type?: ToastType) => {
    switch (type) {
      case 'heart':
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500 shrink-0" />;
      case 'bookmark':
        return <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-500 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div
      id="toast-container"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 bg-stone-900/95 dark:bg-stone-800 text-stone-100 rounded-xl shadow-xl border border-stone-700/60 backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              {getIcon(toast.type)}
              <span className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              id={`toast-close-${toast.id}`}
              onClick={() => removeToast(toast.id)}
              className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
