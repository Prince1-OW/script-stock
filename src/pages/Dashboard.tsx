import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", sales: 120 },
  { day: "Tue", sales: 98 },
  { day: "Wed", sales: 160 },
  { day: "Thu", sales: 140 },
  { day: "Fri", sales: 210 },
  { day: "Sat", sales: 180 },
  { day: "Sun", sales: 130 },
];

const Dashboard = () => {
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
          <CardContent className="text-2xl font-bold">$1,240</CardContent>
        </Card>
        <Card className="hover:shadow-elevated transition-[box-shadow]" aria-label="Low Stock Items">
          <CardHeader>
            <CardTitle>Low Stock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">3</CardContent>
        </Card>
        <Card className="hover:shadow-elevated transition-[box-shadow]" aria-label="Expiring Soon">
          <CardHeader>
            <CardTitle>Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">5</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Sales</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
