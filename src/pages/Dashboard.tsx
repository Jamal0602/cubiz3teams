
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, FileText, Briefcase, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Welcome to Teamz</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Teams
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your teams</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm"
              onClick={() => navigate('/teams')}
            >
              View Teams
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Briefcase className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Projects
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm"
              onClick={() => navigate('/projects')}
            >
              View Projects
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Events
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Manage events and workshops</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm"
              onClick={() => navigate('/events')}
            >
              View Calendar
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Analytics
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">View team and project analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Bell className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">View your notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full text-xs sm:text-sm"
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
