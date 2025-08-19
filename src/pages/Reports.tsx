import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { useSales } from "@/hooks/useSales";

const Reports = () => {
  const { data: sales = [], isLoading } = useSales();

  // Process sales data for reporting
  const processedData = sales.reduce((acc, sale) => {
    const saleDate = new Date(sale.sale_date);
    const dayName = saleDate.toLocaleDateString('en-US', { weekday: 'short' });
    
    const existingDay = acc.find(item => item.day === dayName);
    if (existingDay) {
      existingDay.sales += Number(sale.total_amount);
    } else {
      acc.push({
        day: dayName,
        sales: Number(sale.total_amount)
      });
    }
    return acc;
  }, [] as { day: string; sales: number }[]);

  // Calculate totals
  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalTransactions = sales.length;
  const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const exportCSV = () => {
    if (sales.length === 0) {
      toast.error("No sales data to export");
      return;
    }

    const headers = "Date,Amount,Payment Method,Transaction ID";
    const rows = sales.map(sale => 
      `${sale.sale_date},$${Number(sale.total_amount).toFixed(2)},${sale.payment_method},${sale.id}`
    ).join("\n");
    
    const csv = [headers, rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Sales report exported as CSV");
  };

  const exportPDF = () => {
    if (sales.length === 0) {
      toast.error("No sales data to export");
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("Sales Report", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Sales: $${totalSales.toFixed(2)}`, 14, 40);
    doc.text(`Total Transactions: ${totalTransactions}`, 14, 50);
    doc.text(`Average Transaction: $${averageTransaction.toFixed(2)}`, 14, 60);
    
    // Sales data
    doc.setFontSize(14);
    doc.text("Recent Transactions:", 14, 75);
    
    let y = 85;
    doc.setFontSize(10);
    
    const recentSales = sales.slice(0, 20); // Show last 20 transactions
    recentSales.forEach((sale) => {
      if (y > 270) { // Start new page if needed
        doc.addPage();
        y = 20;
      }
      
      const line = `${sale.sale_date} - $${Number(sale.total_amount).toFixed(2)} (${sale.payment_method})`;
      doc.text(line, 14, y);
      y += 8;
    });
    
    doc.save(`sales-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Sales report exported as PDF");
  };
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
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Total Sales</h3>
            <p className="text-2xl font-bold">
              {isLoading ? "Loading..." : `$${totalSales.toFixed(2)}`}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Transactions</h3>
            <p className="text-2xl font-bold">
              {isLoading ? "Loading..." : totalTransactions}
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Average Sale</h3>
            <p className="text-2xl font-bold">
              {isLoading ? "Loading..." : `$${averageTransaction.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Export Actions */}
        <div className="rounded-lg border p-6">
          <h3 className="font-medium mb-4">Export Reports</h3>
          <div className="flex gap-3 mb-4">
            <Button 
              onClick={exportCSV}
              disabled={isLoading || sales.length === 0}
            >
              Export CSV
            </Button>
            <Button 
              variant="secondary" 
              onClick={exportPDF}
              disabled={isLoading || sales.length === 0}
            >
              Export PDF
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading sales data...</div>
          ) : sales.length === 0 ? (
            <div className="text-sm text-muted-foreground">No sales data available for export.</div>
          ) : (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Recent Transactions Preview:</div>
              <ul className="list-disc pl-6 text-sm space-y-1">
                {sales.slice(0, 5).map((sale) => (
                  <li key={sale.id}>
                    {sale.sale_date}: ${Number(sale.total_amount).toFixed(2)} ({sale.payment_method})
                  </li>
                ))}
                {sales.length > 5 && (
                  <li className="text-muted-foreground">... and {sales.length - 5} more transactions</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
