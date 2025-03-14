
import React from 'react';
import { UserNotifications } from '@/components/NotificationSystem';

const Notifications = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
      <p className="text-muted-foreground mb-8">Stay updated with important information and announcements</p>
      
      <div className="max-w-3xl mx-auto">
        <UserNotifications />
      </div>
    </div>
  );
};

export default Notifications;
