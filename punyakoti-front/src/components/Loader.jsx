import React from 'react';

const Loader = ({ type = 'spinner', count = 3 }) => {
  if (type === 'full') {
    return (
      <div className="fixed inset-0 bg-stone-900/10 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 border border-stone-200">
          <div className="w-12 h-12 rounded-full border-4 border-stone-200 border-t-primary animate-spin"></div>
          <span className="text-sm font-semibold text-primary-dark tracking-wide animate-pulse">Loading Punyakoti...</span>
        </div>
      </div>
    );
  }

  if (type === 'skeleton-card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-3xl p-5 border border-stone-200/60 shadow-xs space-y-4 animate-pulse">
            <div className="bg-stone-200 h-48 rounded-2xl w-full"></div>
            <div className="h-4 bg-stone-200 rounded-md w-2/3"></div>
            <div className="h-3 bg-stone-200 rounded-md w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-5 bg-stone-200 rounded-md w-1/4"></div>
              <div className="h-8 bg-stone-200 rounded-lg w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'skeleton-table') {
    return (
      <div className="w-full space-y-3 animate-pulse">
        <div className="h-10 bg-stone-200 rounded-lg w-full"></div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-12 bg-stone-100 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-8 h-8 rounded-full border-3 border-stone-200 border-t-primary animate-spin"></div>
    </div>
  );
};

export default Loader;
