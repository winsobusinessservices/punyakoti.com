import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 animate-float-up">
      <div className="text-8xl select-none">🌾</div>
      
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-stone-850 m-0 leading-none">
          {t('notFoundTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
          {t('notFoundMsg')}
        </p>
      </div>

      <div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 text-sm"
        >
          <FiHome className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
