import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import "./Toast.css"; // Import the new CSS file
import GreenBubbles from "../../assets/green-bubbles.png";
import RedBubbles from "../../assets/red-bubbles.png";
import YellowBubbles from "../../assets/yellow-bubbles.png";
import BlueBubbles from "../../assets/blue-bubbles.png";

const statusStyles = {
  success: {
    bg: "toast-success",
    closeBtn: "close-btn-success",
    title: "Success!",
    img: GreenBubbles,
  },
  error: {
    bg: "toast-error",
    closeBtn: "close-btn-error",
    title: "Error!",
    img: RedBubbles,
  },
  warning: {
    bg: "toast-warning",
    closeBtn: "close-btn-warning",
    title: "Warning!",
    img: YellowBubbles,
  },
  info: {
    bg: "toast-info",
    closeBtn: "close-btn-info",
    title: "Info!",
    img: BlueBubbles,
  },
};

// Base positioning without transforms
const basePositionClasses = {
  "top-left": "top-left",
  "top-right": "top-right",
  "top-center": "top-center",
  "bottom-left": "bottom-left",
  "bottom-right": "bottom-right",
  "bottom-center": "bottom-center",
};

// Separate centering transforms
const centeringClasses = {
  "top-left": "",
  "top-right": "",
  "top-center": "translate-center",
  "bottom-left": "",
  "bottom-right": "",
  "bottom-center": "translate-center",
};

// Direction mapping for animations based on position
const animationDirections = {
  "top-left": "animate-left",
  "top-right": "animate-right",
  "top-center": "animate-top",
  "bottom-left": "animate-left",
  "bottom-right": "animate-right",
  "bottom-center": "animate-bottom",
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

  useEffect(() => {
    const mountTimer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => setProgress((prev) => Math.max(0, prev - 100 / (duration / 100))), 100);
      const timer = setTimeout(() => {
        setMounted(false);
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

  const handleClose = () => {
    setMounted(false);
    setTimeout(() => {
      setVisible(false);
      onClose?.(id);
    }, 300);
  };

  if (!visible) return null;

  const animationClass = mounted ? centeringClasses[position] : `${centeringClasses[position]} ${animationDirections[position]}`;

  return (
    <div className={`toast-container ${basePositionClasses[position]} ${animationClass}`}>
      <div className={`toast ${statusStyles[status].bg}`}>
        <img src={statusStyles[status].img} alt="background" className="toast-img" />
        <div className="toast-content">
          <h4 className="toast-title">{statusStyles[status].title}</h4>
          <p className="toast-message">{message}</p>
        </div>
        <div className="toast-progress">
          <div className="toast-progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <button onClick={handleClose} className={`toast-close-btn ${statusStyles[status].closeBtn}`} aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" className="toast-close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
