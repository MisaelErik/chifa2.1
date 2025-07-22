import React from 'react';
import { HomeIcon, PlusCircleIcon } from './icons';

interface NavbarProps {
  currentView: 'dashboard' | 'menu';
  onNavigate: (view: 'dashboard' | 'menu') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const baseClasses = "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500";
  const activeClasses = "bg-red-600 text-white shadow-md";
  const inactiveClasses = "bg-white text-slate-600 hover:bg-red-50 hover:text-red-700";

  return (
    <nav className="bg-slate-100 p-2 rounded-xl shadow-sm sticky top-4 z-30">
      <div className="flex justify-center items-center gap-2">
        <button 
          onClick={() => onNavigate('dashboard')}
          className={`${baseClasses} ${currentView === 'dashboard' ? activeClasses : inactiveClasses}`}
          aria-current={currentView === 'dashboard' ? 'page' : undefined}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
        <button 
          onClick={() => onNavigate('menu')}
          className={`${baseClasses} ${currentView === 'menu' ? activeClasses : inactiveClasses}`}
          aria-current={currentView === 'menu' ? 'page' : undefined}
        >
          <PlusCircleIcon className="w-6 h-6" />
          <span className="hidden sm:inline">Crear/Editar Pedido</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
