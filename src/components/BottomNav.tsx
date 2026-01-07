import { Link, useLocation } from "react-router-dom";
import { Home, Activity as ActivityIcon, Banknote, User } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/activity', icon: ActivityIcon, label: 'Activity' },
    { path: '/loan', icon: Banknote, label: 'Loans' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glow line at top */}
      <div className="phoenix-glow-line top-0" />
      
      {/* Nav container with glassmorphism */}
      <div className="bg-card/95 backdrop-blur-xl border-t border-primary/20">
        <div className="max-w-md mx-auto flex justify-around py-3 px-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className="flex flex-col items-center space-y-1.5 flex-1 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive(item.path) 
                  ? 'bg-gradient-to-br from-primary to-primary-dark shadow-neon' 
                  : 'bg-muted/50 group-hover:bg-muted'
              }`}>
                <item.icon className={`w-5 h-5 transition-colors duration-300 ${
                  isActive(item.path) ? 'text-white' : 'text-muted-foreground group-hover:text-primary-light'
                }`} />
              </div>
              <span className={`text-[11px] font-medium transition-colors duration-300 ${
                isActive(item.path) ? 'text-primary glow-text' : 'text-muted-foreground group-hover:text-foreground'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
