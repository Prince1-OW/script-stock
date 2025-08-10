import { Helmet } from "react-helmet-async";

const Dashboard = () => {
  return (
    <div>
      <Helmet>
        <title>Dashboard – PharmacyMS</title>
        <meta name="description" content="Overview of sales, inventory, and activity." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Quick insights and KPIs.</p>
      </header>
    </div>
  );
};

export default Dashboard;
