
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  path: string;
}

export const Breadcrumbs: React.FC<{ items: Crumb[] }> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home size={16} />
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={14} className="flex-shrink-0 text-gray-300" />
          <Link 
            to={item.path} 
            className={`hover:text-blue-600 transition-colors ${idx === items.length - 1 ? 'font-bold text-gray-900 pointer-events-none' : ''}`}
          >
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};
