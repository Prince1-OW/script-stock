-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  subtotal_amount NUMERIC NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sale_items table
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sales
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sales
CREATE POLICY "Users can view their own sales" 
ON public.sales 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales" 
ON public.sales 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales" 
ON public.sales 
FOR DELETE 
USING (auth.uid() = user_id);

-- Enable RLS on sale_items
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sale_items
CREATE POLICY "Users can view sale items for their sales" 
ON public.sale_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sales s 
  WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()
));

CREATE POLICY "Users can create sale items for their sales" 
ON public.sale_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM sales s 
  WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()
));

CREATE POLICY "Users can update sale items for their sales" 
ON public.sale_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM sales s 
  WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()
));

CREATE POLICY "Users can delete sale items for their sales" 
ON public.sale_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM sales s 
  WHERE s.id = sale_items.sale_id AND s.user_id = auth.uid()
));

-- Add trigger for sales updated_at
CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update stock after sale
CREATE OR REPLACE FUNCTION public.update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
  -- Reduce stock when sale item is created
  IF TG_OP = 'INSERT' THEN
    UPDATE products 
    SET stock = stock - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;
    RETURN NEW;
  END IF;
  
  -- Adjust stock when sale item is updated
  IF TG_OP = 'UPDATE' THEN
    UPDATE products 
    SET stock = stock + OLD.quantity - NEW.quantity,
        updated_at = now()
    WHERE id = NEW.product_id;
    RETURN NEW;
  END IF;
  
  -- Restore stock when sale item is deleted
  IF TG_OP = 'DELETE' THEN
    UPDATE products 
    SET stock = stock + OLD.quantity,
        updated_at = now()
    WHERE id = OLD.product_id;
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for stock updates on sales
CREATE TRIGGER update_stock_on_sale_insert
  AFTER INSERT ON public.sale_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stock_on_sale();

CREATE TRIGGER update_stock_on_sale_update
  AFTER UPDATE ON public.sale_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stock_on_sale();

CREATE TRIGGER update_stock_on_sale_delete
  AFTER DELETE ON public.sale_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stock_on_sale();