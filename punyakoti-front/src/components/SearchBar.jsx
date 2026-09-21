import React from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
        <FiSearch className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-11 pr-4 py-2.5 bg-white border border-stone-250 rounded-2xl text-sm placeholder-stone-400 text-stone-750 focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-xs"
      />
    </div>
  );
};

export default SearchBar;
