
import React from 'react';
import { Dish } from '../types';

interface MenuItemProps {
  dish: Dish;
  onSelect: (dish: Dish) => void;
  addedCount: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ dish, onSelect, addedCount }) => {
  const isAdded = addedCount > 0;
  const isCombo = dish.items && dish.items.length > 0;

  return (
    <div
      onClick={() => onSelect(dish)}
      className={`relative bg-white p-4 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${isAdded ? 'ring-2 ring-green-500' : 'ring-1 ring-transparent'}`}
    >
      {isAdded && (
        <div className="absolute top-1.5 right-1.5 bg-green-500 text-white h-6 w-6 flex items-center justify-center rounded-full text-sm font-bold shadow-md z-10">
          {addedCount}
        </div>
      )}
      <div>
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-base text-slate-800 pr-8">
            {isCombo && <span className="text-red-700 font-extrabold">COMBO </span>}
            {dish.name}
          </h4>
          <span className="font-semibold text-red-600 whitespace-nowrap">S/ {dish.price.toFixed(2)}</span>
        </div>
        {isCombo && (
          <ul className="list-disc list-inside text-slate-600 text-sm mt-2 space-y-1">
            {dish.items?.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <p className="text-slate-500 text-sm">Código: {dish.code}</p>
      </div>
    </div>
  );
};

export default MenuItem;