import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";

const statusStyles = {
  success: { bg: "bg-[#4EC33D]", closeBtn: "bg-[#2C7721]", title: "Success!", img: "images/green-bubbles.png" },
  error: { bg: "bg-[#FC2E20]", closeBtn: "bg-[#940000]", title: "Error!", img: "images/red-bubbles.png" },
  warning: { bg: "bg-[#F9943B]", closeBtn: "bg-[#D05301]", title: "Warning!", img: "images/yellow-bubbles.png" },
  info: { bg: "bg-[#65ACF0]", closeBtn: "bg-[#2A72C3]", title: "Info!", img: "images/blue-bubbles.png" },
};

// Base positioning without transforms
const basePositionClasses = {
  "top-left": "top-5 left-5",
  "top-right": "top-5 right-5",
  "top-center": "top-5 left-1/2",
  "bottom-left": "bottom-5 left-5",
  "bottom-right": "bottom-5 right-5",
  "bottom-center": "bottom-5 left-1/2",
};

// Separate centering transforms
const centeringClasses = {
  "top-left": "",
  "top-right": "",
  "top-center": "-translate-x-1/2",
  "bottom-left": "",
  "bottom-right": "",
  "bottom-center": "-translate-x-1/2",
};

// Direction mapping for animations based on position
const animationDirections = {
  "top-left": "-translate-x-full",
  "top-right": "translate-x-full",
  "top-center": "-translate-y-full",
  "bottom-left": "-translate-x-full",
  "bottom-right": "translate-x-full",
  "bottom-center": "translate-y-full",
};

interface ToastProps {
  id: string;
  status: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
  position?: "top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center";
  onClose?: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, status, message, duration = 3000, position = "bottom-right", onClose }) => {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(100);

  // Initial mount animation
  useEffect(() => {
    // Small delay to ensure the initial state is applied before transition
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 10);
    
    return () => clearTimeout(mountTimer);
  }, []);

  // Duration and auto-close effect
  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => setProgress((prev) => Math.max(0, prev - 100 / (duration / 100))), 100);
      const timer = setTimeout(() => {
        setMounted(false);
        // Wait for exit animation to complete before removing
        setTimeout(() => {
          setVisible(false);
          onClose?.(id);
        }, 300);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [id, duration, onClose]);

  // Handle manual close with animation
  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      setVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!visible) return null;

  // Determine the animation class
  const animationClass = mounted 
    ? centeringClasses[position] // When mounted, only apply centering transform
    : `${centeringClasses[position]} ${animationDirections[position]}`; // When not mounted, combine centering with animation

  return (
    <div 
      className={cn(
        "fixed max-w-md z-50 transition-all duration-300 ease-out", 
        basePositionClasses[position],
        "transform",
        animationClass
      )}
    >
      <div className={cn("relative p-4 rounded-xl shadow-lg text-white overflow-hidden", statusStyles[status].bg)}>
        <img src={statusStyles[status].img} alt="background" className="absolute bottom-0 left-0 w-14 h-14" />
        <div className="ml-10">
          <h4 className="font-bold text-xl">{statusStyles[status].title}</h4>
          <p className="text-sm">{message}</p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30">
          <div 
            className="h-full bg-white transition-all duration-100" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <button
          onClick={handleClose}
          className={cn("absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full", statusStyles[status].closeBtn)}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;