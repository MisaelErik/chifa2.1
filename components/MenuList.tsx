
import React from 'react';
import { Dish, OrderItem } from '../types';
import MenuItem from './MenuItem';

interface MenuListProps {
  menu: Dish[];
  onDishSelect: (dish: Dish) => void;
  currentOrder: OrderItem[];
}

const MenuList: React.FC<MenuListProps> = ({ menu, onDishSelect, currentOrder }) => {
  const categories = [...new Set(menu.map(dish => dish.category))].sort((a, b) => {
    const aIsCombo = a.toLowerCase().includes('combos');
    const bIsCombo = b.toLowerCase().includes('combos');
    if (aIsCombo === bIsCombo) return 0; // Keep original relative order for same types
    return aIsCombo ? 1 : -1; // Non-combos first
  });
  
  const addedDishCounts = currentOrder.reduce((acc, item) => {
    acc[item.code] = (acc[item.code] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {categories.map(category => {
        const dishesInCategory = menu.filter(dish => dish.category === category);
        return (
          <div key={category}>
            <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b-2 border-red-200 pb-2">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishesInCategory.map(dish => (
                <MenuItem 
                  key={dish.code} 
                  dish={dish} 
                  onSelect={onDishSelect}
                  addedCount={addedDishCounts[dish.code] || 0}
                />
              ))}
            </div>
          </div>
        );
      })}
       {menu.length === 0 && (
         <p className="text-slate-500 text-center col-span-full py-10">No se encontraron platos con ese nombre o código.</p>
       )}
    </div>
  );
};

export default MenuList;