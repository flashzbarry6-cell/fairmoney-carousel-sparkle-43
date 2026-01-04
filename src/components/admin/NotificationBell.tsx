import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export const NotificationBell = () => {
  const navigate = useNavigate();
  const { unreadCount } = useAdminNotifications();

  return (
    <button
      onClick={() => navigate('/admin/notifications')}
      className="relative p-2 rounded-lg bg-purple-900/30 hover:bg-purple-900/50 transition-all border border-purple-500/30"
    >
      <Bell className="h-6 w-6 text-purple-300" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};
