
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Sun, Bell, Globe, Shield, Smartphone, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { profile, updateProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const [notifications, setNotifications] = useState({
    email: true,
    app: true,
    teamUpdates: true,
    eventReminders: true,
    systemAnnouncements: true
  });
  
  const [appearance, setAppearance] = useState({
    theme: 'system',
    fontSize: 'medium',
    compactMode: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'all',
    showOnlineStatus: true,
    allowDataCollection: true
  });
  
  const [account, setAccount] = useState({
    email: profile?.cubiz_id || '',
    password: '••••••••••',
    twoFactorAuth: false
  });

  const [customDomain, setCustomDomain] = useState('');

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Just simulate API call for non-profile settings
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For profile-related settings, we actually call the updateProfile function
      if (profile) {
        // Example: if we had profile settings that needed updating
        // await updateProfile({ some_field: newValue });
      }
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Settings save error:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <Loader size="md" text="Loading profile settings..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={saving}
          className="mt-4 md:mt-0"
        >
          {saving ? 'Saving...' : 'Save Changes'}
          {!saving && <Save className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <Tabs defaultValue="account" className="space-y-8">
        <div className="w-full overflow-x-auto pb-2">
          <TabsList className="mb-6 w-full md:w-auto flex">
            <TabsTrigger value="account" className="flex-1 md:flex-initial">Account</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 md:flex-initial">Notifications</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1 md:flex-initial">Appearance</TabsTrigger>
            <TabsTrigger value="privacy" className="flex-1 md:flex-initial">Privacy</TabsTrigger>
            {(profile.role === 'admin' || profile.role === 'manager') && (
              <TabsTrigger value="advanced" className="flex-1 md:flex-initial">Advanced</TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="account">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your account details and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address (Cubiz ID)</Label>
                    <Input id="email" value={account.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Your Cubiz ID cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="password" 
                        type="password" 
                        value={account.password} 
                        disabled 
                        className="bg-muted" 
                      />
                      <Button variant="outline">Change</Button>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enhance your account security with two-factor authentication</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        You'll need to enter a code from your phone when signing in
                      </p>
                    </div>
                    <Switch 
                      checked={account.twoFactorAuth} 
                      onCheckedChange={(checked) => setAccount({...account, twoFactorAuth: checked})} 
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Session Management</h3>
                  <Button variant="outline">View active sessions</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how you receive notifications from Teamz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Channels</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <p>Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email} 
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <p>In-App Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates within the app</p>
                      </div>
                      <Switch 
                        checked={notifications.app} 
                        onCheckedChange={(checked) => setNotifications({...notifications, app: checked})} 
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Types</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <p>Team Updates</p>
                        <p className="text-sm text-muted-foreground">New members, messages, and changes</p>
                      </div>
                      <Switch 
                        checked={notifications.teamUpdates} 
                        onCheckedChange={(checked) => setNotifications({...notifications, teamUpdates: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <p>Event Reminders</p>
                        <p className="text-sm text-muted-foreground">Upcoming events, deadlines, and meetings</p>
                      </div>
                      <Switch 
                        checked={notifications.eventReminders} 
                        onCheckedChange={(checked) => setNotifications({...notifications, eventReminders: checked})} 
                      />
                    </div>
                    <div className="flex items-center justify-between border p-4 rounded-md">
                      <div>
                        <p>System Announcements</p>
                        <p className="text-sm text-muted-foreground">Important updates and announcements</p>
                      </div>
                      <Switch 
                        checked={notifications.systemAnnouncements} 
                        onCheckedChange={(checked) => setNotifications({...notifications, systemAnnouncements: checked})} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Teamz looks for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Button 
                      variant={appearance.theme === 'light' ? 'default' : 'outline'} 
                      className="justify-start"
                      onClick={() => setAppearance({...appearance, theme: 'light'})}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </Button>
                    <Button 
                      variant={appearance.theme === 'dark' ? 'default' : 'outline'} 
                      className="justify-start"
                      onClick={() => setAppearance({...appearance, theme: 'dark'})}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </Button>
                    <Button 
                      variant={appearance.theme === 'system' ? 'default' : 'outline'} 
                      className="justify-start"
                      onClick={() => setAppearance({...appearance, theme: 'system'})}
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select 
                    value={appearance.fontSize} 
                    onValueChange={(value) => setAppearance({...appearance, fontSize: value})}
                  >
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p>Compact Mode</p>
                    <p className="text-sm text-muted-foreground">Uses less space in the interface</p>
                  </div>
                  <Switch 
                    checked={appearance.compactMode} 
                    onCheckedChange={(checked) => setAppearance({...appearance, compactMode: checked})} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Manage your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select 
                    value={privacy.profileVisibility} 
                    onValueChange={(value) => setPrivacy({...privacy, profileVisibility: value})}
                  >
                    <SelectTrigger id="profileVisibility">
                      <SelectValue placeholder="Select who can see your profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="team">Team Members Only</SelectItem>
                      <SelectItem value="company">Company Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p>Show Online Status</p>
                    <p className="text-sm text-muted-foreground">Allow others to see when you're active</p>
                  </div>
                  <Switch 
                    checked={privacy.showOnlineStatus} 
                    onCheckedChange={(checked) => setPrivacy({...privacy, showOnlineStatus: checked})} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p>Allow Data Collection</p>
                    <p className="text-sm text-muted-foreground">Help improve Teamz by sharing usage data</p>
                  </div>
                  <Switch 
                    checked={privacy.allowDataCollection} 
                    onCheckedChange={(checked) => setPrivacy({...privacy, allowDataCollection: checked})} 
                  />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-4">Security</h3>
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Logs
                    </Button>
                    <Button variant="outline" className="justify-start text-destructive hover:text-destructive">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {(profile.role === 'admin' || profile.role === 'manager') && (
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Advanced settings for administrators and managers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {profile.role === 'admin' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="customDomain">Custom Domain</Label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Input 
                            id="customDomain" 
                            placeholder="yourdomain.com" 
                            value={customDomain}
                            onChange={(e) => setCustomDomain(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            variant="outline" 
                            className="whitespace-nowrap"
                            onClick={() => {
                              if (customDomain) {
                                toast.success(`Domain ${customDomain} configured successfully`);
                              } else {
                                toast.error('Please enter a domain');
                              }
                            }}
                          >
                            Configure
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Enter your custom domain to connect it to this workspace
                        </p>
                      </div>
                      
                      <Separator />
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiAccess">API Access</Label>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start">
                        <Globe className="h-4 w-4 mr-2" />
                        Manage API Keys
                      </Button>
                      <Button variant="outline" className="justify-start">
                        View API Documentation
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Data Management</Label>
                    <div className="grid gap-2">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => toast.success('Data export started')}
                      >
                        Export Team Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={() => toast.success('Settings synced successfully')}
                      >
                        Sync Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
