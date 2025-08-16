import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import ProductForm from "@/components/inventory/ProductForm";
import { useProduct } from "@/hooks/useProducts";

const InventoryEdit = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id!);

  if (isLoading) {
    return (
      <div>
        <Helmet>
          <title>Edit Product – PharmacyMS</title>
          <meta name="description" content="Edit product details and stock batches." />
          <link rel="canonical" href={`/inventory/${id}/edit`} />
        </Helmet>
        <div className="rounded-lg border p-6 text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Helmet>
          <title>Product Not Found – PharmacyMS</title>
        </Helmet>
        <div className="rounded-lg border p-6 text-muted-foreground">Product not found.</div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Edit Product – PharmacyMS</title>
        <meta name="description" content="Edit product details and stock batches." />
        <link rel="canonical" href={`/inventory/${id}/edit`} />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Product</h1>
        <p className="text-muted-foreground">Update product details and stock.</p>
      </header>
      <ProductForm product={product} mode="edit" />
    </div>
  );
};

export default InventoryEdit;
