import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Purchase, PurchaseWithItems, PurchaseItem } from "@/types/purchase";

export const usePurchases = () => {
  return useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          supplier:suppliers(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Purchase[];
    },
  });
};

export const usePurchase = (purchaseId: string) => {
  return useQuery({
    queryKey: ["purchase", purchaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          supplier:suppliers(*),
          purchase_items(
            *,
            product:products(name, sku)
          )
        `)
        .eq("id", purchaseId)
        .single();

      if (error) throw error;
      return data as PurchaseWithItems;
    },
    enabled: !!purchaseId,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (purchaseData: {
      supplier_id: string;
      purchase_date: string;
      notes?: string;
      items: Array<{
        product_id: string;
        quantity: number;
        unit_cost: number;
        expiry_date?: string;
      }>;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create purchase
      const { data: purchase, error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id: user.id,
          supplier_id: purchaseData.supplier_id,
          purchase_date: purchaseData.purchase_date,
          notes: purchaseData.notes,
        })
        .select()
        .single();

      if (purchaseError) throw purchaseError;

      // Create purchase items
      const items = purchaseData.items.map(item => ({
        purchase_id: purchase.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from("purchase_items")
        .insert(items);

      if (itemsError) throw itemsError;

      return purchase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Purchase created",
        description: "The purchase has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating purchase",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePurchaseStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ purchaseId, status }: { purchaseId: string; status: Purchase["status"] }) => {
      const { data, error } = await supabase
        .from("purchases")
        .update({ status })
        .eq("id", purchaseId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["purchase", data.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "Purchase updated",
        description: `Purchase status updated to ${data.status}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating purchase",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};