import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

const EmptyState = ({ 
  title = 'No Items Found', 
  message = 'We couldn\'t find any records here right now.', 
  actionText, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/40 border border-stone-200/50 rounded-3xl max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4 animate-bounce">
        <FiAlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-display font-semibold text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 mb-6 max-w-sm">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-primary hover:bg-primary-light text-white font-medium px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 text-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
