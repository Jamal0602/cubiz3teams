
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Calendar, 
  BarChart, 
  Bell, 
  Settings,
  MessagesSquare,
  FileText,
  Bot
} from 'lucide-react';
import SidebarNavItem from './SidebarNavItem';

interface SidebarNavProps {
  collapsed?: boolean;
}

const RefactoredSidebarNav: React.FC<SidebarNavProps> = ({ collapsed = false }) => {
  const isMobile = useIsMobile();
  
  const navItems = [
    { to: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
    { to: '/teams', icon: <Users />, label: 'Teams' },
    { to: '/projects', icon: <FolderKanban />, label: 'Projects' },
    { to: '/events', icon: <Calendar />, label: 'Events' },
    { to: '/analytics', icon: <BarChart />, label: 'Analytics' },
    { to: '/community', icon: <MessagesSquare />, label: 'Community' },
    { to: '/files', icon: <FileText />, label: 'Files' },
    { to: '/ai-help', icon: <Bot />, label: 'AI Help' },
    { to: '/notifications', icon: <Bell />, label: 'Notifications' },
    { to: '/settings', icon: <Settings />, label: 'Settings' },
  ];
  
  return (
    <div
      className={cn(
        "py-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto",
        collapsed && !isMobile ? "w-[70px]" : "w-[240px]"
      )}
    >
      <nav className="space-y-1 px-2">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            collapsed={collapsed}
          />
        ))}
      </nav>
    </div>
  );
};

export default RefactoredSidebarNav;
