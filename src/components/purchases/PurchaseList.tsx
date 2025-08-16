import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/common/DataTable";
import { usePurchases, useUpdatePurchaseStatus } from "@/hooks/usePurchases";
import { Purchase } from "@/types/purchase";
import { formatDate } from "@/utils/formatDate";
import { Plus, Eye, CheckCircle2, XCircle, Clock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const PurchaseList = () => {
  const { data: purchases, isLoading } = usePurchases();
  const updatePurchaseStatus = useUpdatePurchaseStatus();
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const getStatusBadge = (status: Purchase["status"]) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'completed':
        return <Badge variant="default"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusChange = (purchase: Purchase, newStatus: Purchase["status"]) => {
    updatePurchaseStatus.mutate({
      purchaseId: purchase.id,
      status: newStatus,
    });
  };

  const columns = [
    {
      key: "purchase_date" as keyof Purchase,
      header: "Purchase Date",
      render: (value: any, row: Purchase) => formatDate(row.purchase_date),
    },
    {
      key: "supplier" as keyof Purchase,
      header: "Supplier",
      render: (value: any, row: Purchase) => row.supplier?.name || "Unknown Supplier",
    },
    {
      key: "total_amount" as keyof Purchase,
      header: "Total Amount",
      render: (value: any, row: Purchase) => `$${row.total_amount.toFixed(2)}`,
    },
    {
      key: "status" as keyof Purchase,
      header: "Status",
      render: (value: any, row: Purchase) => getStatusBadge(row.status),
    },
    {
      key: "actions" as keyof Purchase,
      header: "Actions",
      render: (value: any, row: Purchase) => (
        <div className="flex items-center gap-2">
          <Link to={`/purchases/${row.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          </Link>
          {row.status === 'pending' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setSelectedPurchase(row)}>
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete Purchase</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to mark this purchase as completed? This will update your inventory stock levels.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => selectedPurchase && handleStatusChange(selectedPurchase, 'completed')}
                  >
                    Complete Purchase
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading purchases...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Purchase History</h2>
          <p className="text-sm text-muted-foreground">Manage your supplier purchases and inventory updates.</p>
        </div>
        <Link to="/purchases/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Purchase
          </Button>
        </Link>
      </div>

              {!purchases || purchases.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground mb-4">No purchases found.</div>
            <Link to="/purchases/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create First Purchase
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={purchases} columns={columns} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PurchaseList;