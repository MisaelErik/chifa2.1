
import React, { useState } from 'react';
import { OrderItem, ActiveTables } from '../types';
import CurrentOrder from './CurrentOrder';
import ActiveTablesList from './ActiveTablesList';

interface OrderPanelProps {
    currentOrder: OrderItem[];
    activeTables: ActiveTables;
    tableName: string;
    orderRequests: string;
    onTableNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOrderRequestsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRemoveItem: (id: string) => void;
    onSaveOrder: () => void;
    onViewTable: (tableName: string) => void;
    onEditTable: (tableName: string) => void;
    onDeleteTable: (tableName: string) => void;
    isEditing: boolean;
}

const OrderPanel: React.FC<OrderPanelProps> = (props) => {
    const [activeTab, setActiveTab] = useState('order');

    return (
        <div className="w-full">
            {/* Tab view for mobile */}
            <div className="sm:hidden mb-4">
                <div className="flex border-b border-slate-200">
                    <button onClick={() => setActiveTab('order')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'order' ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-500'}`}>
                        Pedido Actual
                    </button>
                    <button onClick={() => setActiveTab('tables')} className={`flex-1 py-2 text-center font-semibold ${activeTab === 'tables' ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-500'}`}>
                        Mesas Activas
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                <div className={`${activeTab === 'order' ? 'block' : 'hidden'} sm:block`}>
                    <CurrentOrder 
                        currentOrder={props.currentOrder}
                        tableName={props.tableName}
                        onTableNameChange={props.onTableNameChange}
                        onRemoveItem={props.onRemoveItem}
                        onSaveOrder={props.onSaveOrder}
                        isEditing={props.isEditing}
                        orderRequests={props.orderRequests}
                        onOrderRequestsChange={props.onOrderRequestsChange}
                    />
                </div>
                <div className={`${activeTab === 'tables' ? 'block' : 'hidden'} sm:block`}>
                    <ActiveTablesList 
                      activeTables={props.activeTables}
                      onViewTable={props.onViewTable}
                      onEditTable={props.onEditTable}
                      onDeleteTable={props.onDeleteTable}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderPanel;