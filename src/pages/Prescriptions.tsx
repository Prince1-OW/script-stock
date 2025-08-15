import { Helmet } from "react-helmet-async";
import PrescriptionUpload from "@/components/prescriptions/PrescriptionUpload";

const Prescriptions = () => {
  return (
    <div>
      <Helmet>
        <title>Prescriptions – PharmacyMS</title>
        <meta name="description" content="Manage prescription uploads and linkage to sales." />
        <link rel="canonical" href="/prescriptions" />
      </Helmet>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Prescriptions</h1>
        <p className="text-muted-foreground">Upload and manage prescriptions.</p>
      </header>
      <PrescriptionUpload />
    </div>
  );
};

export default Prescriptions;
