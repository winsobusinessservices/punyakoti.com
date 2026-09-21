import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FAQAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-stone-200/80 bg-white rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-display font-medium text-stone-800 hover:text-primary transition-colors focus:outline-hidden"
        aria-expanded={isOpen}
      >
        <span className="text-sm md:text-base leading-snug">{question}</span>
        <FiChevronDown className={`w-5 h-5 text-stone-400 transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-5 pb-5 pt-1 text-sm text-stone-500 leading-relaxed border-t border-stone-100 bg-stone-50/30">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
