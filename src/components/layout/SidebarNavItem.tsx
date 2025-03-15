
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}

const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ to, icon, label, collapsed = false }) => {
  const isMobile = useIsMobile();
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-2 px-2 py-2 rounded-md transition-colors",
        "hover:bg-muted group",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground",
        collapsed && !isMobile ? "justify-center" : "",
      )}
    >
      <span className={cn(
        "flex-shrink-0",
        collapsed && !isMobile ? "w-6 h-6" : "w-5 h-5"
      )}>
        {icon}
      </span>
      
      {(!collapsed || isMobile) && (
        <span className="text-sm">{label}</span>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
