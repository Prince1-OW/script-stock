-- Fix function search path security issues

-- Update function to set search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update function to set search path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update function to set search path  
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;