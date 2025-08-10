import { Helmet } from "react-helmet-async";

const InventoryNew = () => {
  return (
    <div>
      <Helmet>
        <title>New Product – PharmacyMS</title>
        <meta name="description" content="Create a new product and initial stock batch." />
        <link rel="canonical" href="/inventory/new" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add Product</h1>
        <p className="text-muted-foreground">Fill product details and stock.</p>
      </header>
      <div className="rounded-lg border p-6 text-muted-foreground">Form coming soon.</div>
    </div>
  );
};

export default InventoryNew;
