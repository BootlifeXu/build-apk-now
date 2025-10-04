import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, Zap, Shield, Github } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6 animate-pulse">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Mobile App
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A beautiful, simple starter template ready to be customized
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast & Modern</h3>
            <p className="text-muted-foreground">
              Built with React and optimized for mobile performance
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-muted-foreground">
              Built with security best practices and modern standards
            </p>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Github className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Open Source</h3>
            <p className="text-muted-foreground">
              Fully customizable and ready to extend with your features
            </p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
          <p className="mt-6 text-sm text-muted-foreground">
            Ready to build something amazing?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
