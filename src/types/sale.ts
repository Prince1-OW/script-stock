export interface SaleItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Sale {
  id: string;
  user_id: string;
  sale_date: string;
  total_amount: number;
  tax_amount: number;
  subtotal_amount: number;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItemData {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}