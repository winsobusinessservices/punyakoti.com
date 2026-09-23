import React, { useState } from 'react';
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi';

const FAQAccordion = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left font-display font-medium focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span className={`text-base md:text-lg leading-snug transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
          {question}
        </span>
        {isOpen ? (
          <FiMinusCircle className="w-5 h-5 text-gray-500 shrink-0 ml-4" />
        ) : (
          <FiPlusCircle className="w-5 h-5 text-gray-500 shrink-0 ml-4 group-hover:text-primary transition-colors duration-300" />
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="text-sm md:text-base text-gray-500 leading-relaxed max-w-3xl">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
