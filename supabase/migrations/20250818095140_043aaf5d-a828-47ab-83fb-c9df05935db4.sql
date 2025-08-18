-- Fix function search path security issue
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public';