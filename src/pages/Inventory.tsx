import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/common/DataTable";
import { useProducts } from "@/hooks/useProducts";
import { formatDate } from "@/utils/formatDate";

const Inventory = () => {
  const { data = [], isLoading } = useProducts();

  return (
    <div>
      <Helmet>
        <title>Inventory – PharmacyMS</title>
        <meta name="description" content="Browse and manage your products and stock." />
        <link rel="canonical" href="/inventory" />
      </Helmet>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-muted-foreground">List of products with stock and expiry.</p>
        </div>
        <Link to="/inventory/new"><Button>Add Product</Button></Link>
      </header>
      {isLoading ? (
        <div className="rounded-lg border p-6 text-muted-foreground">Loading products…</div>
      ) : (
        <DataTable
          columns={[
            { key: "name", header: "Name" },
            { key: "sku", header: "SKU" },
            { key: "stock", header: "Stock", render: (v) => <span className={Number(v) === 0 ? 'text-destructive' : ''}>{v}</span> },
            { key: "price", header: "Price", render: (v) => `$${Number(v).toFixed(2)}` },
            { key: "expiry", header: "Expiry", render: (v) => (v ? formatDate(v) : '—') },
            { key: "id", header: "Actions", render: (_v, row) => (
              <Link to={`/inventory/${row.id}/edit`} className="underline underline-offset-4 text-primary">Edit</Link>
            ) },
          ]}
          data={data}
        />
      )}
    </div>
  );
};

export default Inventory;
