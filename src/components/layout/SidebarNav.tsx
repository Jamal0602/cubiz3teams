
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderKanban,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  ShieldAlert,
  Bug,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!profile) return null;

  const isAdmin = profile.role === 'admin';
  const isManagerOrAdmin = profile.role === 'manager' || profile.role === 'admin';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      exact: true,
      show: true,
    },
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: ShieldAlert,
      exact: false,
      show: isAdmin,
    },
    {
      name: 'Teams',
      href: '/teams',
      icon: Users,
      exact: false,
      show: true,
    },
    {
      name: 'Events',
      href: '/events',
      icon: Calendar,
      exact: false,
      show: true,
    },
    {
      name: 'Projects',
      href: '/projects',
      icon: FolderKanban,
      exact: false,
      show: true,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      exact: false,
      show: isManagerOrAdmin,
    },
    {
      name: 'Community',
      href: '/community',
      icon: Users,
      exact: false,
      show: true,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: UserCircle,
      exact: false,
      show: true,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      exact: false,
      show: true,
    },
  ];

  const filteredNavigation = navigation.filter(item => item.show);

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 h-16">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
              T
            </div>
            <h1 className="font-bold text-lg">Teamz</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Separator className="bg-sidebar-border" />

      {!collapsed && (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 relative">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(profile.full_name)}
              </AvatarFallback>
              {profile.verified && (
                <Badge className="absolute -bottom-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary">
                  <Star className="h-3 w-3 text-white" />
                </Badge>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium">{profile.full_name}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">{profile.cubiz_id}</p>
                <Badge variant="outline" className="h-4 text-[10px] bg-primary/10 text-primary px-1">
                  {profile.rank_points || 0} RP
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {filteredNavigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center"
                  )
                }
              >
                <item.icon className={cn("h-5 w-5", collapsed && "h-5 w-5")} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        <a 
          href="https://github.com/cubiz-app/issues/new" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
            collapsed && "justify-center"
          )}
        >
          <Bug className="h-5 w-5" />
          {!collapsed && <span>Report Issue</span>}
        </a>
        
        <div className={cn("mt-4 text-xs text-muted-foreground", collapsed && "hidden")}>
          <p>Teamz</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
