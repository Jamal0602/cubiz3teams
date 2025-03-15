
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TopNavProps {
  className?: string;
}

const TopNav: React.FC<TopNavProps> = ({ className }) => {
  return (
    <header className={cn("h-16 border-b border-border flex items-center px-4 sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
      <div className="flex-1 flex items-center">
        <div className="relative w-64 max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full pl-8 h-9 md:w-64 lg:w-80"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default TopNav;
