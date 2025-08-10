export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number; // in major units
  stock: number;
  expiry?: string; // ISO date
  createdAt: string; // ISO date
};
