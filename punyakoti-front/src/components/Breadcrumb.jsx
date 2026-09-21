import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex px-1 py-3 text-stone-500 text-xs md:text-sm" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-primary transition-colors font-medium"
          >
            <FiHome className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              <FiChevronRight className="w-4 h-4 text-stone-300 mx-1 shrink-0" />
              {isLast ? (
                <span className="font-semibold text-stone-850 truncate max-w-[150px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-stone-500 hover:text-primary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
