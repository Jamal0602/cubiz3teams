
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserNotifications } from '@/components/NotificationSystem';
import { Bell, CheckAll, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const Notifications = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with important information and announcements</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CheckAll className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-xl">
                <Bell className="h-5 w-5 mr-2" />
                Your Notifications
              </CardTitle>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                <TabsList className="grid grid-cols-3 w-[280px]">
                  <TabsTrigger value="all" className="flex items-center">
                    All
                    <Badge className="ml-2 bg-primary/20 text-primary" variant="secondary">12</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex items-center">
                    Unread
                    <Badge className="ml-2 bg-primary/20 text-primary" variant="secondary">5</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="mentions" className="flex items-center">
                    Mentions
                    <Badge className="ml-2 bg-primary/20 text-primary" variant="secondary">2</Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <UserNotifications />
          </CardContent>
        </Card>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium">Browser Notifications</h3>
                  <p className="text-sm text-muted-foreground">Show notifications in your browser</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-md font-medium">Clear All Notifications</h3>
                  <p className="text-sm text-muted-foreground">Delete all notification history</p>
                </div>
                <Button variant="destructive" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
