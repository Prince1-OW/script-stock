import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";

const mockProducts: Product[] = [
  { id: "1", name: "Paracetamol 500mg", sku: "PARA-500", price: 2.5, stock: 120, expiry: "2026-03-01", createdAt: new Date().toISOString() },
  { id: "2", name: "Amoxicillin 250mg", sku: "AMOX-250", price: 6.9, stock: 40, expiry: "2025-12-15", createdAt: new Date().toISOString() },
  { id: "3", name: "Vitamin C 1000mg", sku: "VITC-1000", price: 4.2, stock: 0, expiry: "2027-05-22", createdAt: new Date().toISOString() },
];

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      // Placeholder for Supabase fetch later
      await new Promise((r) => setTimeout(r, 300));
      return mockProducts;
    },
  });
};
