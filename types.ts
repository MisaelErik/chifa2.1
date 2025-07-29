
export interface Dish {
  code: string;
  name: string;
  price: number;
  category: string;
  items?: string[]; // For combos, lists the individual dishes
  description?: string;
  ingredients?: string[];
  variations?: string[];
  keywords?: string[];
}

export interface OrderItem extends Dish {
  id: string; // Unique identifier for each item in an order
  modification?: string;
}

export interface TableData {
  order: OrderItem[];
  createdAt: string; // e.g., "14:30"
  requests?: string; // For special order-wide requests
}

export type ActiveTables = Record<string, TableData>;

export interface HistoricOrder extends TableData {
  tableName: string;
  completedAt: string; // ISO string for sorting
}

export enum ConfirmAction {
  DELETE_TABLE,
  OVERWRITE_ORDER,
  CLEAR_HISTORY,
}
