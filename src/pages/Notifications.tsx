
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Bell, X, Info, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CubeLoader } from '@/components/ui/cube-loader';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_notifications')
        .select(`
          id,
          read,
          created_at,
          notification:notification_id (
            id,
            title,
            content,
            type,
            created_at
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      toast.success('Notification marked as read');
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications
        .filter(notification => !notification.read)
        .map(notification => notification.id);
      
      if (unreadIds.length === 0) return;
      
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .in('id', unreadIds);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-purple-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <CubeLoader size="lg" text="Loading notifications..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with the latest news and activities</p>
        </div>
        
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            onClick={markAllAsRead}
            className="mt-4 sm:mt-0"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Bell className="mx-auto h-12 w-12 text-muted-foreground opacity-40 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Notifications</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don't have any notifications at the moment. When you receive notifications, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`transition-colors ${!notification.read ? 'bg-primary-foreground/10' : ''}`}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-muted">
                    {getNotificationIcon(notification.notification?.type || 'default')}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg">
                        {notification.notification?.title || 'Notification'}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(notification.created_at)}
                        </Badge>
                        
                        {!notification.read && (
                          <Badge className="bg-primary text-primary-foreground">New</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">
                      {notification.notification?.content || 'No content'}
                    </p>
                    
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                        className="mt-2"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
