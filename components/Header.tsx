
import React from 'react';
import { GavelIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <GavelIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Overturned</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
