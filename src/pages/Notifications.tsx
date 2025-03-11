
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bell, Calendar, MessageSquare, FileText, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  notification_id: string;
  read: boolean;
  created_at: string;
  notification: {
    id: string;
    title: string;
    content: string;
    type: string;
    created_at: string;
    created_by: string;
  }
}

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_notifications')
          .select(`
            *,
            notification:notifications(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setNotifications(data || []);
      } catch (error: any) {
        console.error('Error fetching notifications:', error.message);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, [user, toast]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error: any) {
      console.error('Error marking notification as read:', error.message);
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-amber-500" />;
      case 'user':
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader className="p-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-4 text-lg font-medium">No notifications yet</p>
            <p className="text-muted-foreground">You'll see notifications about events, messages, and updates here</p>
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`mb-4 ${!notification.read ? 'border-l-4 border-l-primary' : ''}`}
            onClick={() => !notification.read && markAsRead(notification.id)}
          >
            <CardHeader className="p-4 flex flex-row items-start space-y-0">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getNotificationIcon(notification.notification.type)}
                  {notification.notification.title}
                </CardTitle>
                <CardDescription>
                  {new Date(notification.created_at).toLocaleString()}
                </CardDescription>
              </div>
              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-primary" />
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p>{notification.notification.content}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default Notifications;
