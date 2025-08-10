import { SaleItem } from "@/types/sale";

export const calculateTotals = (items: SaleItem[], taxRate = 0.07) => {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { subtotal, tax, total };
};
