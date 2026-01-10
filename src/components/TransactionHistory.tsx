import { X, Clock, Gift, ArrowUpCircle, ArrowDownCircle, Zap, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Transaction {
  id: string;
  type: 'bonus' | 'deduction' | 'reversal' | 'credit';
  amount: number;
  description: string;
  time: string;
  status: string;
  transaction_hash?: string;
}

export const TransactionHistory = ({ isOpen, onClose }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Fetch deductions from database
        const { data: deductions, error } = await supabase
          .from('balance_deductions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching deductions:', error);
        }

        // Convert deductions to transactions
        const dbTransactions: Transaction[] = (deductions || []).map(d => ({
          id: d.id,
          type: d.deduction_type === 'manual_reversal' ? 'reversal' : 'deduction',
          amount: Math.abs(d.amount),
          description: d.reason || getDeductionLabel(d.deduction_type),
          time: new Date(d.created_at).toLocaleString(),
          status: 'completed',
          transaction_hash: d.transaction_hash
        }));

        // Also check localStorage for bonuses
        const localBonuses = JSON.parse(localStorage.getItem('activityHistory') || '[]');
        const bonusTransactions: Transaction[] = localBonuses.map((b: any, index: number) => ({
          id: `bonus-${index}`,
          type: 'bonus' as const,
          amount: b.amount,
          description: b.description || 'Bonus',
          time: new Date(b.timestamp).toLocaleString(),
          status: 'claimed'
        }));

        // Combine and sort by time
        const allTransactions = [...dbTransactions, ...bonusTransactions]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 30);

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isOpen]);

  const getDeductionLabel = (type: string): string => {
    switch (type) {
      case 'payment_approved': return 'Post-Approval Deduction';
      case 'payment_rejected': return 'Post-Rejection Deduction';
      case 'withdrawal_continue': return 'Withdrawal Processing';
      case 'manual_reversal': return 'Amount Reversed';
      default: return 'Balance Adjustment';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'bonus':
        return <Gift className="w-5 h-5 text-primary" />;
      case 'deduction':
        return <Zap className="w-5 h-5 text-red-400" />;
      case 'reversal':
        return <RotateCcw className="w-5 h-5 text-blue-400" />;
      case 'credit':
        return <ArrowUpCircle className="w-5 h-5 text-green-400" />;
      default:
        return <ArrowDownCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAmountColor = (type: string) => {
    switch (type) {
      case 'bonus':
      case 'credit':
      case 'reversal':
        return 'text-green-500';
      case 'deduction':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusStyle = (status: string, type: string) => {
    if (type === 'deduction') {
      return 'text-red-600 bg-red-100';
    }
    if (type === 'reversal') {
      return 'text-blue-600 bg-blue-100';
    }
    return status === "claimed" || status === "completed"
      ? "text-green-600 bg-green-100" 
      : "text-yellow-600 bg-yellow-100";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-3xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-top-4 duration-300 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Transaction History</h2>
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transaction history yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-2xl transition-all hover:bg-muted/50">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'deduction' ? 'bg-red-500/10' : 
                    tx.type === 'reversal' ? 'bg-blue-500/10' : 
                    'bg-primary/10'
                  }`}>
                    {getIcon(tx.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{tx.description}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{tx.time}</span>
                    </div>
                    {tx.transaction_hash && (
                      <p className="text-xs text-purple-400 truncate mt-1">
                        {tx.transaction_hash}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm ${getAmountColor(tx.type)}`}>
                      {tx.type === 'deduction' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(tx.status, tx.type)}`}>
                      {tx.type === 'deduction' ? 'Deducted' : 
                       tx.type === 'reversal' ? 'Reversed' : 
                       tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};