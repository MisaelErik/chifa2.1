
import React from 'react';
import { OrderItem } from '../../types';
import { PrintIcon } from '../icons';

interface TicketModalProps {
  isOpen: boolean;
  tableName: string | null;
  order: OrderItem[];
  requests?: string;
  onClose: () => void;
}

const TicketPrintable: React.FC<{ tableName: string, order: OrderItem[], total: number, requests?: string }> = ({ tableName, order, total, requests }) => (
    <div className="font-sans p-5">
        <h2 className="text-center text-2xl font-bold mb-4">Chifa Brillo El Sol</h2>
        <h3 className="text-center text-xl font-semibold mb-6">Mesa: {tableName}</h3>
        <div className="border-t-2 border-b-2 border-dashed border-black py-4 space-y-2">
            {order.map(item => (
                <div key={item.id}>
                    <div className="flex justify-between text-base">
                        <span>{item.name}</span>
                        <span>S/{item.price.toFixed(2)}</span>
                    </div>
                    {item.modification && (
                        <p className="text-sm text-gray-700 pl-2">
                            &nbsp;&nbsp;↳ Mod: <i>{item.modification}</i>
                        </p>
                    )}
                </div>
            ))}
        </div>
        {requests && (
            <div className="border-b-2 border-dashed border-black py-2">
                <h4 className="font-semibold text-base">Peticiones Especiales:</h4>
                <p className="text-base pl-2 whitespace-pre-wrap"><i>{requests}</i></p>
            </div>
        )}
        <h3 className="text-right text-xl font-bold mt-4">Total: S/ {total.toFixed(2)}</h3>
        <p className="text-center mt-8 text-sm">¡Gracias por su preferencia!</p>
    </div>
);

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, tableName, order, requests, onClose }) => {
  if (!isOpen || !tableName) return null;

  const totalPrice = order.reduce((sum, item) => sum + item.price, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-3xl font-bold mb-4 text-slate-800 text-center border-b pb-3">Mesa: {tableName}</h3>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto my-4 pr-2">
                    {order.map(item => (
                        <div key={item.id} className="bg-slate-50 p-3 rounded-md">
                            <div className="flex justify-between font-semibold text-slate-700">
                                <span>({item.code}) {item.name}</span>
                                <span>S/ {item.price.toFixed(2)}</span>
                            </div>
                            {item.modification && (
                                <p className="text-sm text-blue-600 pl-2 italic">
                                    ↳ Mod: {item.modification}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
                {requests && (
                  <div className="my-3 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                      <p className="font-semibold text-indigo-800">Peticiones Especiales:</p>
                      <p className="text-sm text-indigo-700 italic whitespace-pre-wrap">{requests}</p>
                  </div>
                )}
                <div className="text-right font-bold text-2xl border-t-2 border-dashed border-slate-200 pt-3">
                    Total: <span className="text-red-700">S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onClose} className="bg-slate-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-600 transition-colors">
                        Cerrar
                    </button>
                    <button onClick={handlePrint} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <PrintIcon className="w-5 h-5" /> Imprimir
                    </button>
                </div>
            </div>
        </div>
        <div id="printable-ticket" className="hidden">
            <TicketPrintable tableName={tableName} order={order} total={totalPrice} requests={requests} />
        </div>
    </>
  );
};

export default TicketModal;