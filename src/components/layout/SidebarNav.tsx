
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Star,
  Clock,
  LogOut,
  FileText,
  Share2,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TeamzLogo } from '@/components/ui/teamz-logo';

interface SidebarNavProps {
  className?: string;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ className }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

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

  const handleLogout = async () => {
    await logout();
    navigate('/');
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
      name: 'File Sharing',
      href: '/files',
      icon: Share2,
      exact: false,
      show: true,
    },
    {
      name: 'AI Assistant',
      href: '/ai-help',
      icon: Sparkles,
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
          <TeamzLogo size="md" variant="full" />
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
          
          <div className="mt-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span>
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
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground w-full",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
        
        <a 
          href="https://github.com/cubiz-app/issues/new" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mt-2",
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
