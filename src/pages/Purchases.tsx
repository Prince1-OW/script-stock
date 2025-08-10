import { Helmet } from "react-helmet-async";

const Purchases = () => {
  return (
    <div>
      <Helmet>
        <title>Purchases – PharmacyMS</title>
        <meta name="description" content="Supplier purchases and stock updates." />
        <link rel="canonical" href="/purchases" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Purchases</h1>
        <p className="text-muted-foreground">View and record purchase entries.</p>
      </header>
      <div className="rounded-lg border p-6 text-muted-foreground">Purchase list coming soon.</div>
    </div>
  );
};

export default Purchases;
