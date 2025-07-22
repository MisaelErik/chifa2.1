
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-6 md:py-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-red-700 tracking-tight">
        Chifa Brillo El Sol
      </h1>
      <p className="text-lg md:text-xl text-slate-600 mt-2">
        Sistema de Pedidos para Mozos
      </p>
    </header>
  );
};

export default Header;
