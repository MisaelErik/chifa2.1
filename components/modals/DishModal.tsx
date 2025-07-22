
import React, { useState, useEffect, useRef } from 'react';
import { Dish } from '../../types';
import { PlusCircleIcon } from '../icons';

interface DishModalProps {
  isOpen: boolean;
  dish: Dish | null;
  onClose: () => void;
  onAdd: (dish: Dish, modification: string, quantity: number) => void;
}

const DishModal: React.FC<DishModalProps> = ({ isOpen, dish, onClose, onAdd }) => {
  const [modification, setModification] = useState('');
  const [quantity, setQuantity] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setModification('');
      setQuantity(1);
    }
  }, [isOpen]);

  if (!isOpen || !dish) return null;

  const handleAddClick = () => {
    onAdd(dish, modification, quantity);
  };

  const handleTextareaFocus = () => {
    // A slight delay to allow the keyboard to animate in and viewport to resize
    setTimeout(() => {
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center p-4 pt-12 sm:pt-20 overflow-y-auto z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all mb-10" onClick={e => e.stopPropagation()}>
        <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">{dish.name}</h3>
            <p className="text-lg text-red-600 font-semibold mb-4">S/ {dish.price.toFixed(2)}</p>
        </div>
        
        {/* Dish Details Section */}
        {(dish.description || (dish.ingredients && dish.ingredients.length > 0)) && (
          <div className="my-5 py-4 border-y border-slate-200 text-left">
            {dish.description && (
              <div className="mb-4">
                <h4 className="font-bold text-base text-slate-800 mb-1">Descripción</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{dish.description}</p>
              </div>
            )}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div>
                <h4 className="font-bold text-base text-slate-800 mb-2">Ingredientes</h4>
                <div className="flex flex-wrap gap-2">
                  {dish.ingredients.map((ing, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full">{ing}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-center gap-4 my-6">
            <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-12 h-12 bg-slate-200 text-slate-800 font-bold text-2xl rounded-full hover:bg-slate-300 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
                aria-label="Disminuir cantidad"
            >
                -
            </button>
            <span className="text-3xl font-bold text-slate-900 w-16 text-center">{quantity}</span>
            <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-12 h-12 bg-slate-200 text-slate-800 font-bold text-2xl rounded-full hover:bg-slate-300 transition-colors"
                aria-label="Aumentar cantidad"
            >
                +
            </button>
        </div>

        <textarea
          ref={textareaRef}
          onFocus={handleTextareaFocus}
          id="dishModification"
          value={modification}
          onChange={(e) => setModification(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-md mb-4 focus:ring-red-500 focus:border-red-500"
          placeholder="Añadir modificaciones (ej: sin ají, con más verdura...)"
          rows={3}
        ></textarea>
        <div className="flex justify-around gap-4">
          <button onClick={onClose} className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors">
            Cancelar
          </button>
          <button onClick={handleAddClick} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
            <PlusCircleIcon className="w-6 h-6 mr-2" />
            Añadir al Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishModal;