
import React, { useState } from 'react';
import { ActiveTables, TableData, HistoricOrder } from '../types';
import { PencilIcon, TrashIcon, PlusCircleIcon, ChevronDownIcon } from '../components/icons';

interface TableCardProps {
    tableName: string;
    tableData: TableData;
    onEdit: (tableName: string) => void;
    onDelete: (tableName: string) => void;
}

const TableCard: React.FC<TableCardProps> = ({ tableName, tableData, onEdit, onDelete }) => {
    const { order, createdAt, requests } = tableData;
    const total = order.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between transition-shadow hover:shadow-xl animate-fade-in">
            <div>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-2xl font-bold text-slate-800 truncate">{tableName}</h3>
                    <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">
                        {createdAt}
                    </span>
                </div>
                 <p className="text-3xl font-extrabold text-red-600 mt-1">
                    S/ {total.toFixed(2)}
                </p>
                
                <div className="my-4 max-h-48 overflow-y-auto space-y-3 border-t border-b border-slate-200 py-3 pr-2">
                    {order.map(item => {
                        if (item.items && item.items.length > 0) {
                            return (
                                <div key={item.id} className="bg-slate-100 p-3 rounded-lg">
                                    <div className="flex justify-between items-start text-sm gap-2">
                                        <p className="font-semibold text-slate-800 flex-1">
                                            <span className="font-bold text-red-700">COMBO</span> {item.name}
                                        </p>
                                        <p className="font-bold text-slate-900 whitespace-nowrap">S/ {item.price.toFixed(2)}</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Código: {item.code}</p>
                                    <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-xs text-slate-600 border-t border-slate-200 pt-2">
                                        {item.items.map((comboPart, index) => (
                                            <li key={index}>{comboPart}</li>
                                        ))}
                                    </ul>
                                    {item.modification && (
                                        <p className="text-xs text-blue-600 italic mt-2">↳ Mod: {item.modification}</p>
                                    )}
                                </div>
                            );
                        }
                        return (
                            <div key={item.id}>
                                <div className="flex justify-between items-start text-sm gap-2">
                                    <p className="font-semibold text-slate-700 flex-1">{item.name}</p>
                                    <p className="font-bold text-slate-800 whitespace-nowrap">S/ {item.price.toFixed(2)}</p>
                                </div>
                                <p className="text-xs text-slate-500">Código: {item.code}</p>
                                {item.modification && (
                                    <p className="text-xs text-blue-600 italic ml-2">↳ Mod: {item.modification}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
                {requests && (
                    <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <p className="text-sm font-semibold text-indigo-800">Peticiones Especiales:</p>
                        <p className="text-sm text-indigo-700 italic whitespace-pre-wrap">{requests}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 mt-auto pt-2">
                <button
                    onClick={() => onDelete(tableName)}
                    className="p-3 text-sm flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors"
                    aria-label={`Cerrar y mover al historial la mesa ${tableName}`}
                >
                    <TrashIcon className="w-5 h-5" /> <span className="hidden sm:inline">Cerrar</span>
                </button>
                <button
                    onClick={() => onEdit(tableName)}
                    className="p-3 text-sm flex items-center gap-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label={`Editar mesa ${tableName}`}
                >
                    <PencilIcon className="w-5 h-5" /> <span className="hidden sm:inline">Editar</span>
                </button>
            </div>
        </div>
    );
};

const HistoricOrderCard: React.FC<{ order: HistoricOrder }> = ({ order }) => {
    const { tableName, order: items, completedAt } = order;
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const completionDate = new Date(completedAt);
    const formattedCompletionTime = completionDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const formattedCompletionDate = completionDate.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col transition-shadow hover:shadow-lg animate-fade-in">
            <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-bold text-slate-700 text-lg">{tableName}</h4>
                <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-slate-600 text-sm">{formattedCompletionDate}</p>
                    <p className="text-xs text-slate-500">{formattedCompletionTime}</p>
                </div>
            </div>
            <p className="font-bold text-2xl text-slate-800 mb-3">
                S/ {total.toFixed(2)}
            </p>
            <details className="text-sm mt-auto">
                <summary className="cursor-pointer text-blue-600 hover:underline font-medium">Ver detalles</summary>
                <div className="mt-2 space-y-1 border-t pt-2 max-h-32 overflow-y-auto pr-2">
                     {items.map(item => (
                        <div key={item.id} className="flex justify-between text-xs">
                            <span className="text-slate-600 mr-2 flex-1">{item.name}</span>
                            <span className="font-medium text-slate-700 whitespace-nowrap">S/ {item.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </details>
        </div>
    );
}

interface OrderHistoryProps {
    history: HistoricOrder[];
    onClearHistory: () => void;
    isHistoryVisible: boolean;
    toggleVisibility: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ history, onClearHistory, isHistoryVisible, toggleVisibility }) => {
    return (
        <div className="mt-16">
             <div className="bg-white rounded-2xl shadow-lg p-5 transition-shadow hover:shadow-xl">
                <header 
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={toggleVisibility}
                    aria-expanded={isHistoryVisible}
                    aria-controls="history-panel"
                >
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-slate-900">Historial de Mesas</h2>
                        <ChevronDownIcon className={`w-7 h-7 text-slate-500 transition-transform duration-300 ${isHistoryVisible ? 'rotate-180' : ''}`} />
                    </div>
                    {history.length > 0 && isHistoryVisible && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onClearHistory(); }}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors text-sm"
                          aria-label="Limpiar todo el historial de pedidos"
                        >
                            <TrashIcon className="w-5 h-5" />
                            <span className="hidden sm:inline">Limpiar Historial</span>
                        </button>
                    )}
                </header>

                <div 
                    id="history-panel"
                    className={`grid transition-all duration-500 ease-in-out ${isHistoryVisible ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                        {history.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-slate-500 text-lg">No hay pedidos en el historial.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-1">
                                {history.map((order) => (
                                    <HistoricOrderCard key={order.tableName + order.completedAt} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DashboardPageProps {
    activeTables: ActiveTables;
    orderHistory: HistoricOrder[];
    onEditTable: (tableName: string) => void;
    onDeleteTable: (tableName: string) => void;
    onClearHistory: () => void;
    onNewOrder: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ activeTables, orderHistory, onEditTable, onDeleteTable, onClearHistory, onNewOrder }) => {
    const tableNames = Object.keys(activeTables);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 px-1">
                <h2 className="text-3xl font-bold text-slate-900">Mesas Activas</h2>
                <button 
                  onClick={onNewOrder}
                  className="hidden md:flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg"
                >
                    <PlusCircleIcon className="w-6 h-6" />
                    Crear Nuevo Pedido
                </button>
            </div>
            {tableNames.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-semibold text-slate-700">No hay mesas activas</h3>
                    <p className="text-slate-500 mt-2">Crea un nuevo pedido para empezar.</p>
                    <button 
                        onClick={onNewOrder}
                        className="mt-6 flex mx-auto items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg"
                    >
                        <PlusCircleIcon className="w-6 h-6" />
                        Crear Pedido
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Object.entries(activeTables).map(([name, tableData]) => (
                        <TableCard
                            key={name}
                            tableName={name}
                            tableData={tableData}
                            onEdit={onEditTable}
                            onDelete={onDeleteTable}
                        />
                    ))}
                </div>
            )}

            <OrderHistory 
                history={orderHistory} 
                onClearHistory={onClearHistory} 
                isHistoryVisible={isHistoryVisible}
                toggleVisibility={() => setIsHistoryVisible(prev => !prev)}
            />
        </div>
    );
};

export default DashboardPage;