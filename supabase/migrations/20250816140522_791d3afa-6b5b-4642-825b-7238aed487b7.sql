-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for suppliers
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers
CREATE POLICY "Users can view their own suppliers" 
ON public.suppliers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own suppliers" 
ON public.suppliers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own suppliers" 
ON public.suppliers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own suppliers" 
ON public.suppliers 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create products table (for inventory integration)
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  expiry DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, sku)
);

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create purchases table
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for purchases
CREATE POLICY "Users can view their own purchases" 
ON public.purchases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases" 
ON public.purchases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchases" 
ON public.purchases 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchases" 
ON public.purchases 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create purchase_items table
CREATE TABLE public.purchase_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_cost DECIMAL(10,2) NOT NULL CHECK (unit_cost >= 0),
  total_cost DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for purchase_items
ALTER TABLE public.purchase_items ENABLE ROW LEVEL SECURITY;

-- Create policies for purchase_items
CREATE POLICY "Users can view purchase items for their purchases" 
ON public.purchase_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.purchases p 
    WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create purchase items for their purchases" 
ON public.purchase_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.purchases p 
    WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update purchase items for their purchases" 
ON public.purchase_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.purchases p 
    WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete purchase items for their purchases" 
ON public.purchase_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.purchases p 
    WHERE p.id = purchase_items.purchase_id AND p.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_suppliers_updated_at
BEFORE UPDATE ON public.suppliers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update purchase total
CREATE OR REPLACE FUNCTION public.update_purchase_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.purchases 
  SET total_amount = (
    SELECT COALESCE(SUM(total_cost), 0)
    FROM public.purchase_items 
    WHERE purchase_id = COALESCE(NEW.purchase_id, OLD.purchase_id)
  )
  WHERE id = COALESCE(NEW.purchase_id, OLD.purchase_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update purchase totals
CREATE TRIGGER update_purchase_total_on_items_change
AFTER INSERT OR UPDATE OR DELETE ON public.purchase_items
FOR EACH ROW
EXECUTE FUNCTION public.update_purchase_total();

-- Create function to update product stock when purchase is completed
CREATE OR REPLACE FUNCTION public.update_stock_on_purchase_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update stock when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.products 
    SET stock = stock + pi.quantity
    FROM public.purchase_items pi
    WHERE pi.purchase_id = NEW.id AND pi.product_id = products.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update stock on purchase completion
CREATE TRIGGER update_stock_on_purchase_completion
AFTER UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_stock_on_purchase_completion();