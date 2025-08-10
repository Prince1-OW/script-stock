import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

const InventoryEdit = () => {
  const { id } = useParams();
  return (
    <div>
      <Helmet>
        <title>Edit Product – PharmacyMS</title>
        <meta name="description" content="Edit product details and stock batches." />
        <link rel="canonical" href={`/inventory/${id}/edit`} />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-muted-foreground">Product ID: {id}</p>
      </header>
      <div className="rounded-lg border p-6 text-muted-foreground">Form coming soon.</div>
    </div>
  );
};

export default InventoryEdit;
