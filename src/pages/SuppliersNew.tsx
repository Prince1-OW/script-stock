import { Helmet } from "react-helmet-async";
import SupplierForm from "@/components/suppliers/SupplierForm";

const SuppliersNew = () => {
  return (
    <div>
      <Helmet>
        <title>Add Supplier – PharmacyMS</title>
        <meta name="description" content="Add a new supplier to your vendor network." />
        <link rel="canonical" href="/suppliers/new" />
      </Helmet>
      
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Add Supplier</h1>
        <p className="text-muted-foreground">Create a new supplier record with contact details.</p>
      </header>
      
      <SupplierForm mode="create" />
    </div>
  );
};

export default SuppliersNew;