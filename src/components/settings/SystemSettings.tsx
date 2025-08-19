import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Settings, DollarSign, Percent, Clock, Palette } from "lucide-react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: '8.5',
    lowStockThreshold: '5',
    expiryWarningDays: '30',
    theme: 'system',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      localStorage.setItem('systemSettings', JSON.stringify(settings));
      
      toast({
        title: "Settings saved",
        description: "Your system preferences have been updated.",
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

  const updateSetting = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="currency" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Currency
            </Label>
            <Select value={settings.currency} onValueChange={(value) => updateSetting('currency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="taxRate" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Tax Rate (%)
            </Label>
            <Input
              id="taxRate"
              value={settings.taxRate}
              onChange={(e) => updateSetting('taxRate', e.target.value)}
              placeholder="Enter tax rate"
              type="number"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="lowStock">Low Stock Threshold</Label>
            <Input
              id="lowStock"
              value={settings.lowStockThreshold}
              onChange={(e) => updateSetting('lowStockThreshold', e.target.value)}
              placeholder="Minimum stock level"
              type="number"
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Alert when stock falls below this number
            </p>
          </div>

          <div>
            <Label htmlFor="expiryDays" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Expiry Warning (Days)
            </Label>
            <Input
              id="expiryDays"
              value={settings.expiryWarningDays}
              onChange={(e) => updateSetting('expiryWarningDays', e.target.value)}
              placeholder="Days before expiry"
              type="number"
              min="1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Warning days before product expires
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="theme" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </Label>
            <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Current Settings Summary</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Currency: {settings.currency}</p>
            <p>Tax Rate: {settings.taxRate}%</p>
            <p>Low Stock Alert: {settings.lowStockThreshold} items</p>
            <p>Expiry Warning: {settings.expiryWarningDays} days</p>
          </div>
        </div>

        <Button 
          onClick={saveSettings} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Saving..." : "Save System Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SystemSettings;