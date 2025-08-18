import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useDashboardMetrics } from "@/hooks/useSales";

const Dashboard = () => {
  const { data: metrics, isLoading } = useDashboardMetrics();
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Dashboard – PharmacyMS</title>
        <meta name="description" content="Overview of sales, inventory, and activity." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Quick insights and KPIs.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-elevated transition-[box-shadow]" aria-label="Today's Sales">
          <CardHeader>
            <CardTitle>Today’s Sales</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {isLoading ? "..." : `$${metrics?.todaySales.toFixed(2) || "0.00"}`}
          </CardContent>
        </Card>
        <Card className="hover:shadow-elevated transition-[box-shadow]" aria-label="Low Stock Items">
          <CardHeader>
            <CardTitle>Low Stock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {isLoading ? "..." : metrics?.lowStock || 0}
          </CardContent>
        </Card>
        <Card className="hover:shadow-elevated transition-[box-shadow]" aria-label="Expiring Soon">
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {isLoading ? "..." : metrics?.expiring || 0}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 260 }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Loading chart data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics?.weeklyData || []} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Sales']}
                />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
