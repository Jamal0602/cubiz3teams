
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, FolderKanban, Users, Bell, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { Badge } from '@/components/ui/badge';

// Sample data for dashboard statistics
const sampleStats = {
  activeProjects: 8,
  teamMembers: 24,
  upcomingEvents: 3,
  completedTasks: 78,
};

// Sample team members data
const sampleTeamMembers = [
  { id: 1, name: 'John Doe', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', role: 'Designer', avatarUrl: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Alex Johnson', role: 'Product Manager', avatarUrl: 'https://i.pravatar.cc/150?img=7' },
  { id: 4, name: 'Sarah Williams', role: 'Marketing', avatarUrl: 'https://i.pravatar.cc/150?img=9' },
];

// Sample upcoming events
const sampleEvents = [
  { id: 1, title: 'Weekly Team Meeting', date: '2023-10-15T14:00:00', location: 'Conference Room A' },
  { id: 2, title: 'Product Launch', date: '2023-10-20T10:00:00', location: 'Main Auditorium' },
  { id: 3, title: 'Design Workshop', date: '2023-10-25T09:00:00', location: 'Design Lab' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { addNotification, requestPermission } = useNotifications();
  const [stats, setStats] = useState(sampleStats);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Add a welcome notification
      addNotification({
        title: 'Welcome Back!',
        message: `Hello ${user?.name}, welcome back to your dashboard.`,
        type: 'info',
      });
      
      // Request notification permission
      requestPermission();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Show skeleton loader while loading
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4">
          <div className="h-10 w-64 bg-muted rounded animate-pulse"></div>
          <div className="h-6 w-96 bg-muted rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-muted rounded animate-pulse"></div>
          <div className="h-80 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your teams and projects today.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teamMembers}</div>
            <p className="text-xs text-muted-foreground">
              +4 new this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Next event in 2 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTasks}%</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Team Members and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Your team has {sampleTeamMembers.length} members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleTeamMembers.map(member => (
              <div key={member.id} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={member.avatarUrl} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/teams">View All Members</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="glass-card overflow-hidden">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              You have {sampleEvents.length} upcoming events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sampleEvents.map(event => (
              <div key={event.id} className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{event.title}</div>
                  <Badge variant="outline" className="text-xs">
                    {formatDate(event.date)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{event.location}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/events">View All Events</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
