import React, { createContext, useContext, useState, ReactNode } from "react";
import Toast from "../../components/Toast/Toast";


interface ToastType {
  id: string;
  status: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
}

interface ToastContextType {
  addToast: (id: string, message: string, status: ToastType["status"], duration?: number, position?: ToastType["position"]) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (id: string, message: string, status: ToastType["status"], duration = 300000, position = "bottom-center") => {
    setToasts((prev) => {
      if (prev.some((toast) => toast.id === id)) return prev; 
      return [...prev, { id, message, status, duration, position } as ToastType];
    });

    // Auto-remove after duration
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook for using toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
