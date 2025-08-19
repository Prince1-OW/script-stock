import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/common/DataTable";
import { useSuppliers } from "@/hooks/useSuppliers";
import { formatDate } from "@/utils/formatDate";
import { Plus, Building2 } from "lucide-react";
import { Supplier } from "@/types/purchase";

const Suppliers = () => {
  const { data: suppliers = [], isLoading } = useSuppliers();

  const columns = [
    { key: "name" as keyof Supplier, header: "Name" },
    { key: "contact_person" as keyof Supplier, header: "Contact Person", render: (v: string) => v || "—" },
    { key: "phone" as keyof Supplier, header: "Phone", render: (v: string) => v || "—" },
    { key: "email" as keyof Supplier, header: "Email", render: (v: string) => v || "—" },
    { key: "address" as keyof Supplier, header: "Address", render: (v: string) => v || "—" },
    { key: "created_at" as keyof Supplier, header: "Added", render: (v: string) => formatDate(v) },
  ];

  return (
    <div>
      <Helmet>
        <title>Suppliers – PharmacyMS</title>
        <meta name="description" content="Manage your suppliers and vendor relationships." />
        <link rel="canonical" href="/suppliers" />
      </Helmet>
      
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supplier relationships and contacts.</p>
        </div>
        <Link to="/suppliers/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground">Loading suppliers...</div>
          </CardContent>
        </Card>
      ) : !suppliers || suppliers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Building2 className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No suppliers found</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first supplier to track purchases and manage vendor relationships.
            </p>
            <Link to="/suppliers/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add First Supplier
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              All Suppliers ({suppliers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={suppliers} columns={columns} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Suppliers;