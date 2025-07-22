
import React, { useState, useRef, useEffect } from 'react';
import { Dish, OrderItem } from '../types';

import SearchInput from '../components/SearchInput';
import MenuList from '../components/MenuList';
import CurrentOrder from '../components/CurrentOrder';
import OrderSummaryBar from '../components/OrderSummaryBar';

interface MenuPageProps {
    menu: Dish[];
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearSearch: () => void;
    onDishSelect: (dish: Dish) => void;
    currentOrder: OrderItem[];
    tableName: string;
    onTableNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    orderRequests: string;
    onOrderRequestsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onRemoveItem: (id: string) => void;
    onSaveOrder: () => void;
    isEditing: boolean;
    editingTableName: string | null;
}

const MenuPage: React.FC<MenuPageProps> = (props) => {
    const [isOrderPanelVisible, setIsOrderPanelVisible] = useState(false);
    const orderPanelRef = useRef<HTMLDivElement>(null);

    const handleSummaryBarClick = () => {
        orderPanelRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Set state to true if the panel is intersecting (visible)
                setIsOrderPanelVisible(entry.isIntersecting);
            },
            {
                root: null, // observe intersections in the viewport
                threshold: 0.1, // trigger when 10% of the panel is visible
            }
        );

        const currentRef = orderPanelRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 relative">
            {/* Left Column: Menu */}
            <div className="lg:col-span-2">
                <div className="sticky top-24 z-20 mb-6">
                    <SearchInput 
                        value={props.searchQuery} 
                        onChange={props.onSearchChange} 
                        onClear={props.onClearSearch}
                    />
                </div>
                {/* Add padding-bottom to prevent the summary bar from overlapping last item */}
                <div className="h-full pr-2 lg:max-h-[75vh] lg:overflow-y-auto pb-24 lg:pb-0">
                    <MenuList 
                        menu={props.menu} 
                        onDishSelect={props.onDishSelect}
                        currentOrder={props.currentOrder}
                    />
                </div>
            </div>

            {/* Right Column: Order Panel */}
            {/* This panel is sticky on desktop, and at the bottom on mobile */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
                 <div className="lg:sticky lg:top-24" id="current-order-panel" ref={orderPanelRef}>
                    <CurrentOrder
                        key={props.editingTableName || 'new-order'}
                        currentOrder={props.currentOrder}
                        tableName={props.tableName}
                        onTableNameChange={props.onTableNameChange}
                        orderRequests={props.orderRequests}
                        onOrderRequestsChange={props.onOrderRequestsChange}
                        onRemoveItem={props.onRemoveItem}
                        onSaveOrder={props.onSaveOrder}
                        isEditing={props.isEditing}
                    />
                 </div>
            </div>

            {/* Floating Bar for Mobile - Only show when the order panel is NOT visible */}
            {!isOrderPanelVisible && (
                <OrderSummaryBar
                    currentOrder={props.currentOrder}
                    onClick={handleSummaryBarClick}
                />
            )}
        </div>
    );
};

export default MenuPage;