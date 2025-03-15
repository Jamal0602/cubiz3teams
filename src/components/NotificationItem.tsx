
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Clock, Info, AlertTriangle, X, CheckCircle, Bell } from 'lucide-react';

interface NotificationProps {
  notification: {
    id: string;
    read: boolean;
    created_at: string;
    notification: {
      id: string;
      title: string;
      content: string;
      type: string;
      created_at: string;
    };
  };
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onMarkAsRead }) => {
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

  return (
    <Card className={`transition-colors ${!notification.read ? 'bg-primary-foreground/10' : ''}`}>
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
                onClick={() => onMarkAsRead(notification.id)}
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
  );
};

export default NotificationItem;
