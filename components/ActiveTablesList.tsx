
import React from 'react';
import { ActiveTables } from '../types';
import { ReceiptIcon, PencilIcon, XCircleIcon } from './icons';

interface ActiveTablesProps {
  activeTables: ActiveTables;
  onViewTable: (tableName: string) => void;
  onEditTable: (tableName: string) => void;
  onDeleteTable: (tableName: string) => void;
}

const ActiveTablesList: React.FC<ActiveTablesProps> = ({ activeTables, onViewTable, onEditTable, onDeleteTable }) => {
  const tableNames = Object.keys(activeTables);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-slate-800 border-b-2 border-red-600 pb-2">Mesas Activas</h2>
      <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
        {tableNames.length === 0 ? (
          <p className="text-slate-500 py-8 text-center">No hay mesas activas.</p>
        ) : (
          tableNames.map(tableName => (
            <div key={tableName} className="bg-blue-50 p-3 rounded-lg flex justify-between items-center shadow-sm">
              <button onClick={() => onViewTable(tableName)} className="flex-grow text-left flex items-center gap-3">
                <ReceiptIcon className="w-6 h-6 text-blue-700" />
                <span className="font-bold text-blue-800">{tableName}</span>
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => onEditTable(tableName)} className="p-2 text-slate-600 hover:text-blue-700 rounded-full hover:bg-blue-100 transition-colors">
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button onClick={() => onDeleteTable(tableName)} className="p-2 text-slate-600 hover:text-red-700 rounded-full hover:bg-red-100 transition-colors">
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveTablesList;
