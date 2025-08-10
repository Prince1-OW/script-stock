import { Helmet } from "react-helmet-async";

const Settings = () => {
  return (
    <div>
      <Helmet>
        <title>Settings – PharmacyMS</title>
        <meta name="description" content="Manage users, roles, and preferences." />
        <link rel="canonical" href="/settings" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Configure roles and preferences.</p>
      </header>
      <div className="rounded-lg border p-6 text-muted-foreground">Settings coming soon.</div>
    </div>
  );
};

export default Settings;
