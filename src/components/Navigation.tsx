import { Button } from "@/components/ui/button";
import { BookOpen, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link, useLocation, useNavigate } from "react-router-dom";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If we're already on the home page, reload to reset state
      window.location.href = '/';
    } else {
      // Otherwise, just navigate to home
      navigate('/');
    }
  };

  return (
    <nav className="border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">VaultInjector</span>
          </a>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link to="/readme">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
