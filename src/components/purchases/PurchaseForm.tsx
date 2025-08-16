import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useSuppliers, useCreateSupplier } from "@/hooks/useSuppliers";
import { useProducts, useCreateProduct } from "@/hooks/useProducts";
import { useCreatePurchase } from "@/hooks/usePurchases";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const purchaseItemSchema = z.object({
  product_id: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_cost: z.number().min(0, "Unit cost must be positive"),
  expiry_date: z.string().optional(),
});

const purchaseSchema = z.object({
  supplier_id: z.string().min(1, "Supplier is required"),
  purchase_date: z.string().min(1, "Purchase date is required"),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, "At least one item is required"),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

const PurchaseForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: suppliers } = useSuppliers();
  const { data: products } = useProducts();
  const createPurchase = useCreatePurchase();

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplier_id: "",
      purchase_date: new Date().toISOString().split('T')[0],
      notes: "",
      items: [{ product_id: "", quantity: 1, unit_cost: 0, expiry_date: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: PurchaseFormData) => {
    setIsSubmitting(true);
    try {
      await createPurchase.mutateAsync({
        supplier_id: data.supplier_id,
        purchase_date: data.purchase_date,
        notes: data.notes,
        items: data.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          expiry_date: item.expiry_date || undefined,
        })),
      });
      navigate("/purchases");
    } catch (error) {
      console.error("Error creating purchase:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return form.watch("items").reduce((total, item) => {
      return total + (item.quantity * item.unit_cost);
    }, 0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>New Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {suppliers?.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes about this purchase..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Purchase Items</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ product_id: "", quantity: 1, unit_cost: 0, expiry_date: "" })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.product_id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Product</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select product" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                  {products?.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name} ({product.sku})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unit_cost`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit Cost</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-end gap-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.expiry_date`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                  <span className="text-lg font-medium">Total Amount:</span>
                  <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/purchases")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Purchase
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseForm;