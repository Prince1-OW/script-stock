import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SaleItem } from "@/types/sale";

export const useSales = () => {
  return useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (saleData: {
      items: SaleItem[];
      subtotal: number;
      tax: number;
      total: number;
      payment_method?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create the sale record
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          user_id: user.id,
          subtotal_amount: saleData.subtotal,
          tax_amount: saleData.tax,
          total_amount: saleData.total,
          payment_method: saleData.payment_method || 'cash'
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = saleData.items.map(item => ({
        sale_id: sale.id,
        product_id: item.productId,
        quantity: item.qty,
        unit_price: item.price,
        total_price: item.price * item.qty
      }));

      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(saleItems);

      if (itemsError) throw itemsError;

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Sale completed",
        description: "The sale has been processed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error processing sale",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get today's sales
      const today = new Date().toISOString().split('T')[0];
      const { data: todaySales, error: salesError } = await supabase
        .from("sales")
        .select("total_amount")
        .eq("sale_date", today);

      if (salesError) throw salesError;

      // Get low stock products (stock <= 5)
      const { data: lowStock, error: stockError } = await supabase
        .from("products")
        .select("id")
        .lte("stock", 5);

      if (stockError) throw stockError;

      // Get expiring products (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const { data: expiring, error: expiryError } = await supabase
        .from("products")
        .select("id")
        .lte("expiry", thirtyDaysFromNow.toISOString().split('T')[0])
        .not("expiry", "is", null);

      if (expiryError) throw expiryError;

      // Get weekly sales data
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { data: weeklySales, error: weeklyError } = await supabase
        .from("sales")
        .select("total_amount, sale_date")
        .gte("sale_date", weekAgo.toISOString().split('T')[0])
        .order("sale_date");

      if (weeklyError) throw weeklyError;

      const todaysTotal = todaySales?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      
      // Process weekly data into chart format
      const weeklyData = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        
        const dailySales = weeklySales?.filter(sale => sale.sale_date === dateStr) || [];
        const dailyTotal = dailySales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
        
        weeklyData.push({
          day: dayName,
          sales: dailyTotal
        });
      }

      return {
        todaySales: todaysTotal,
        lowStock: lowStock?.length || 0,
        expiring: expiring?.length || 0,
        weeklyData
      };
    },
  });
};