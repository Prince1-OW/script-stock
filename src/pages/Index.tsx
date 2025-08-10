import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-gradient-hero">
      <Helmet>
        <title>Pharmacy Management System</title>
        <meta name="description" content="All-in-one pharmacy management: inventory, POS, prescriptions, and reports." />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Pharmacy Management System',
          applicationCategory: 'BusinessApplication',
          operatingSystem: 'Web',
          description: 'Pharmacy inventory, POS, prescriptions, and reporting.'
        })}</script>
      </Helmet>
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Run your pharmacy with confidence
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Inventory, POS, prescriptions, purchases, and reports — streamlined in one modern interface.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/dashboard"><Button variant="hero" size="lg">Open Dashboard</Button></Link>
          <Link to="/inventory"><Button variant="secondary" size="lg">Explore Inventory</Button></Link>
        </div>
      </section>
    </main>
  );
};

export default Index;
