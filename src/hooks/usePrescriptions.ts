import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Prescription {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  patient_name?: string;
  doctor_name?: string;
  notes?: string;
  status: string;
  linked_sale_id?: string;
  created_at: string;
  updated_at: string;
}

export const usePrescriptions = () => {
  return useQuery<Prescription[]>({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (prescriptionData: {
      file_name: string;
      file_path: string;
      patient_name?: string;
      doctor_name?: string;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("prescriptions")
        .insert({ ...prescriptionData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({
        title: "Prescription saved",
        description: "The prescription has been saved to your records.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving prescription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Omit<Prescription, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from("prescriptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      toast({
        title: "Prescription updated",
        description: "The prescription has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating prescription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useLinkPrescriptionToSale = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      prescriptionId, 
      saleId 
    }: { 
      prescriptionId: string; 
      saleId: string;
    }) => {
      // Update prescription with linked sale
      const { error: prescriptionError } = await supabase
        .from("prescriptions")
        .update({ 
          linked_sale_id: saleId,
          status: 'completed' 
        })
        .eq("id", prescriptionId);

      if (prescriptionError) throw prescriptionError;

      // Update sale with prescription reference
      const { error: saleError } = await supabase
        .from("sales")
        .update({ prescription_id: prescriptionId })
        .eq("id", saleId);

      if (saleError) throw saleError;

      return { prescriptionId, saleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      toast({
        title: "Prescription linked",
        description: "The prescription has been linked to the sale.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error linking prescription",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};