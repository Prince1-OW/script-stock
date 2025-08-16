import { Helmet } from "react-helmet-async";
import ProductForm from "@/components/inventory/ProductForm";

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
      <ProductForm mode="create" />
    </div>
  );
};

export default InventoryNew;
