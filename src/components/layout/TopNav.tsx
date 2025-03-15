
import React from 'react';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';
import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface TopNavProps {
  className?: string;
  toggleSidebar?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ className, toggleSidebar }) => {
  const isMobile = useIsMobile();

  return (
    <header className={cn("h-12 sm:h-16 border-b border-border flex items-center px-2 sm:px-4 sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="flex-1 flex items-center">
        {toggleSidebar && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mr-2"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        )}
        
        {!isMobile && (
          <div className="relative w-48 sm:w-64 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full text-xs sm:text-sm pl-6 sm:pl-8 h-8 sm:h-9"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-1 sm:space-x-3">
        <ThemeToggle />
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default TopNav;
