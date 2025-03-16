
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import AppLayout from "@/components/layout/AppLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

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
import AdminDashboard from "@/pages/AdminDashboard";
import Settings from "@/pages/Settings";
import Community from "@/pages/Community";
import Files from "@/pages/Files";
import AIHelp from "@/pages/AIHelp";
import VerificationPending from "@/pages/VerificationPending";
import Login from "@/pages/Login";

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
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/verification-pending" element={<VerificationPending />} />
                </Route>
                
                {/* App routes - protected by ProtectedRoute */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AppLayout><Dashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute requireVerification={false}>
                    <AppLayout><Profile /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/teams" element={
                  <ProtectedRoute>
                    <AppLayout><Teams /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/projects" element={
                  <ProtectedRoute>
                    <AppLayout><Projects /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/events" element={
                  <ProtectedRoute>
                    <AppLayout><Events /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <AppLayout><Analytics /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <AppLayout><Notifications /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute requireVerification={false}>
                    <AppLayout><Settings /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute requireVerification={false}>
                    <AppLayout><Community /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/files" element={
                  <ProtectedRoute>
                    <AppLayout><Files /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/ai-help" element={
                  <ProtectedRoute>
                    <AppLayout><AIHelp /></AppLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AppLayout><AdminDashboard /></AppLayout>
                  </ProtectedRoute>
                } />
                
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
