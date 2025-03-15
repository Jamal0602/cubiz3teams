
import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import { cn } from '@/lib/utils';
import { Wifi, WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children 
}) => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [offlineSince, setOfflineSince] = React.useState<Date | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const isMobile = useIsMobile();

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineSince(null);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(new Date());
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Auto-collapse sidebar on mobile
    if (isMobile) {
      setSidebarCollapsed(true);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen w-full">
      <SidebarNav collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNav toggleSidebar={toggleSidebar} />
        {!isOnline && (
          <div className="bg-yellow-100 dark:bg-yellow-900/40 px-2 sm:px-4 py-2 text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 flex items-center">
            <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            <span className="truncate">
              You are currently offline. Changes will be saved locally.
            </span>
          </div>
        )}
        <main className={cn(
          "flex-1 overflow-auto",
          "transition-all duration-300 ease-in-out"
        )}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
