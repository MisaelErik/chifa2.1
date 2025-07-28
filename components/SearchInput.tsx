import React from 'react';
import { SearchIcon, XCircleIcon } from './icons';

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Hide mobile keyboard on "Enter" or "Search" press
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        enterKeyHint="search"
        className="w-full p-4 pl-12 pr-12 text-lg text-slate-900 bg-white border-2 border-slate-200 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
        placeholder="Buscar por código o nombre del plato..."
      />
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
