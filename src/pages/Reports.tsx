import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

const weekly = [
  { day: "Mon", sales: 120 },
  { day: "Tue", sales: 98 },
  { day: "Wed", sales: 160 },
  { day: "Thu", sales: 140 },
  { day: "Fri", sales: 210 },
  { day: "Sat", sales: 180 },
  { day: "Sun", sales: 130 },
];

const exportCSV = () => {
  const header = "Day,Sales";
  const rows = weekly.map(r => `${r.day},${r.sales}`).join("\n");
  const csv = [header, rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "weekly-sales.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast("CSV exported");
};

const exportPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Weekly Sales Report", 14, 18);
  doc.setFontSize(12);
  let y = 30;
  weekly.forEach((r) => {
    doc.text(`${r.day.padEnd(5)}  $${r.sales.toFixed(2)}`, 14, y);
    y += 8;
  });
  doc.save("weekly-sales.pdf");
  toast("PDF exported");
};

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
        <p className="text-muted-foreground">Export CSV/PDF.</p>
      </header>
      <div className="rounded-lg border p-6 space-y-4">
        <div className="flex gap-3">
          <Button onClick={exportCSV}>Export CSV</Button>
          <Button variant="secondary" onClick={exportPDF}>Export PDF</Button>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Preview</div>
          <ul className="list-disc pl-6">
            {weekly.map((r) => (
              <li key={r.day}>{r.day}: ${r.sales.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
