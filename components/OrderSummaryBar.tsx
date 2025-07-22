import React from 'react';
import { OrderItem } from '../types';
import { CheckCircleIcon } from './icons';

interface OrderSummaryBarProps {
  currentOrder: OrderItem[];
  onClick: () => void;
}

const OrderSummaryBar: React.FC<OrderSummaryBarProps> = ({ currentOrder, onClick }) => {
  if (currentOrder.length === 0) {
    return null;
  }

  const totalItems = currentOrder.length;
  const totalPrice = currentOrder.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 lg:hidden animate-slide-up">
      <div className="container mx-auto max-w-7xl px-2">
        <button
          onClick={onClick}
          className="w-full flex items-center justify-between bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02] shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="bg-white text-green-700 h-7 w-7 flex items-center justify-center rounded-full text-sm font-bold">
              {totalItems}
            </span>
            <span className="text-lg">Ver Pedido</span>
          </div>
          <div className="flex items-center gap-2 text-lg">
            <span>S/ {totalPrice.toFixed(2)}</span>
            <CheckCircleIcon className="w-6 h-6" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryBar;
