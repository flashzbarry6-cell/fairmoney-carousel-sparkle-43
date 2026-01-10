import { useEffect, useState, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Settings, Zap, AlertTriangle, CheckCircle, Clock, RotateCcw, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Deduction {
  id: string;
  user_id: string;
  amount: number;
  deduction_type: string;
  reason: string;
  balance_before: number;
  balance_after: number;
  transaction_hash: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

const AdminWithdrawalSettings = () => {
  const [autoDeductEnabled, setAutoDeductEnabled] = useState(false);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [reversingId, setReversingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('setting_key', 'auto_deduct_on_withdraw')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setAutoDeductEnabled((data.setting_value as any)?.enabled || false);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  const fetchDeductions = useCallback(async () => {
    try {
      const { data: deductionsData, error } = await supabase
        .from('balance_deductions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Fetch user profiles
      const userIds = [...new Set(deductionsData?.map(d => d.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const deductionsWithUsers = deductionsData?.map(d => ({
        ...d,
        user_name: profileMap.get(d.user_id)?.full_name || 'N/A',
        user_email: profileMap.get(d.user_id)?.email || 'N/A'
      })) || [];

      setDeductions(deductionsWithUsers);
    } catch (error) {
      console.error('Error fetching deductions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchDeductions();
  }, [fetchSettings, fetchDeductions]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('admin-deductions-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'balance_deductions' }, () => {
        fetchDeductions();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchDeductions, fetchSettings]);

  const handleToggle = async (enabled: boolean) => {
    setToggling(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ 
          setting_value: { enabled },
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', 'auto_deduct_on_withdraw');

      if (error) throw error;

      setAutoDeductEnabled(enabled);
      toast({
        title: enabled ? "Auto Deduction Enabled" : "Auto Deduction Disabled",
        description: enabled 
          ? "Amounts will be deducted when users continue to withdraw" 
          : "No deductions will occur on continue button",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setToggling(false);
    }
  };

  const handleReverseDeduction = async (deduction: Deduction) => {
    setReversingId(deduction.id);
    try {
      // Add back the amount to user's balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', deduction.user_id)
        .single();

      if (!profile) throw new Error('User profile not found');

      const newBalance = profile.balance + deduction.amount;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', deduction.user_id);

      if (updateError) throw updateError;

      // Log the reversal
      const { error: logError } = await supabase
        .from('balance_deductions')
        .insert({
          user_id: deduction.user_id,
          amount: -deduction.amount,
          deduction_type: 'manual_reversal',
          reason: `Reversal of transaction ${deduction.transaction_hash}`,
          balance_before: profile.balance,
          balance_after: newBalance,
          transaction_hash: `REV-${deduction.transaction_hash}`
        });

      if (logError) throw logError;

      toast({
        title: "Deduction Reversed",
        description: `₦${deduction.amount.toLocaleString()} has been credited back`,
      });

      fetchDeductions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reverse deduction",
        variant: "destructive"
      });
    } finally {
      setReversingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment_approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'payment_rejected':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'withdrawal_continue':
        return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'manual_reversal':
        return <RotateCcw className="h-4 w-4 text-blue-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      payment_approved: 'bg-green-900/50 text-green-300',
      payment_rejected: 'bg-red-900/50 text-red-300',
      withdrawal_continue: 'bg-yellow-900/50 text-yellow-300',
      manual_reversal: 'bg-blue-900/50 text-blue-300'
    };

    const labels: Record<string, string> = {
      payment_approved: 'Post-Approval',
      payment_rejected: 'Post-Rejection',
      withdrawal_continue: 'Auto Deduct',
      manual_reversal: 'Reversal'
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[type] || 'bg-gray-900/50 text-gray-300'}`}>
        {getTypeIcon(type)}
        {labels[type] || type}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Withdrawal Settings</h1>
          <p className="text-purple-300 mt-2">Configure withdrawal deduction behavior</p>
        </div>

        {/* Main Toggle Card */}
        <div className="bg-gradient-to-br from-purple-900/50 to-black/50 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                autoDeductEnabled 
                  ? 'bg-green-500/20 shadow-lg shadow-green-500/20' 
                  : 'bg-red-500/20 shadow-lg shadow-red-500/20'
              }`}>
                <Zap className={`w-7 h-7 ${autoDeductEnabled ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Auto Deduct On Withdrawal Continue</h2>
                <p className="text-purple-300 text-sm mt-1">
                  {autoDeductEnabled 
                    ? '🟢 ON: Amounts are instantly deducted when users click "Continue to Withdraw"' 
                    : '🔴 OFF: No deductions occur - users are redirected to bank registration only'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {toggling && <Loader2 className="h-5 w-5 animate-spin text-purple-400" />}
              <Switch
                checked={autoDeductEnabled}
                onCheckedChange={handleToggle}
                disabled={toggling}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`mt-6 p-4 rounded-xl border ${
            autoDeductEnabled 
              ? 'bg-green-900/20 border-green-500/30' 
              : 'bg-red-900/20 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                autoDeductEnabled ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={autoDeductEnabled ? 'text-green-300' : 'text-red-300'}>
                {autoDeductEnabled 
                  ? 'Auto deduction is ACTIVE - withdrawal amounts will be reserved instantly' 
                  : 'Safe mode ACTIVE - no automatic deductions will occur'}
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/60 border border-green-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-medium">When ON (Auto Deduction)</h3>
            </div>
            <ul className="space-y-2 text-green-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>User clicks "Continue to Withdraw"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Amount instantly deducted from balance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>User redirected to bank registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>Animated confirmation shown</span>
              </li>
            </ul>
          </div>

          <div className="bg-black/60 border border-red-500/30 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-white font-medium">When OFF (Safe Mode)</h3>
            </div>
            <ul className="space-y-2 text-red-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>User clicks "Continue to Withdraw"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>NO amount deducted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>User redirected to bank registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Info text: "Complete bank setup to proceed"</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Deduction History */}
        <div className="bg-black/60 border border-purple-500/30 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-purple-500/30">
            <h2 className="text-xl font-semibold text-white">Deduction History</h2>
            <p className="text-purple-300 text-sm">All balance deductions across the platform</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : deductions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Settings className="h-12 w-12 text-purple-400 mb-4" />
              <h3 className="text-white font-medium">No deductions yet</h3>
              <p className="text-purple-300 text-sm">Deductions will appear here when processed</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-purple-500/30 hover:bg-purple-900/20">
                  <TableHead className="text-purple-300">User</TableHead>
                  <TableHead className="text-purple-300">Amount</TableHead>
                  <TableHead className="text-purple-300">Type</TableHead>
                  <TableHead className="text-purple-300">Balance Change</TableHead>
                  <TableHead className="text-purple-300">Date</TableHead>
                  <TableHead className="text-purple-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deductions.map((deduction) => (
                  <TableRow key={deduction.id} className="border-purple-500/30 hover:bg-purple-900/20">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{deduction.user_name}</p>
                        <p className="text-purple-400 text-sm">{deduction.user_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className={deduction.amount > 0 ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
                      {deduction.amount > 0 ? '-' : '+'}{formatCurrency(deduction.amount)}
                    </TableCell>
                    <TableCell>{getTypeBadge(deduction.deduction_type)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-gray-400">{formatCurrency(deduction.balance_before)}</span>
                        <span className="text-purple-400 mx-1">→</span>
                        <span className="text-white">{formatCurrency(deduction.balance_after)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-purple-300">{format(new Date(deduction.created_at), 'MMM dd, yyyy')}</p>
                        <p className="text-purple-400 text-sm">{format(new Date(deduction.created_at), 'HH:mm')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {deduction.deduction_type !== 'manual_reversal' && deduction.amount > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReverseDeduction(deduction)}
                          disabled={reversingId === deduction.id}
                          className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 gap-1"
                        >
                          {reversingId === deduction.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <RotateCcw className="h-4 w-4" />
                              Reverse
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminWithdrawalSettings;