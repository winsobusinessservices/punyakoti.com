import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

const QuantitySelector = ({ value, onChange, max = 99 }) => {
  const handleDecrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center border border-stone-200 bg-stone-50 rounded-xl overflow-hidden shadow-xs h-10">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={value <= 1}
        className="px-3 text-stone-500 hover:bg-stone-200/60 hover:text-stone-700 disabled:opacity-40 disabled:hover:bg-transparent h-full transition-all flex items-center justify-center focus:outline-hidden"
        aria-label="Decrease quantity"
      >
        <FiMinus className="w-4 h-4" />
      </button>
      
      <span className="w-10 text-center font-semibold text-stone-700 select-none text-sm">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={value >= max}
        className="px-3 text-stone-500 hover:bg-stone-200/60 hover:text-stone-700 disabled:opacity-40 disabled:hover:bg-transparent h-full transition-all flex items-center justify-center focus:outline-hidden"
        aria-label="Increase quantity"
      >
        <FiPlus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
