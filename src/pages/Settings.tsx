
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from '@/components/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  BadgeInfo, 
  BellRing, 
  Building, 
  Calendar, 
  CreditCard, 
  FileText, 
  Languages, 
  Lock, 
  Mail, 
  MapPin, 
  Palette, 
  Save,
  Shield,
  Smartphone,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DomainSettings from '@/components/admin/DomainSettings';

const Settings = () => {
  const { profile, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    bio: profile?.bio || '',
    department: profile?.department || '',
    location: profile?.location || '',
    email: '',
    upiId: profile?.upi_id || '',
    skills: profile?.skills || [],
    newSkill: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Personal settings
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleAddSkill = () => {
    if (!formData.newSkill.trim()) return;
    
    if (!formData.skills.includes(formData.newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, formData.newSkill.trim()],
        newSkill: '',
      });
    } else {
      toast.error('This skill is already added');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };
  
  const handleAvatarUpdate = (path: string, fileData: any) => {
    if (fileData && fileData.url) {
      updateProfile({ avatar_url: fileData.url });
      toast.success('Profile picture updated successfully');
    }
  };
  
  const handleSubmit = async () => {
    setIsUpdating(true);
    
    try {
      await updateProfile({
        full_name: formData.fullName,
        bio: formData.bio,
        department: formData.department,
        location: formData.location,
        upi_id: formData.upiId,
        skills: formData.skills,
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    toast.success('Password updated successfully');
  };
  
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== profile?.cubiz_id) {
      toast.error('Please enter your ID correctly to confirm account deletion');
      return;
    }
    
    try {
      toast.success('Account deletion process initiated. You will be logged out now.');
      await logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };
  
  const tabItems = [
    { id: 'profile', label: 'Profile', icon: <BadgeInfo className="h-4 w-4" /> },
    { id: 'account', label: 'Account', icon: <Lock className="h-4 w-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <BellRing className="h-4 w-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
    { id: 'organization', label: 'Organization', icon: <Building className="h-4 w-4" /> },
    { id: 'domains', label: 'Domains', icon: <Globe className="h-4 w-4" /> },
  ];
  
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/30 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Manage your account and preferences</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar navigation on larger screens */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-4">
            <div className="space-y-1">
              {tabItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start px-3"
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs navigation on mobile */}
        <div className="lg:hidden w-full mb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 w-full overflow-auto">
              {tabItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="flex items-center px-2 py-1">
                  {item.icon}
                  <span className="ml-2 hidden sm:inline-block">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Avatar className="w-24 h-24 relative">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
                    <AvatarFallback className="text-lg">
                      {profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <FileUpload 
                      onSuccess={handleAvatarUpdate}
                      allowedTypes={['image/jpeg', 'image/png']}
                      folder="avatars"
                      buttonText="Change Avatar"
                      buttonSize="sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG or PNG, max 2MB
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cubizId">Cubiz ID</Label>
                      <Input 
                        id="cubizId"
                        value={profile.cubiz_id}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((skill, index) => (
                        <div 
                          key={index} 
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                        >
                          {skill}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1" 
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        id="newSkill"
                        name="newSkill"
                        value={formData.newSkill}
                        onChange={handleInputChange}
                        placeholder="Add a skill"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <Button onClick={handleAddSkill}>Add</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t py-3">
                <Button variant="ghost" onClick={() => setActiveTab('account')}>
                  Next: Account Settings
                </Button>
                <Button onClick={handleSubmit} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="flex-1"
                    />
                    <Button>Verify</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input 
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    placeholder="your-upi@bank"
                  />
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">
                          Please type your Cubiz ID (<span className="font-bold">{profile.cubiz_id}</span>) to confirm:
                        </p>
                        <Input 
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          placeholder={profile.cubiz_id}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm('')}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Delete Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t py-3">
                <Button variant="ghost" onClick={() => setActiveTab('profile')}>
                  Back: Profile
                </Button>
                <Button onClick={handleSubmit} disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground mb-4">Select your preferred theme for the application.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="overflow-hidden cursor-pointer border-2 border-primary/50">
                      <CardContent className="p-0">
                        <div className="h-28 bg-background flex items-center justify-center">
                          <Sun className="h-12 w-12 text-primary" />
                        </div>
                        <div className="p-3 border-t">
                          <p className="font-medium">Light</p>
                          <p className="text-xs text-muted-foreground">Clean and bright interface</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden cursor-pointer">
                      <CardContent className="p-0">
                        <div className="h-28 bg-zinc-900 flex items-center justify-center">
                          <Moon className="h-12 w-12 text-zinc-400" />
                        </div>
                        <div className="p-3 border-t">
                          <p className="font-medium">Dark</p>
                          <p className="text-xs text-muted-foreground">Easier on the eyes in low light</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden cursor-pointer">
                      <CardContent className="p-0">
                        <div className="h-28 bg-gradient-to-r from-background to-zinc-900 flex items-center justify-center">
                          <Smartphone className="h-12 w-12 text-primary/70" />
                        </div>
                        <div className="p-3 border-t">
                          <p className="font-medium">System</p>
                          <p className="text-xs text-muted-foreground">Follows your system preferences</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Language</h3>
                  <p className="text-sm text-muted-foreground mb-4">Select your preferred language for the application.</p>
                  
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Accessibility</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduced-motion">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations throughout the application</p>
                    </div>
                    <Switch id="reduced-motion" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">Increase contrast for better readability</p>
                    </div>
                    <Switch id="high-contrast" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>
                  
                  <Button variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    Set Up 2FA
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage devices where you're currently logged in.</p>
                  
                  <div className="border rounded-md">
                    <div className="p-4 border-b bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <Smartphone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Current Device</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: Just now
                            </p>
                          </div>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-full">
                            <Smartphone className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Chrome on Windows</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: 2 days ago
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Sign Out</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Sign Out All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Projects</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="project-updates">Project updates</Label>
                          <Switch id="project-updates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="task-assigned">Task assigned to you</Label>
                          <Switch id="task-assigned" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="task-completed">Task completed</Label>
                          <Switch id="task-completed" defaultChecked />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Team & Events</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="team-updates">Team updates</Label>
                          <Switch id="team-updates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="event-reminders">Event reminders</Label>
                          <Switch id="event-reminders" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="direct-messages">Direct messages</Label>
                          <Switch id="direct-messages" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Weekly Digest</h3>
                  <p className="text-sm text-muted-foreground mb-4">Receive a weekly summary of your workspace activity.</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly digest email</Label>
                      <p className="text-sm text-muted-foreground">Sent every Monday morning</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Digest Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Manage organization-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Organization Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orgName">Organization Name</Label>
                    <Input 
                      id="orgName"
                      defaultValue="Teamz Workspace"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orgLogo">Organization Logo</Label>
                    <FileUpload
                      onSuccess={(path, data) => toast.success('Logo updated')}
                      allowedTypes={['image/jpeg', 'image/png']}
                      folder="organizations"
                      buttonText="Upload Logo"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended size: 256x256px
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Business Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry"
                        defaultValue="Software Development"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Company Size</Label>
                      <Select defaultValue="11-50">
                        <SelectTrigger id="size">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201+">201+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea 
                      id="address"
                      defaultValue="123 Business Street, Suite 100, San Francisco, CA 94103"
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Billing Information</h3>
                  
                  <div className="p-4 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-4">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Pro Plan</p>
                        <p className="text-sm text-muted-foreground">$49/month - Renews on Aug 12, 2023</p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Manage Plan
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billingEmail">Billing Email</Label>
                      <Input 
                        id="billingEmail"
                        defaultValue="billing@yourcompany.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input 
                        id="taxId"
                        defaultValue="123-45-6789"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t py-3">
                <Button>Save Organization Settings</Button>
              </CardFooter>
            </Card>
          )}
          
          {/* Domains Tab */}
          {activeTab === 'domains' && (
            <DomainSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
