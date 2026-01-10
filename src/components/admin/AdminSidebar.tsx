import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  LogOut,
  Shield,
  Bell,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

const menuItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Payments', url: '/admin/payments', icon: CreditCard },
  { title: 'Notifications', url: '/admin/notifications', icon: Bell },
  { title: 'Withdrawal Settings', url: '/admin/withdrawal-settings', icon: Settings },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { unreadCount } = useAdminNotifications();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully"
    });
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-black border-r border-purple-500/30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-purple-500" />
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-purple-400">Lumexzz Win</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url;
            const isNotifications = item.title === 'Notifications';
            return (
              <button
                key={item.title}
                onClick={() => navigate(item.url)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : 'text-purple-300 hover:bg-purple-900/50 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium flex-1 text-left">{item.title}</span>
                {isNotifications && unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/30 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
