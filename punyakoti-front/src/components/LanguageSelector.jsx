import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeLang = languages.find(l => l.code === currentLanguage) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:text-primary hover:border-primary transition-all text-sm font-medium focus:outline-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FiGlobe className="w-4 h-4 text-stone-500" />
        <span>{activeLang.nativeName}</span>
        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-stone-200 rounded-2xl shadow-xl py-2 z-50 animate-float-up">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-stone-50 flex justify-between items-center ${
                currentLanguage === lang.code 
                  ? 'text-primary font-semibold bg-primary/5' 
                  : 'text-stone-600 hover:text-primary-dark'
              }`}
            >
              <span>{lang.nativeName}</span>
              <span className="text-xs text-stone-400 font-mono">({lang.code.toUpperCase()})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
