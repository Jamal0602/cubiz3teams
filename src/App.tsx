
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import AppLayout from "@/components/layout/AppLayout";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AuthCallback from "@/pages/AuthCallback";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Teams from "@/pages/Teams";
import Projects from "@/pages/Projects";
import Events from "@/pages/Events";
import Analytics from "@/pages/Analytics";
import Notifications from "@/pages/Notifications";
import NotFound from "@/pages/NotFound";
import VerificationPending from "@/pages/VerificationPending";
import AdminDashboard from "@/pages/AdminDashboard";
import Settings from "@/pages/Settings";
import Community from "@/pages/Community";
import Files from "@/pages/Files";
import AIHelp from "@/pages/AIHelp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/verification-pending" element={<VerificationPending />} />
                
                {/* All routes now accessible to everyone */}
                <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
                <Route path="/teams" element={<AppLayout><Teams /></AppLayout>} />
                <Route path="/projects" element={<AppLayout><Projects /></AppLayout>} />
                <Route path="/events" element={<AppLayout><Events /></AppLayout>} />
                <Route path="/analytics" element={<AppLayout><Analytics /></AppLayout>} />
                <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />
                <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
                <Route path="/community" element={<AppLayout><Community /></AppLayout>} />
                <Route path="/files" element={<AppLayout><Files /></AppLayout>} />
                <Route path="/ai-help" element={<AppLayout><AIHelp /></AppLayout>} />
                <Route path="/admin" element={<AppLayout><AdminDashboard /></AppLayout>} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
