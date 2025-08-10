import { Helmet } from "react-helmet-async";

const POS = () => {
  return (
    <div>
      <Helmet>
        <title>POS – PharmacyMS</title>
        <meta name="description" content="Point of sale with cart and checkout." />
        <link rel="canonical" href="/pos" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Point of Sale</h1>
        <p className="text-muted-foreground">Scan items and checkout.</p>
      </header>
      <div className="rounded-lg border p-6 text-muted-foreground">POS UI coming soon.</div>
    </div>
  );
};

export default POS;
