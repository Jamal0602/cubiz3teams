
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24 flex flex-col items-center text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-500">
            Teamz
          </span>
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl">
          The all-in-one platform for managing teams, projects, events, and workflows
        </p>
        <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-4">
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
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
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
            <div key={index} className="bg-card rounded-lg shadow-sm p-4 sm:p-6 border border-border hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
