
import React from 'react';
import { TrashIcon } from '../icons';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, confirmText, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-around gap-4">
          <button onClick={onClose} className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-slate-300 transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
            <TrashIcon className="w-5 h-5 mr-2" />
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
