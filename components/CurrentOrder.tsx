import React, { useState } from 'react';
import { OrderItem } from '../types';
import { TrashIcon, CheckCircleIcon } from './icons';

interface CurrentOrderProps {
  currentOrder: OrderItem[];
  tableName: string;
  orderRequests: string;
  onTableNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOrderRequestsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onRemoveItem: (id: string) => void;
  onSaveOrder: () => void;
  isEditing: boolean;
}

const CurrentOrder: React.FC<CurrentOrderProps> = ({ currentOrder, tableName, orderRequests, onTableNameChange, onOrderRequestsChange, onRemoveItem, onSaveOrder, isEditing }) => {
  const totalPrice = currentOrder.reduce((sum, item) => sum + item.price, 0);
  const isOrderEmpty = currentOrder.length === 0;
  const [isRequestsVisible, setIsRequestsVisible] = useState(!!orderRequests);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent default form submission
      if (!isOrderEmpty && tableName.trim()) {
        onSaveOrder();
      }
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 border-b-2 border-red-600 pb-2">
        {isEditing ? `Editando Mesa` : 'Nuevo Pedido'}
      </h2>
      
      {isOrderEmpty ? (
        <p className="text-slate-500 py-8 text-center">Selecciona platos del menú para empezar.</p>
      ) : (
        <>
          <div className="space-y-3 my-4 max-h-60 overflow-y-auto pr-2">
            {currentOrder.map((item) => {
              // Combo rendering with details
              if (item.items && item.items.length > 0) {
                return (
                  <div key={item.id} className="bg-slate-100 p-3 rounded-lg animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                          <p className="font-semibold text-slate-800">
                              <span className="font-bold text-red-700">COMBO</span> {item.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Código: {item.code}</p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <span className="font-bold text-slate-800 whitespace-nowrap">S/ {item.price.toFixed(2)}</span>
                        <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-sm text-slate-600 border-t border-slate-200 pt-2">
                        {item.items.map((comboPart, index) => (
                            <li key={index}>{comboPart}</li>
                        ))}
                    </ul>
                    {item.modification && <p className="text-sm text-blue-600 italic mt-2">↳ Mod: {item.modification}</p>}
                  </div>
                );
              }

              // Regular item rendering
              return (
                <div key={item.id} className="bg-slate-100 p-3 rounded-lg flex justify-between items-center animate-fade-in">
                  <div>
                    <p className="font-semibold text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Código: {item.code}</p>
                     {item.modification && <p className="text-sm text-blue-600 italic mt-1">Mod: {item.modification}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800">S/ {item.price.toFixed(2)}</span>
                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Special Requests Section */}
          <div className="mt-4">
            {isRequestsVisible ? (
              <div>
                <label htmlFor="orderRequests" className="block text-sm font-medium text-slate-700 mb-1">
                  Peticiones Especiales (opcional)
                </label>
                <textarea
                  id="orderRequests"
                  value={orderRequests}
                  onChange={onOrderRequestsChange}
                  className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder="Ej: todo para llevar, traer cubiertos extra..."
                  rows={2}
                  autoFocus
                ></textarea>
              </div>
            ) : (
              <button
                onClick={() => setIsRequestsVisible(true)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors p-2 -m-2 rounded"
                aria-label="Añadir petición especial a la orden"
              >
                + Añadir petición especial
              </button>
            )}
          </div>


          <div className="text-right font-bold text-2xl mt-4 pt-4 border-t-2 border-dashed border-slate-200">
            Total: <span className="text-red-700">S/ {totalPrice.toFixed(2)}</span>
          </div>
        </>
      )}

      <div className="mt-6">
        <label htmlFor="tableNameInput" className="block text-sm font-medium text-slate-700 mb-1">
          {isEditing ? 'Editando' : 'Asignar a'}
        </label>
        <div className="flex items-center gap-2">
          <span className={`font-semibold p-3 rounded-md border border-r-0 rounded-r-none ${isEditing ? 'bg-slate-200 text-slate-600 border-slate-300' : 'bg-slate-100 text-slate-500 border-slate-300'}`}>
              Mesa
          </span>
          <input
            type="text"
            id="tableNameInput"
            inputMode="numeric"
            value={tableName}
            onChange={onTableNameChange}
            onKeyDown={handleKeyDown}
            className="flex-grow w-full p-3 border border-slate-300 rounded-md rounded-l-none shadow-sm focus:ring-red-500 focus:border-red-500 disabled:bg-slate-200 disabled:text-slate-500"
            placeholder={isEditing ? '' : '5 ó Familia Pérez'}
            disabled={isEditing}
          />
        </div>
        <button
          onClick={onSaveOrder}
          disabled={isOrderEmpty || !tableName.trim()}
          className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 mt-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 shadow-md disabled:shadow-none disabled:scale-100"
        >
          <CheckCircleIcon className="w-6 h-6 mr-2" />
          {isEditing ? 'Actualizar Pedido' : 'Guardar Pedido'}
        </button>
      </div>
    </div>
  );
};

export default CurrentOrder;