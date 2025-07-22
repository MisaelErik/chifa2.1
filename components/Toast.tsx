import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from './icons';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2500); // Start exit animation after 2.5 seconds

    return () => clearTimeout(exitTimer);
  }, []);

  useEffect(() => {
    if (isExiting) {
      const closeTimer = setTimeout(onClose, 300); // Match duration of exit animation
      return () => clearTimeout(closeTimer);
    }
  }, [isExiting, onClose]);

  return (
    <div
      className={`fixed top-20 sm:top-5 right-5 z-[100] flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-2xl transition-all duration-300 transform ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <CheckCircleIcon className="w-6 h-6" />
      <span className="font-semibold">{message}</span>
    </div>
  );
};

export default Toast;
