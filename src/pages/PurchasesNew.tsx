import { Helmet } from "react-helmet-async";
import PurchaseForm from "@/components/purchases/PurchaseForm";

const PurchasesNew = () => {
  return (
    <div>
      <Helmet>
        <title>New Purchase – PharmacyMS</title>
        <meta name="description" content="Record a new supplier purchase and update stock." />
        <link rel="canonical" href="/purchases/new" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">New Purchase</h1>
        <p className="text-muted-foreground">Enter supplier and items.</p>
      </header>
      <PurchaseForm />
    </div>
  );
};

export default PurchasesNew;
