import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Lock, Database, Zap, ArrowRight } from "lucide-react";
import OnboardingTour, { TourStep } from "@/components/tour/OnboardingTour";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Admin, Manager, and Viewer roles with granular permissions"
    },
    {
      icon: Database,
      title: "Dynamic Schema",
      description: "Create custom fields and templates for flexible project management"
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "OWASP-compliant with JWT authentication and audit logging"
    },
    {
      icon: Zap,
      title: "Microservice Ready",
      description: "Built with scalable architecture and security principles"
    }
  ];
  
  const tourSteps: TourStep[] = [
    {
      selector: '[data-tour="hero-title"]',
      title: 'Welcome to Secure Project Management',
      content: 'Get an overview of enterprise-grade features and security.'
    },
    {
      selector: '[data-tour="cta"]',
      title: 'Quick Start',
      content: 'Use these actions to sign in or get started instantly.'
    },
    {
      selector: '[data-tour="features"]',
      title: 'Core Capabilities',
      content: 'Flexible schema, RBAC, and microservice-ready architecture.'
    },
    {
      selector: '[data-tour="security"]',
      title: 'Security First',
      content: 'Built with OWASP guidelines, JWT auth, and audit logging.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-tour="hero-title">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Secure Project
            </span>
            <br />
            Management Platform
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Enterprise-grade project management with dynamic schema creation, 
            role-based access control, and microservice architecture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-tour="cta">
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="min-w-[200px]"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="min-w-[200px]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="min-w-[200px]"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tour="features">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security Notice */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto border-border/50 bg-card/80 backdrop-blur-sm" data-tour="security">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built following OWASP Top 10 security guidelines with parameterized SQL, 
                JWT authentication, CORS protection, and comprehensive audit logging.
              </p>
            </CardContent>
          </Card>
        </div>

        <OnboardingTour steps={tourSteps} autoStart storageKey="onboarding:v1" />
      </div>
    </div>
  );
};

export default Index;
