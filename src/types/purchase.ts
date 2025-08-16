export interface Supplier {
  id: string;
  user_id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  supplier_id: string;
  purchase_date: string;
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  supplier?: Supplier;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  expiry_date?: string;
  created_at: string;
  product?: {
    name: string;
    sku: string;
  };
}

export interface PurchaseWithItems extends Purchase {
  purchase_items: PurchaseItem[];
}