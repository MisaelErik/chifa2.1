
import React from 'react';
import { PlusCircleIcon, TrashIcon } from '../icons';

interface MergeConfirmModalProps {
  isOpen: boolean;
  tableName: string;
  onClose: () => void;
  onMerge: () => void;
  onReplace: () => void;
}

const MergeConfirmModal: React.FC<MergeConfirmModalProps> = ({ isOpen, tableName, onClose, onMerge, onReplace }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Mesa Existente</h3>
        <p className="text-slate-600 mb-6 text-lg">
          La mesa <span className="font-bold">"{tableName}"</span> ya tiene un pedido. ¿Qué deseas hacer?
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onMerge} 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-base"
          >
            <PlusCircleIcon className="w-6 h-6 mr-2" />
            Agregar al Pedido Existente
          </button>
          <button 
            onClick={onReplace} 
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center text-base"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Reemplazar Pedido
          </button>
          <button 
            onClick={onClose} 
            className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors mt-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeConfirmModal;
