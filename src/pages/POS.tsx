import { Helmet } from "react-helmet-async";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { calculateTotals } from "@/utils/calculateTotals";
import { SaleItem } from "@/types/sale";
import BarcodeScanner from "@/components/pos/BarcodeScanner";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { toast } from "sonner";
import QuickAddProduct from "@/components/inventory/QuickAddProduct";

const POS = () => {
  const { data: products = [], isLoading } = useProducts();
  const createSale = useCreateSale();
  const [items, setItems] = useState<SaleItem[]>([]);

  // Keyboard shortcuts for faster POS operation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 - Focus barcode input
      if (e.key === 'F1') {
        e.preventDefault();
        const barcodeInput = document.querySelector('input[placeholder*="barcode"]') as HTMLInputElement;
        barcodeInput?.focus();
      }
      // F2 - Checkout
      if (e.key === 'F2' && items.length > 0) {
        e.preventDefault();
        handleCheckout();
      }
      // F3 - Clear cart
      if (e.key === 'F3') {
        e.preventDefault();
        setItems([]);
        toast.info("Cart cleared");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items.length]);

  const onDetect = (code: string) => {
    const product = products.find(p => p.sku.toLowerCase() === code.toLowerCase());
    if (!product) {
      toast.error(`Product with SKU "${code}" not found`);
      return;
    }

    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    setItems((cur) => {
      const idx = cur.findIndex((c) => c.productId === product.id);
      if (idx >= 0) {
        const currentQty = cur[idx].qty;
        if (currentQty >= product.stock) {
          toast.error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
          return cur;
        }
        const clone = [...cur];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + 1 };
        return clone;
      }
      return [...cur, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const addProduct = (product: any) => {
    if (product.stock <= 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    setItems((cur) => {
      const idx = cur.findIndex((c) => c.productId === product.id);
      if (idx >= 0) {
        const currentQty = cur[idx].qty;
        if (currentQty >= product.stock) {
          toast.error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
          return cur;
        }
        const clone = [...cur];
        clone[idx] = { ...clone[idx], qty: clone[idx].qty + 1 };
        return clone;
      }
      return [...cur, { productId: product.id, name: product.name, price: Number(product.price), qty: 1 }];
    });
  };

  const updateQuantity = (idx: number, newQty: number) => {
    if (newQty < 1) return;
    
    const product = products.find(p => p.id === items[idx].productId);
    if (product && newQty > product.stock) {
      toast.error(`Not enough stock for ${product.name}. Available: ${product.stock}`);
      return;
    }

    setItems(cur => cur.map((c, j) => j === idx ? { ...c, qty: newQty } : c));
  };

  const removeItem = (idx: number) => {
    setItems(cur => cur.filter((_, j) => j !== idx));
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    try {
      await createSale.mutateAsync({
        items,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total
      });
      
      setItems([]);
      toast.success("Sale completed successfully!");
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const totals = useMemo(() => calculateTotals(items), [items]);

  return (
    <div>
      <Helmet>
        <title>POS – PharmacyMS</title>
        <meta name="description" content="Point of sale with cart and checkout." />
        <link rel="canonical" href="/pos" />
      </Helmet>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Point of Sale</h1>
          <p className="text-muted-foreground">
            Scan items and checkout. Shortcuts: F1-Focus scanner, F2-Checkout, F3-Clear cart
          </p>
        </div>
        <QuickAddProduct />
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border">
            <div className="px-4 py-2 border-b font-medium">Cart ({items.length} items)</div>
            <div className="divide-y max-h-64 overflow-y-auto">
              {items.length === 0 ? (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No items in cart. Scan a product or add from the list below.
                </div>
              ) : (
                items.map((i, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3">
                    <div className="flex-1">
                      <div className="font-medium">{i.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ${i.price.toFixed(2)} each • Total: ${(i.price * i.qty).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => updateQuantity(idx, i.qty - 1)}
                        disabled={i.qty <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{i.qty}</span>
                      <Button 
                        size="sm" 
                        onClick={() => updateQuantity(idx, i.qty + 1)}
                      >
                        +
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => removeItem(idx)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="px-4 py-2 border-b font-medium">Available Products</div>
            <div className="p-4">
              {isLoading ? (
                <div className="text-center text-muted-foreground">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center text-muted-foreground">No products available</div>
              ) : (
                <div className="grid gap-2 max-h-48 overflow-y-auto">
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className="flex items-center justify-between p-2 rounded border hover:bg-accent cursor-pointer"
                      onClick={() => addProduct(product)}
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          SKU: {product.sku} • Stock: {product.stock} • ${Number(product.price).toFixed(2)}
                        </div>
                      </div>
                      <Button size="sm" disabled={product.stock <= 0}>
                        {product.stock <= 0 ? "Out of Stock" : "Add"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 font-medium">Scanner</div>
            <BarcodeScanner onDetect={onDetect} />
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <div className="flex justify-between py-1 text-sm"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between py-1 text-sm"><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
            <div className="flex justify-between py-2 text-lg font-semibold"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
          </div>
          <Button 
            size="lg" 
            className="w-full" 
            variant="hero"
            onClick={handleCheckout}
            disabled={items.length === 0 || createSale.isPending}
          >
            {createSale.isPending ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default POS;
