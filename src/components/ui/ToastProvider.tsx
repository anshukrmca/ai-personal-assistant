"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { v4 as uuid } from 'uuid';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
    const id = uuid();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const styleConfig = {
    success: {
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      border: 'border-success/20',
      bg: 'bg-surface',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-[#f59e0b]" />,
      border: 'border-[#f59e0b]/20',
      bg: 'bg-surface',
    },
    error: {
      icon: <AlertCircle className="h-5 w-5 text-danger" />,
      border: 'border-danger/20',
      bg: 'bg-surface',
    },
    info: {
      icon: <Info className="h-5 w-5 text-accent" />,
      border: 'border-accent/20',
      bg: 'bg-surface',
    },
  };

  const current = styleConfig[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl animate-in slide-in-from-right-5 duration-200 ${current.border} ${current.bg}`}
    >
      <div className="flex-shrink-0 self-start">{current.icon}</div>
      <div className="flex-grow">
        <p className="text-[13px] font-bold text-text-primary leading-snug">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-text-tertiary hover:text-text-primary p-0.5 rounded transition-colors cursor-pointer shrink-0"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
