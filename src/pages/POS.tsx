import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { calculateTotals } from "@/utils/calculateTotals";
import { SaleItem } from "@/types/sale";

const POS = () => {
  const [items, setItems] = useState<SaleItem[]>([
    { productId: "1", name: "Paracetamol 500mg", qty: 1, price: 2.5 },
    { productId: "2", name: "Amoxicillin 250mg", qty: 2, price: 6.9 },
  ]);

  const totals = useMemo(() => calculateTotals(items), [items]);

  return (
    <div>
      <Helmet>
        <title>POS – PharmacyMS</title>
        <meta name="description" content="Point of sale with cart and checkout." />
        <link rel="canonical" href="/pos" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Point of Sale</h1>
        <p className="text-muted-foreground">Scan items and checkout.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-3">
          <div className="rounded-lg border">
            <div className="px-4 py-2 border-b font-medium">Cart</div>
            <div className="divide-y">
              {items.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">Qty: {i.qty} • ${i.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setItems(cur => cur.map((c, j) => j === idx ? { ...c, qty: Math.max(1, c.qty - 1) } : c))}>-</Button>
                    <span className="w-6 text-center">{i.qty}</span>
                    <Button size="sm" onClick={() => setItems(cur => cur.map((c, j) => j === idx ? { ...c, qty: c.qty + 1 } : c))}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between py-1 text-sm"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between py-1 text-sm"><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
            <div className="flex justify-between py-2 text-lg font-semibold"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
          </div>
          <Button size="lg" className="w-full" variant="hero">Checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default POS;
