import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className={`bg-white w-full ${sizeClasses[size]} rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden relative z-10 animate-float-up max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50 shrink-0">
          <h3 className="text-lg font-display font-semibold text-stone-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 bg-stone-100 hover:bg-stone-200 p-1.5 rounded-full transition-all focus:outline-hidden"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
