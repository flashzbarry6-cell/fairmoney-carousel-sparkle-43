import { Link, useLocation } from "react-router-dom";
import { Home, Activity as ActivityIcon, Banknote, User } from "lucide-react";

export const BottomNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gold/20 z-50">
      <div className="max-w-md mx-auto flex justify-around py-2 px-2">
        <Link to="/dashboard" className="flex flex-col items-center space-y-1 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive('/dashboard') 
              ? 'bg-gradient-to-br from-gold to-gold-dark' 
              : 'bg-gray-800'
          }`}>
            <Home className={`w-4 h-4 ${isActive('/dashboard') ? 'text-black' : 'text-gray-400'}`} />
          </div>
          <span className={`text-[10px] font-medium ${
            isActive('/dashboard') ? 'text-gold' : 'text-gray-500'
          }`}>Home</span>
        </Link>
        
        <Link to="/activity" className="flex flex-col items-center space-y-1 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive('/activity') 
              ? 'bg-gradient-to-br from-gold to-gold-dark' 
              : 'bg-gray-800'
          }`}>
            <ActivityIcon className={`w-4 h-4 ${isActive('/activity') ? 'text-black' : 'text-gray-400'}`} />
          </div>
          <span className={`text-[10px] font-medium ${
            isActive('/activity') ? 'text-gold' : 'text-gray-500'
          }`}>Activity</span>
        </Link>
        
        <Link to="/loan" className="flex flex-col items-center space-y-1 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive('/loan') 
              ? 'bg-gradient-to-br from-gold to-gold-dark' 
              : 'bg-gray-800'
          }`}>
            <Banknote className={`w-4 h-4 ${isActive('/loan') ? 'text-black' : 'text-gray-400'}`} />
          </div>
          <span className={`text-[10px] font-medium ${
            isActive('/loan') ? 'text-gold' : 'text-gray-500'
          }`}>Loans</span>
        </Link>
        
        <Link to="/profile" className="flex flex-col items-center space-y-1 flex-1">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isActive('/profile') 
              ? 'bg-gradient-to-br from-gold to-gold-dark' 
              : 'bg-gray-800'
          }`}>
            <User className={`w-4 h-4 ${isActive('/profile') ? 'text-black' : 'text-gray-400'}`} />
          </div>
          <span className={`text-[10px] font-medium ${
            isActive('/profile') ? 'text-gold' : 'text-gray-500'
          }`}>Profile</span>
        </Link>
      </div>
    </div>
  );
};
