import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Inventory = () => {
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
      <div className="rounded-lg border p-6 text-muted-foreground">Data table coming soon.</div>
    </div>
  );
};

export default Inventory;
