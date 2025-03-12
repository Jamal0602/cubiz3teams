
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CubeLoader } from '@/components/ui/cube-loader';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserCheck, UserX, AlertCircle, Users, Award, Star, Bell, Upload, CheckCircle, Briefcase } from 'lucide-react';
import { UserProfile } from '@/contexts/AuthContext';

interface PendingUser extends UserProfile {
  email?: string;
}

const AdminDashboard = () => {
  const { profile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingManagers, setPendingManagers] = useState<PendingUser[]>([]);
  const [allUsers, setAllUsers] = useState<PendingUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!loading && profile?.role !== 'admin') {
      toast.error('You need admin access to view this page');
      navigate('/dashboard');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, loading, profile, navigate]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Fetch profiles 
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      
      // Get email addresses from auth.users (this requires admin privileges)
      // Since we can't query auth.users directly via the JavaScript API,
      // we'll assume emails match the Cubiz ID format or leave as unknown
      
      // Prepare user data
      const usersWithEmail = profiles.map(profile => ({
        ...profile,
        email: `${profile.cubiz_id.split('@')[0]}@example.com` // Placeholder email
      }));

      // Filter users
      const pendingVerification = usersWithEmail.filter(user => !user.verified && user.role === 'employee');
      const pendingManagerPromotion = usersWithEmail.filter(user => {
        return user.verified && 
               user.role === 'employee' && 
               (user.rank_points || 0) >= 220;
      });
      
      // Set state
      setPendingUsers(pendingVerification);
      setPendingManagers(pendingManagerPromotion);
      setAllUsers(usersWithEmail);
      
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const verifyUser = async (userId: string) => {
    try {
      // Update user verification status
      const { error } = await supabase
        .from('profiles')
        .update({ 
          verified: true
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Add rank points in a separate query
      const { error: pointsError } = await supabase.rpc('add_rank_points', {
        user_id: userId,
        points: 30
      });
      
      if (pointsError) throw pointsError;
      
      toast.success('User verified successfully');
      fetchUsers();
    } catch (error: any) {
      console.error('Error verifying user:', error);
      toast.error('Failed to verify user');
    }
  };

  const promoteToManager = async (userId: string) => {
    try {
      // Update user role
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: 'manager'
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Add rank points in a separate query
      const { error: pointsError } = await supabase.rpc('add_rank_points', {
        user_id: userId,
        points: 80
      });
      
      if (pointsError) throw pointsError;
      
      toast.success('User promoted to manager');
      fetchUsers();
    } catch (error: any) {
      console.error('Error promoting user:', error);
      toast.error('Failed to promote user');
    }
  };

  if (loading || isLoadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CubeLoader size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Manage users, teams and system settings</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Users
            {pendingUsers.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingUsers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="manager-requests">
            Manager Requests
            {pendingManagers.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingManagers.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{allUsers.length}</div>
                <p className="text-sm text-muted-foreground">Registered accounts</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                  Pending Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingUsers.length}</div>
                <p className="text-sm text-muted-foreground">Users awaiting verification</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Award className="mr-2 h-5 w-5 text-yellow-500" />
                  Manager Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pendingManagers.length}</div>
                <p className="text-sm text-muted-foreground">Users eligible for promotion</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                  <Bell className="mr-2 h-5 w-5 text-blue-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-sm text-muted-foreground">Pending notifications</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent User Registrations</CardTitle>
                <CardDescription>Latest users who joined the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {allUsers.length > 0 ? (
                  <div className="space-y-4">
                    {allUsers.slice(0, 5).map(user => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.cubiz_id}</p>
                          </div>
                        </div>
                        <Badge variant={user.verified ? "default" : "secondary"}>
                          {user.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No users found
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button className="flex items-center gap-2 h-auto py-4" onClick={() => setActiveTab('pending')}>
                    <UserCheck className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Verify Users</div>
                      <div className="text-xs text-muted-foreground">Review pending verifications</div>
                    </div>
                  </Button>
                  
                  <Button className="flex items-center gap-2 h-auto py-4" onClick={() => setActiveTab('manager-requests')}>
                    <Star className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Promote Users</div>
                      <div className="text-xs text-muted-foreground">Review manager requests</div>
                    </div>
                  </Button>
                  
                  <Button className="flex items-center gap-2 h-auto py-4" onClick={() => setActiveTab('notifications')}>
                    <Bell className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Send Notification</div>
                      <div className="text-xs text-muted-foreground">Create system notification</div>
                    </div>
                  </Button>
                  
                  <Button className="flex items-center gap-2 h-auto py-4" onClick={() => navigate('/projects')}>
                    <Upload className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Manage Projects</div>
                      <div className="text-xs text-muted-foreground">Review and upload projects</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending User Verifications</CardTitle>
              <CardDescription>Review and verify new user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUsers.length > 0 ? (
                <div className="space-y-6">
                  {pendingUsers.map(user => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{user.cubiz_id}</Badge>
                              <Badge variant="secondary">{user.department || 'No department'}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 sm:flex-col md:flex-row">
                          <Button 
                            variant="default" 
                            className="flex-1"
                            onClick={() => verifyUser(user.id)}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Verify
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="flex-1"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Bio</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.bio || 'No bio provided'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {user.skills && user.skills.length > 0 ? (
                              user.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">No skills provided</span>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Joined</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">There are no pending user verifications at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manager-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manager Promotion Requests</CardTitle>
              <CardDescription>Users eligible for promotion to manager (220+ rank points)</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingManagers.length > 0 ? (
                <div className="space-y-6">
                  {pendingManagers.map(user => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback>{user.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{user.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{user.cubiz_id}</Badge>
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {user.rank_points || 0} RP
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="default" 
                            onClick={() => promoteToManager(user.id)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Promote
                          </Button>
                          <Button variant="outline">Ignore</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Department</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.department || 'No department'}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Verified Since</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(user.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-1">Current Role</h4>
                          <Badge>Employee</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Promotion Requests</h3>
                  <p className="text-muted-foreground">There are no users with enough rank points for manager promotion.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all-users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage all users in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-5 p-4 font-medium bg-muted">
                  <div>Name</div>
                  <div>Cubiz ID</div>
                  <div>Joined</div>
                  <div>Rank Points</div>
                  <div>Role</div>
                </div>
                <div className="divide-y">
                  {allUsers.map(user => (
                    <div key={user.id} className="grid grid-cols-1 md:grid-cols-5 p-4 items-center">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{user.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-xs text-muted-foreground hidden md:block">{user.email}</p>
                        </div>
                      </div>
                      <div>{user.cubiz_id}</div>
                      <div>{new Date(user.joined_at).toLocaleDateString()}</div>
                      <div>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {user.rank_points || 0} RP
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'manager' ? 'default' : 'secondary'}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                        {!user.verified && <Badge variant="outline" className="bg-orange-500/10 text-orange-500">Pending</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>Create and send notifications to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Notification title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" placeholder="Notification content" />
                </div>
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="all-users" />
                      <Label htmlFor="all-users">All Users</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="managers" />
                      <Label htmlFor="managers">Managers</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="employees" />
                      <Label htmlFor="employees">Employees</Label>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="send-email" />
                    <Label htmlFor="send-email">Also send as email</Label>
                  </div>
                </div>
                <Button>Send Notification</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Settings functionality will be implemented in the next phase.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
