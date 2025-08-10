export type SaleItem = {
  productId: string;
  name: string;
  qty: number;
  price: number; // unit price in major units
};

export type Sale = {
  id: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string; // ISO date
};
