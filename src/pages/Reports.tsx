import { Helmet } from "react-helmet-async";

const Reports = () => {
  return (
    <div>
      <Helmet>
        <title>Reports – PharmacyMS</title>
        <meta name="description" content="Sales, inventory, and expiry reports." />
        <link rel="canonical" href="/reports" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-muted-foreground">Export CSV/PDF coming soon.</p>
      </header>
      <div className="rounded-lg border p-6 text-muted-foreground">Report charts coming soon.</div>
    </div>
  );
};

export default Reports;
