
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Dish, OrderItem, ActiveTables, ConfirmAction, TableData, HistoricOrder } from './types';
import { menuData } from './constants';

import Header from './components/Header';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import MenuPage from './pages/MenuPage';
import DishModal from './components/modals/DishModal';
import ConfirmModal from './components/modals/ConfirmModal';
import MergeConfirmModal from './components/modals/MergeConfirmModal';
import Toast from './components/Toast';

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function App() {
  // Global State - Initialize from localStorage
  const [activeTables, setActiveTables] = useState<ActiveTables>(() => {
    try {
      const savedTables = localStorage.getItem('activeTables');
      if (savedTables) {
        const parsed = JSON.parse(savedTables);
        if (typeof parsed === 'object' && parsed !== null) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load tables from localStorage:", error);
    }
    return {};
  });

  const [orderHistory, setOrderHistory] = useState<HistoricOrder[]>(() => {
    try {
      const savedHistory = localStorage.getItem('orderHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      return [];
    }
  });

  // Initialize draft order state from localStorage
  const initialDraft = useMemo(() => {
    try {
      const savedDraft = localStorage.getItem('draftOrder');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.order)) {
          return {
            order: parsed.order as OrderItem[],
            tableName: parsed.tableName || '',
            requests: parsed.requests || '',
            isEditing: parsed.isEditing || false,
            editingTableName: parsed.editingTableName || null,
          };
        }
      }
    } catch (error) {
      console.error("Failed to load draft order from localStorage:", error);
    }
    return {
      order: [],
      tableName: '',
      requests: '',
      isEditing: false,
      editingTableName: null,
    };
  }, []);
  
  // View/Navigation State
  const [view, setView] = useState<'dashboard' | 'menu'>('menu');
  
  // Order Creation/Editing State - Initialized from draft
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>(initialDraft.order);
  const [tableNameInput, setTableNameInput] = useState(initialDraft.tableName);
  const [orderRequests, setOrderRequests] = useState(initialDraft.requests);
  const [isEditing, setIsEditing] = useState(initialDraft.isEditing);
  const [editingTableName, setEditingTableName] = useState<string | null>(initialDraft.editingTableName);

  // Menu Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal & Toast States
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toastInfo, setToastInfo] = useState<{ message: string; key: number } | null>(null);
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    action: ConfirmAction | null;
    tableName: string | null;
    onConfirm: (() => void) | null;
  }>({ isOpen: false, action: null, tableName: null, onConfirm: null });
  const [mergeModalInfo, setMergeModalInfo] = useState<{
    isOpen: boolean;
    tableName: string | null;
  }>({ isOpen: false, tableName: null });

  // Persist draft order to localStorage
  useEffect(() => {
    const draft = {
      order: currentOrder,
      tableName: tableNameInput,
      requests: orderRequests,
      isEditing: isEditing,
      editingTableName: editingTableName,
    };
    if (currentOrder.length > 0 || tableNameInput || orderRequests) {
      localStorage.setItem('draftOrder', JSON.stringify(draft));
    } else {
      localStorage.removeItem('draftOrder');
    }
  }, [currentOrder, tableNameInput, orderRequests, isEditing, editingTableName]);

  // Persist tables and history to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('activeTables', JSON.stringify(activeTables));
    } catch (error) {
      console.error("Failed to save tables to localStorage:", error);
    }
  }, [activeTables]);

  useEffect(() => {
    try {
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    } catch (error) {
        console.error("Failed to save history to localStorage:", error);
    }
  }, [orderHistory]);

  // Derived State
  const filteredMenu = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return menuData;

    const normalizedQuery = removeAccents(query);

    return menuData.filter(dish => {
        const normalizedDishName = removeAccents(dish.name.toLowerCase());
        const dishCode = dish.code.toLowerCase();
        
        if (dishCode.includes(query)) {
            return true;
        }

        if (normalizedDishName.includes(normalizedQuery)) {
            return true;
        }

        if (dish.keywords?.some(keyword => removeAccents(keyword.toLowerCase()).includes(normalizedQuery))) {
            return true;
        }
        
        if (dish.items?.some(item => removeAccents(item.toLowerCase()).includes(normalizedQuery))) {
            return true;
        }
        
        return false;
    });
  }, [searchQuery]);
  
  const resetOrderState = useCallback(() => {
    setCurrentOrder([]);
    setTableNameInput('');
    setOrderRequests('');
    setIsEditing(false);
    setEditingTableName(null);
    setSearchQuery('');
    // Explicitly remove the draft from localStorage
    localStorage.removeItem('draftOrder');
  }, []);

  // -- Navigation Handlers --
  const navigateTo = useCallback((targetView: 'dashboard' | 'menu') => {
    if (view === 'menu' && currentOrder.length > 0 && !isEditing) {
        setConfirmModalState({
            isOpen: true,
            action: ConfirmAction.OVERWRITE_ORDER,
            tableName: null,
            onConfirm: () => {
                resetOrderState();
                setView(targetView);
            }
        });
    } else {
        if (targetView === 'menu' && !isEditing) {
            resetOrderState();
        }
        setView(targetView);
    }
  }, [view, currentOrder.length, resetOrderState, isEditing]);

  // -- Order Management Handlers --
  const handleSaveOrder = useCallback(() => {
    if (currentOrder.length === 0 || !tableNameInput.trim()) return;

    const requests = orderRequests.trim() || undefined;

    if (isEditing && editingTableName) {
        const tableDataToUpdate = activeTables[editingTableName];
        if (!tableDataToUpdate) {
            resetOrderState();
            setView('dashboard');
            return;
        }
        const updatedTableData: TableData = {
            ...tableDataToUpdate,
            order: currentOrder,
            requests: requests,
        };
        setActiveTables(prev => ({
            ...prev,
            [editingTableName]: updatedTableData,
        }));
        setToastInfo({ message: `Mesa "${editingTableName}" actualizada`, key: Date.now() });
        resetOrderState();
        setView('dashboard');
    } else {
        let finalTableName = tableNameInput.trim();
        if (!isNaN(parseInt(finalTableName, 10)) && !/mesa/i.test(finalTableName)) {
            finalTableName = `Mesa ${finalTableName}`;
        }
        if (activeTables[finalTableName]) {
            setMergeModalInfo({ isOpen: true, tableName: finalTableName });
        } else {
            const newTableData: TableData = {
                order: currentOrder,
                createdAt: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
                requests: requests,
            };
            setActiveTables(prev => ({ ...prev, [finalTableName]: newTableData }));
            setToastInfo({ message: `Pedido para "${finalTableName}" guardado`, key: Date.now() });
            resetOrderState();
            setView('dashboard');
        }
    }
  }, [currentOrder, tableNameInput, orderRequests, activeTables, resetOrderState, isEditing, editingTableName]);

  const handleMergeOrder = useCallback(() => {
    const tableName = mergeModalInfo.tableName;
    if (!tableName) return;

    const existingTable = activeTables[tableName];
    const mergedOrder = [...existingTable.order, ...currentOrder];
    const newRequests = orderRequests.trim();
    const mergedRequests = [existingTable.requests, newRequests].filter(Boolean).join('; ');

    setActiveTables(prev => ({
      ...prev,
      [tableName]: { 
        ...existingTable,
        order: mergedOrder,
        requests: mergedRequests || undefined,
      }
    }));
    
    setToastInfo({ message: `Pedido actualizado para "${tableName}"`, key: Date.now() });
    setMergeModalInfo({ isOpen: false, tableName: null });
    resetOrderState();
    setView('dashboard');
  }, [activeTables, currentOrder, orderRequests, mergeModalInfo.tableName, resetOrderState]);

  const handleReplaceOrder = useCallback(() => {
    const tableName = mergeModalInfo.tableName;
    if (!tableName) return;

    // Move the old order to history before replacing it
    const oldTableData = activeTables[tableName];
    if (oldTableData) {
        const historicEntry: HistoricOrder = {
            ...oldTableData,
            tableName: tableName,
            completedAt: new Date().toISOString(),
        };
        setOrderHistory(prev => [historicEntry, ...prev]);
    }

    const newTableData: TableData = {
      order: currentOrder,
      createdAt: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      requests: orderRequests.trim() || undefined
    };

    setActiveTables(prev => ({ ...prev, [tableName]: newTableData }));
    
    setToastInfo({ message: `Pedido para "${tableName}" reemplazado`, key: Date.now() });
    setMergeModalInfo({ isOpen: false, tableName: null });
    resetOrderState();
    setView('dashboard');
  }, [activeTables, currentOrder, orderRequests, mergeModalInfo.tableName, resetOrderState]);

  const handleEditTable = useCallback((tableName: string) => {
      const startEditing = () => {
          const tableToEdit = activeTables[tableName];
          const tableIdentifier = tableName.toLowerCase().startsWith('mesa ') 
              ? tableName.substring(5) 
              : tableName;

          setCurrentOrder([...tableToEdit.order]);
          setTableNameInput(tableIdentifier);
          setOrderRequests(tableToEdit.requests || '');
          setIsEditing(true);
          setEditingTableName(tableName);
          setView('menu');
      };

      if (currentOrder.length > 0 && !isEditing) {
          setConfirmModalState({
              isOpen: true,
              action: ConfirmAction.OVERWRITE_ORDER,
              tableName: tableName,
              onConfirm: startEditing
          });
      } else {
          startEditing();
      }
  }, [activeTables, currentOrder.length, isEditing]);
  
  const handleDeleteTable = useCallback((tableName: string) => {
    setConfirmModalState({
        isOpen: true,
        action: ConfirmAction.DELETE_TABLE,
        tableName: tableName,
        onConfirm: () => {
          const tableToMove = activeTables[tableName];
          if (tableToMove) {
              const historicEntry: HistoricOrder = {
                  ...tableToMove,
                  tableName: tableName,
                  completedAt: new Date().toISOString(),
              };
              
              setOrderHistory(prev => [historicEntry, ...prev]);

              setActiveTables(prev => {
                  const newTables = {...prev};
                  delete newTables[tableName];
                  return newTables;
              });

              setToastInfo({ message: `Mesa "${tableName}" movida al historial`, key: Date.now() });
          }
        }
    });
  }, [activeTables]);

  const handleClearHistory = useCallback(() => {
    setConfirmModalState({
        isOpen: true,
        action: ConfirmAction.CLEAR_HISTORY,
        tableName: null,
        onConfirm: () => {
            setOrderHistory([]);
            setToastInfo({ message: 'Historial de pedidos eliminado', key: Date.now() });
        }
    });
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // -- Menu & Item Handlers --
  const handleDishSelect = useCallback((dish: Dish) => {
    setSelectedDish(dish);
  }, []);

  const handleCloseDishModal = useCallback(() => {
    setSelectedDish(null);
  }, []);

  const handleAddToOrder = useCallback((dish: Dish, modification: string, quantity: number) => {
    const newItems: OrderItem[] = [];
    const modText = modification.trim() || undefined;
    for (let i = 0; i < quantity; i++) {
        const newOrderItem: OrderItem = {
          ...dish,
          id: `${dish.code}-${Date.now()}-${i}`,
          modification: modText
        };
        newItems.push(newOrderItem);
    }

    setCurrentOrder(prev => [...prev, ...newItems]);
    handleCloseDishModal();

    const toastMessage = quantity > 1
      ? `${quantity}x ${dish.name} agregados`
      : `${dish.name} agregado`;
    setToastInfo({ message: toastMessage, key: Date.now() });
  }, [handleCloseDishModal]);

  const handleRemoveFromOrder = useCallback((id: string) => {
    setCurrentOrder(prev => prev.filter(item => item.id !== id));
  }, []);

  // -- Modal Handlers --
  const handleConfirmAction = useCallback(() => {
    confirmModalState.onConfirm?.();
    handleCloseConfirmModal();
  }, [confirmModalState]);

  const handleCloseConfirmModal = useCallback(() => {
    setConfirmModalState({ isOpen: false, action: null, tableName: null, onConfirm: null });
  }, []);

  const getConfirmModalProps = () => {
      const { action, tableName } = confirmModalState;
      if (action === ConfirmAction.DELETE_TABLE) {
          return {
              title: "¿Cerrar Mesa?",
              message: `La mesa "${tableName}" se moverá al historial. ¿Estás seguro?`,
              confirmText: "Sí, Cerrar Mesa"
          };
      }
      if (action === ConfirmAction.OVERWRITE_ORDER) {
          return {
              title: "Descartar Cambios",
              message: "Tienes un pedido en curso sin guardar. ¿Estás seguro de que quieres descartarlo?",
              confirmText: "Sí, Descartar"
          };
      }
      if (action === ConfirmAction.CLEAR_HISTORY) {
        return {
            title: "¿Eliminar Historial?",
            message: "Se eliminarán permanentemente todos los registros del historial. Esta acción no se puede deshacer.",
            confirmText: "Sí, Eliminar Todo"
        };
      }
      return { title: "", message: "", confirmText: "" };
  };

  return (
    <div className="container mx-auto max-w-7xl p-2 sm:p-4">
      <Header />
      <Navbar currentView={view} onNavigate={navigateTo} />
      
      <main className="mt-6">
        {view === 'dashboard' && (
            <DashboardPage 
                activeTables={activeTables}
                orderHistory={orderHistory}
                onEditTable={handleEditTable}
                onDeleteTable={handleDeleteTable}
                onClearHistory={handleClearHistory}
                onNewOrder={() => navigateTo('menu')}
            />
        )}

        {view === 'menu' && (
            <MenuPage 
                menu={filteredMenu}
                searchQuery={searchQuery}
                onSearchChange={e => setSearchQuery(e.target.value)}
                onClearSearch={handleClearSearch}
                onDishSelect={handleDishSelect}
                currentOrder={currentOrder}
                tableName={tableNameInput}
                onTableNameChange={(e) => setTableNameInput(e.target.value)}
                orderRequests={orderRequests}
                onOrderRequestsChange={(e) => setOrderRequests(e.target.value)}
                onRemoveItem={handleRemoveFromOrder}
                onSaveOrder={handleSaveOrder}
                isEditing={isEditing}
                editingTableName={editingTableName}
            />
        )}
      </main>

      {/* Modals & Toasts */}
      {toastInfo && <Toast message={toastInfo.message} key={toastInfo.key} onClose={() => setToastInfo(null)} />}
      
      <DishModal 
        isOpen={!!selectedDish}
        dish={selectedDish}
        onClose={handleCloseDishModal}
        onAdd={handleAddToOrder}
      />
      
      <ConfirmModal 
        isOpen={confirmModalState.isOpen}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmAction}
        {...getConfirmModalProps()}
      />

      <MergeConfirmModal
        isOpen={mergeModalInfo.isOpen}
        tableName={mergeModalInfo.tableName || ''}
        onClose={() => setMergeModalInfo({ isOpen: false, tableName: null })}
        onMerge={handleMergeOrder}
        onReplace={handleReplaceOrder}
      />
    </div>
  );
}

export default App;
