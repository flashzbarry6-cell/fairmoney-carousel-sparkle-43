import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsCard } from '@/components/admin/StatsCard';
import { supabase } from '@/integrations/supabase/client';
import { Users, UserX, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  blockedUsers: number;
  pendingPayments: number;
  approvedPayments: number;
  rejectedPayments: number;
  totalVolume: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    blockedUsers: 0,
    pendingPayments: 0,
    approvedPayments: 0,
    rejectedPayments: 0,
    totalVolume: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch blocked users
        const { count: blockedUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_blocked', true);

        // Fetch pending payments
        const { count: pendingPayments } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        // Fetch approved payments
        const { count: approvedPayments } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        // Fetch rejected payments
        const { count: rejectedPayments } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rejected');

        // Fetch total volume (approved payments)
        const { data: volumeData } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'approved');

        const totalVolume = volumeData?.reduce((sum, p) => sum + p.amount, 0) || 0;

        setStats({
          totalUsers: totalUsers || 0,
          blockedUsers: blockedUsers || 0,
          pendingPayments: pendingPayments || 0,
          approvedPayments: approvedPayments || 0,
          rejectedPayments: rejectedPayments || 0,
          totalVolume
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-purple-300 mt-2">Overview of your Lumexzz Win platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Total Users"
            value={loading ? '...' : stats.totalUsers}
            icon={<Users className="h-6 w-6 text-purple-400" />}
          />
          <StatsCard
            title="Blocked Users"
            value={loading ? '...' : stats.blockedUsers}
            icon={<UserX className="h-6 w-6 text-red-400" />}
          />
          <StatsCard
            title="Pending Payments"
            value={loading ? '...' : stats.pendingPayments}
            icon={<Clock className="h-6 w-6 text-yellow-400" />}
          />
          <StatsCard
            title="Approved Payments"
            value={loading ? '...' : stats.approvedPayments}
            icon={<CheckCircle className="h-6 w-6 text-green-400" />}
          />
          <StatsCard
            title="Rejected Payments"
            value={loading ? '...' : stats.rejectedPayments}
            icon={<XCircle className="h-6 w-6 text-red-400" />}
          />
          <StatsCard
            title="Total Volume"
            value={loading ? '...' : formatCurrency(stats.totalVolume)}
            icon={<DollarSign className="h-6 w-6 text-green-400" />}
          />
        </div>

        <div className="bg-black/60 border border-purple-500/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/admin/users"
              className="p-4 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all"
            >
              <Users className="h-8 w-8 text-purple-400 mb-2" />
              <h3 className="text-white font-medium">Manage Users</h3>
              <p className="text-purple-300 text-sm">Block/Unblock users</p>
            </a>
            <a
              href="/admin/payments"
              className="p-4 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all"
            >
              <Clock className="h-8 w-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-medium">Pending Payments</h3>
              <p className="text-purple-300 text-sm">{stats.pendingPayments} awaiting review</p>
            </a>
            <a
              href="/admin/payments?status=approved"
              className="p-4 bg-purple-900/30 rounded-lg hover:bg-purple-900/50 transition-all"
            >
              <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
              <h3 className="text-white font-medium">Approved Payments</h3>
              <p className="text-purple-300 text-sm">View transaction history</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
