import { useEffect, useState } from "react";
import { X, Download, Clock, Plus, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHistory = ({ isOpen, onClose }: Props) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTransactions(data || []);
      } catch (err) {
        console.error('Failed to fetch transactions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-black text-white rounded-t-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-300">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-gray-400">No transactions yet.</div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {transactions.map((tx: any) => {
              const time = tx.created_at ? new Date(tx.created_at).toLocaleString() : '';
              const amount = tx.amount ? Number(tx.amount).toLocaleString() : '0';
              let icon = <Plus className="w-5 h-5" />;
              let tagBg = "bg-gray-800 text-gray-200";

              if (tx.type === 'bonus') {
                icon = <Plus className="w-5 h-5" />;
                tagBg = "bg-green-800 text-green-200";
              } else if (tx.type === 'referral') {
                icon = <Download className="w-5 h-5" />;
                tagBg = "bg-blue-800 text-blue-200";
              } else if (tx.type === 'withdrawal') {
                icon = <ArrowUp className="w-5 h-5" />;
                tagBg = "bg-red-800 text-red-200";
              }

              return (
                <div key={tx.id} className="flex items-center justify-between bg-gray-900 rounded-xl p-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tagBg}`}>
                      {icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{tx.description || tx.type}</div>
                      <div className="text-xs text-gray-400">{time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">₦{amount}.00</div>
                    <div className="text-xs text-gray-400">{tx.type}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4">
          <button onClick={onClose} className="w-full py-3 rounded-full bg-gold text-black font-semibold">Close</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
