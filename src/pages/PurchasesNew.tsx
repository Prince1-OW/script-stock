import { Helmet } from "react-helmet-async";

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
      <div className="rounded-lg border p-6 text-muted-foreground">Form coming soon.</div>
    </div>
  );
};

export default PurchasesNew;
