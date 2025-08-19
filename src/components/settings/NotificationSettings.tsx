import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Bell, AlertTriangle, Package, Calendar } from "lucide-react";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    lowStockAlerts: true,
    expiryAlerts: true,
    newOrderAlerts: true,
    salesReports: false,
    emailNotifications: true,
    pushNotifications: false
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alert Notifications
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="lowStock">Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when products are running low
                </p>
              </div>
              <Switch
                id="lowStock"
                checked={settings.lowStockAlerts}
                onCheckedChange={(checked) => updateSetting('lowStockAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expiry">Expiry Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about products nearing expiration
                </p>
              </div>
              <Switch
                id="expiry"
                checked={settings.expiryAlerts}
                onCheckedChange={(checked) => updateSetting('expiryAlerts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="orders">New Order Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new purchase orders
                </p>
              </div>
              <Switch
                id="orders"
                checked={settings.newOrderAlerts}
                onCheckedChange={(checked) => updateSetting('newOrderAlerts', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Package className="h-4 w-4" />
            Report Notifications
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="salesReports">Daily Sales Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive daily sales summaries via email
                </p>
              </div>
              <Switch
                id="salesReports"
                checked={settings.salesReports}
                onCheckedChange={(checked) => updateSetting('salesReports', checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Delivery Methods
          </h4>
          
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications (requires permission)
                </p>
              </div>
              <Switch
                id="push"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={saveSettings} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;