import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let globalToastHandler: ((message: string, type?: ToastType, title?: string) => void) | null = null;

// Global helper that works even outside React components
export const toast = {
  success: (msg: string, title?: string) => globalToastHandler?.(msg, 'success', title),
  error: (msg: string, title?: string) => globalToastHandler?.(msg, 'error', title),
  info: (msg: string, title?: string) => globalToastHandler?.(msg, 'info', title),
  warning: (msg: string, title?: string) => globalToastHandler?.(msg, 'warning', title),
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 3800) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = { id, message, type, title, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  // Set global handler
  React.useEffect(() => {
    globalToastHandler = showToast;
    return () => {
      globalToastHandler = null;
    };
  }, [showToast]);

  const success = useCallback((msg: string, title?: string) => showToast(msg, 'success', title), [showToast]);
  const error = useCallback((msg: string, title?: string) => showToast(msg, 'error', title), [showToast]);
  const info = useCallback((msg: string, title?: string) => showToast(msg, 'info', title), [showToast]);
  const warning = useCallback((msg: string, title?: string) => showToast(msg, 'warning', title), [showToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, success, error, info, warning, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        id="motorgrid-toast-container"
        className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((item) => {
          const isSuccess = item.type === 'success';
          const isError = item.type === 'error';
          const isWarning = item.type === 'warning';

          return (
            <div
              key={item.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-0 backdrop-blur-md ${
                isSuccess
                  ? 'bg-[#0f1d15]/95 border-emerald-500/50 text-emerald-100 shadow-emerald-950/40'
                  : isError
                  ? 'bg-[#220d11]/95 border-rose-500/50 text-rose-100 shadow-rose-950/40'
                  : isWarning
                  ? 'bg-[#241708]/95 border-amber-500/50 text-amber-100 shadow-amber-950/40'
                  : 'bg-[#181528]/95 border-[#8B5CF6]/50 text-purple-100 shadow-purple-950/40'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#A78BFA]" />}
              </div>

              <div className="flex-1 min-w-0">
                {item.title && (
                  <h5 className="text-xs font-bold leading-tight mb-0.5">
                    {item.title}
                  </h5>
                )}
                <p className="text-xs leading-relaxed text-zinc-200">
                  {item.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(item.id)}
                className="shrink-0 p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Fechar notificação"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

const fallbackToastContext: ToastContextValue = {
  toasts: [],
  showToast: (msg, type, title, duration) => globalToastHandler?.(msg, type, title),
  success: (msg, title) => globalToastHandler?.(msg, 'success', title),
  error: (msg, title) => globalToastHandler?.(msg, 'error', title),
  info: (msg, title) => globalToastHandler?.(msg, 'info', title),
  warning: (msg, title) => globalToastHandler?.(msg, 'warning', title),
  removeToast: () => {},
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return fallbackToastContext;
  }
  return context;
};
