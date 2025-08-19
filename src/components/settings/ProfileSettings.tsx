import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Building, Phone, Mail } from "lucide-react";

const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    pharmacyName: '',
    pharmacyAddress: '',
    phone: '',
    license: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile(prev => ({
          ...prev,
          email: user.email || ''
        }));
        
        // In a real app, you'd load additional profile data from a profiles table
        // For now, we'll use local storage as a demo
        const savedProfile = localStorage.getItem('pharmacyProfile');
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          setProfile(prev => ({ ...prev, ...parsedProfile }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd save to a profiles table in Supabase
      // For demo purposes, we'll use localStorage
      const profileData = {
        pharmacyName: profile.pharmacyName,
        pharmacyAddress: profile.pharmacyAddress,
        phone: profile.phone,
        license: profile.license,
        notes: profile.notes
      };
      
      localStorage.setItem('pharmacyProfile', JSON.stringify(profileData));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <div className="flex">
              <Mail className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Email cannot be changed from this screen
            </p>
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              <Phone className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="pharmacyName">Pharmacy Name</Label>
          <div className="flex">
            <Building className="h-4 w-4 mt-3 mr-2 text-muted-foreground" />
            <Input
              id="pharmacyName"
              value={profile.pharmacyName}
              onChange={(e) => handleInputChange('pharmacyName', e.target.value)}
              placeholder="Enter your pharmacy name"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pharmacyAddress">Pharmacy Address</Label>
          <Textarea
            id="pharmacyAddress"
            value={profile.pharmacyAddress}
            onChange={(e) => handleInputChange('pharmacyAddress', e.target.value)}
            placeholder="Enter your pharmacy address"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="license">Pharmacy License Number</Label>
          <Input
            id="license"
            value={profile.license}
            onChange={(e) => handleInputChange('license', e.target.value)}
            placeholder="Enter license number"
          />
        </div>

        <div>
          <Label htmlFor="notes">Additional Notes</Label>
          <Textarea
            id="notes"
            value={profile.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any additional information about your pharmacy"
            rows={3}
          />
        </div>

        <Button 
          onClick={saveProfile} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;