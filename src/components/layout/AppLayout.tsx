
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RefactoredSidebarNav from './RefactoredSidebarNav';
import TopNav from './TopNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);

  // Update collapsed state when screen size changes
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Mobile menu toggle button
  const MobileMenuToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={toggleSidebar}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      
      <div className="flex flex-1 overflow-hidden">
        <RefactoredSidebarNav />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="md:hidden mb-4">
            <MobileMenuToggle />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
