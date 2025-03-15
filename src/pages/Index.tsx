
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Teamz" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Teamz</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{currentTime}</span>
          </div>
          {isAuthenticated ? (
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
            Teamz
          </span>
        </h1>
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl">
          The all-in-one platform for managing teams, projects, events, and workflows
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button size="lg" onClick={() => navigate("/login")}>
                Get Started
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
                Learn More
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Team Management",
              description: "Create and manage teams with role-based access control"
            },
            {
              title: "Project Tracking",
              description: "Plan, track, and manage projects with ease"
            },
            {
              title: "Event Scheduling",
              description: "Schedule and manage events and workshops"
            },
            {
              title: "Real-Time Chat",
              description: "Communicate with team members in real-time"
            },
            {
              title: "Analytics",
              description: "Gain insights into team and project performance"
            },
            {
              title: "File Sharing",
              description: "Share and manage documents securely"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-card rounded-lg shadow-sm p-6 border border-border">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
