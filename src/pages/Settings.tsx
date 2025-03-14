import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { FileUpload } from '@/components/FileUpload';
import { toast } from 'sonner';
import { CubeLoader } from '@/components/ui/cube-loader';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileX, Save, Settings as SettingsIcon, User, Shield, Bell, Moon, Sun, X as XIcon, MapPin, RefreshCcw, Keyboard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user, profile, logout, loading, refreshProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  
  // Profile form state
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [upiId, setUpiId] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [mentionNotifications, setMentionNotifications] = useState(true);
  const [teamUpdateNotifications, setTeamUpdateNotifications] = useState(true);
  
  // Theme settings
  const [systemTheme, setSystemTheme] = useState(true);
  
  // Advanced settings
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setDepartment(profile.department || '');
      setLocation(profile.location || '');
      setUpiId(profile.upi_id || '');
      setSkills(profile.skills || []);
    }
  }, [profile]);
  
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    
    // Check if skill already exists
    if (skills.includes(newSkill.trim())) {
      toast.error('Skill already added');
      return;
    }
    
    setSkills([...skills, newSkill.trim()]);
    setNewSkill('');
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio,
          department,
          location,
          upi_id: upiId,
          skills
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  const handleSaveNotifications = () => {
    // Mock saving notification settings
    setTimeout(() => {
      toast.success('Notification settings updated');
    }, 500);
  };
  
  const handleSaveTheme = () => {
    // Mock saving theme settings
    setTimeout(() => {
      toast.success('Theme settings updated');
    }, 500);
  };
  
  const handleSaveAdvanced = () => {
    // Mock saving advanced settings
    setTimeout(() => {
      toast.success('Advanced settings updated');
    }, 500);
  };
  
  const handleAvatarUpload = (filePath: string, fileData: any) => {
    if (!user) return;
    
    // Update profile with new avatar URL
    supabase
      .from('profiles')
      .update({
        avatar_url: fileData.url
      })
      .eq('id', user.id)
      .then(async ({ error }) => {
        if (error) {
          toast.error('Failed to update avatar');
          return;
        }
        
        await refreshProfile();
        toast.success('Avatar updated successfully');
      });
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    try {
      // Delete user data first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Then delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        user.id
      );
      
      if (authError) throw authError;
      
      // Logout user
      await logout();
      
      toast.success('Your account has been deleted');
      navigate('/login');
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again later.');
    }
  };
  
  const getLocation = () => {
    if (navigator.geolocation) {
      toast.info('Fetching your current location...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Use Google Maps Geocoding API (would need an API key in production)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            
            if (!response.ok) throw new Error('Geocoding failed');
            
            const data = await response.json();
            
            // Format address from results
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || '';
            const country = data.address.country || '';
            
            const formattedLocation = [city, state, country]
              .filter(Boolean)
              .join(', ');
            
            setLocation(formattedLocation);
            toast.success('Location updated');
          } catch (error) {
            console.error('Geocoding error:', error);
            toast.error('Failed to get location details');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Failed to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };
  
  const generateApiKey = () => {
    // Mock generating an API key
    const key = Array(4)
      .fill(0)
      .map(() => Math.random().toString(36).substring(2, 10))
      .join('-');
    
    setApiKey(key);
    setShowApiKey(true);
    toast.success('New API key generated');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CubeLoader size="lg" text="Loading settings..." />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="flex flex-col items-start h-auto p-0 bg-transparent">
                  <TabsTrigger
                    value="account"
                    className="w-full justify-start px-4 py-3 data-[state=active]:bg-muted"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="w-full justify-start px-4 py-3 data-[state=active]:bg-muted"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger
                    value="appearance"
                    className="w-full justify-start px-4 py-3 data-[state=active]:bg-muted"
                  >
                    {theme === 'dark' ? (
                      <Moon className="h-4 w-4 mr-2" />
                    ) : (
                      <Sun className="h-4 w-4 mr-2" />
                    )}
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="w-full justify-start px-4 py-3 data-[state=active]:bg-muted"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Advanced
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-3/4">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="account" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account information and profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xl">
                          {profile?.full_name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="w-full">
                        <FileUpload 
                          onSuccess={handleAvatarUpload}
                          allowedTypes={['image/jpeg', 'image/png', 'image/gif']}
                          folder="avatars"
                          buttonText="Update Avatar"
                          buttonSize="sm"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-4 w-full">
                      <div className="grid gap-2">
                        <Label htmlFor="cubiz_id">Cubiz ID</Label>
                        <div className="relative">
                          <Input
                            id="cubiz_id"
                            value={profile?.cubiz_id || ''}
                            readOnly
                            className="pr-20 bg-muted"
                          />
                          <Badge className="absolute right-2 top-1/2 transform -translate-y-1/2">
                            {profile?.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Cubiz ID is your unique identifier and cannot be changed
                        </p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="A brief description about yourself"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Your department"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="location" className="flex items-center">
                        Location
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={getLocation}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Your location"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="upi_id">UPI ID</Label>
                      <Input
                        id="upi_id"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Your UPI ID for payments"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="skills">Skills</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="text-muted-foreground hover:text-foreground rounded-full"
                            >
                              <XIcon className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        {skills.length === 0 && (
                          <p className="text-sm text-muted-foreground">No skills added yet</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="add-skill"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddSkill();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddSkill}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" type="button">
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {saving ? (
                        <span className="flex items-center gap-1">
                          <RefreshCcw className="h-4 w-4 animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in the browser
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mention Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone mentions you
                        </p>
                      </div>
                      <Switch
                        checked={mentionNotifications}
                        onCheckedChange={setMentionNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Team Update Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about team updates and events
                        </p>
                      </div>
                      <Switch
                        checked={teamUpdateNotifications}
                        onCheckedChange={setTeamUpdateNotifications}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={handleSaveNotifications}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>
                    Customize the appearance of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Use System Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          Follow your system's theme settings
                        </p>
                      </div>
                      <Switch
                        checked={systemTheme}
                        onCheckedChange={setSystemTheme}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred theme
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={theme === 'light' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('light')}
                          disabled={systemTheme}
                        >
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme('dark')}
                          disabled={systemTheme}
                        >
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={handleSaveTheme}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure advanced features and security options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key" className="flex items-center">
                        API Key
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={generateApiKey}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      </Label>
                      <div className="relative">
                        <Input
                          id="api-key"
                          value={apiKey}
                          readOnly
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="Generate an API key"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-7 w-7"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? (
                            <XIcon className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This key provides API access to your account. Keep it secure.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Keyboard Shortcuts</Label>
                      <Card className="border-dashed">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Keyboard className="h-4 w-4 text-muted-foreground" />
                              <span>Toggle Dark Mode</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Ctrl + Shift + D
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Keyboard className="h-4 w-4 text-muted-foreground" />
                              <span>Search</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Ctrl + K
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Keyboard className="h-4 w-4 text-muted-foreground" />
                              <span>Open Notifications</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Ctrl + Shift + N
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Data Export</Label>
                      <Button variant="outline" className="w-full justify-between">
                        <span className="flex items-center gap-2">
                          <FileX className="h-4 w-4" />
                          Export all your data
                        </span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Download a copy of all your data in JSON format
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="button" onClick={handleSaveAdvanced}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
