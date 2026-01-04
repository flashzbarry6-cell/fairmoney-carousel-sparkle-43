import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAdminNotifications, AdminNotification } from '@/hooks/useAdminNotifications';
import { 
  Bell, 
  CreditCard, 
  UserPlus, 
  ArrowDownCircle,
  Check,
  Clock,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

type FilterType = 'all' | 'pending_payment' | 'new_user' | 'withdrawal_request';

const AdminNotifications = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    markAsResolved 
  } = useAdminNotifications();
  const [filter, setFilter] = useState<FilterType>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return <CreditCard className="h-5 w-5" />;
      case 'new_user':
        return <UserPlus className="h-5 w-5" />;
      case 'withdrawal_request':
        return <ArrowDownCircle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pending_payment':
        return 'Pending Payment';
      case 'new_user':
        return 'New User';
      case 'withdrawal_request':
        return 'Withdrawal';
      default:
        return type;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleNotificationClick = async (notification: AdminNotification) => {
    await markAsRead(notification.id);
    
    if (notification.type === 'pending_payment' && notification.reference_id) {
      navigate(`/admin/payments?highlight=${notification.reference_id}`);
    } else if (notification.type === 'new_user') {
      navigate('/admin/users');
    }
  };

  const filteredNotifications = notifications
    .filter(n => filter === 'all' || n.type === filter)
    .sort((a, b) => {
      // High priority first
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      // Then by date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const filterTabs: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'all', count: notifications.length },
    { label: 'Pending Payments', value: 'pending_payment', count: notifications.filter(n => n.type === 'pending_payment').length },
    { label: 'New Users', value: 'new_user', count: notifications.filter(n => n.type === 'new_user').length },
    { label: 'Withdrawals', value: 'withdrawal_request', count: notifications.filter(n => n.type === 'withdrawal_request').length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Bell className="h-8 w-8 text-purple-500" />
              Notifications
            </h1>
            <p className="text-purple-300 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              variant="outline"
              className="border-purple-500/50 text-purple-300 hover:bg-purple-900/30"
            >
              <Check className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
              }`}
            >
              {tab.label}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-black/30 text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" />
              <p className="text-purple-300 mt-4">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-purple-900/20 rounded-xl border border-purple-500/30">
              <Bell className="h-12 w-12 text-purple-500/50 mx-auto mb-4" />
              <p className="text-purple-300">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  notification.priority === 'high'
                    ? 'bg-gradient-to-r from-red-900/30 to-orange-900/20 border-red-500/50 hover:border-red-500'
                    : notification.is_read
                    ? 'bg-purple-900/10 border-purple-500/20 hover:border-purple-500/40'
                    : 'bg-purple-900/30 border-purple-500/40 hover:border-purple-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${
                    notification.priority === 'high'
                      ? 'bg-red-900/50 text-red-400'
                      : notification.type === 'pending_payment'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : notification.type === 'new_user'
                      ? 'bg-green-900/50 text-green-400'
                      : 'bg-purple-900/50 text-purple-400'
                  }`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        notification.priority === 'high'
                          ? 'bg-red-500/20 text-red-400 font-bold'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {getTypeLabel(notification.type)}
                      </span>
                      {notification.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-500 text-white font-bold animate-pulse">
                          HIGH PRIORITY
                        </span>
                      )}
                      {!notification.is_read && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <p className={`text-sm ${
                      notification.priority === 'high' ? 'text-white font-semibold' : 'text-purple-200'
                    }`}>
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-purple-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </span>
                      {notification.amount && (
                        <span className="font-semibold text-yellow-400">
                          {formatCurrency(notification.amount)}
                        </span>
                      )}
                      {notification.user_email && (
                        <span className="truncate max-w-[200px]">
                          {notification.user_email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  {notification.is_resolved && (
                    <span className="px-2 py-1 text-xs rounded bg-green-900/50 text-green-400">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
