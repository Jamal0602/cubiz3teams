
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, Briefcase, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-36 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Welcome, {profile.full_name}</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Users className="mr-2 h-5 w-5 text-primary" />
              Teams
            </CardTitle>
            <CardDescription>Manage your teams</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/teams')}
            >
              View Teams
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Briefcase className="mr-2 h-5 w-5 text-primary" />
              Projects
            </CardTitle>
            <CardDescription>Manage your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Events
            </CardTitle>
            <CardDescription>Manage events and workshops</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/events')}
            >
              View Calendar
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription>View team and project analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>View your notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/notifications')}
            >
              View Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
