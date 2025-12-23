import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { History, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

interface SpinRecord {
  id: string;
  stake_amount: number;
  result: "win" | "lose";
  prize_amount: number;
  created_at: string;
}

interface SpinHistoryProps {
  refreshTrigger: number;
}

const SpinHistory = ({ refreshTrigger }: SpinHistoryProps) => {
  const [history, setHistory] = useState<SpinRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("spin_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data as SpinRecord[] || []);
    } catch (error) {
      console.error("Error fetching spin history:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-purple-700/30">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Spin History</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#222222] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-purple-700/30">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Spin History</h3>
        </div>
        <p className="text-gray-400 text-center py-8">No spins yet. Try your luck!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-purple-700/30">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-purple-400" />
        <h3 className="text-white font-semibold">Spin History</h3>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.map((record) => (
          <div
            key={record.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              record.result === "win"
                ? "bg-green-900/20 border border-green-500/30"
                : "bg-red-900/20 border border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-3">
              {record.result === "win" ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              <div>
                <p className={`font-semibold ${record.result === "win" ? "text-green-400" : "text-red-400"}`}>
                  {record.result === "win" ? "WON" : "LOST"}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(record.created_at), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-gray-400 text-sm">Stake: {formatCurrency(record.stake_amount)}</p>
              {record.result === "win" && (
                <p className="text-green-400 font-bold">+{formatCurrency(record.prize_amount)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpinHistory;
