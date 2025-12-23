import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, Info, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import SpinWheel from "@/components/SpinWheel";
import SpinHistory from "@/components/SpinHistory";
import SpinResultModal from "@/components/SpinResultModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Configuration - easily adjustable
const STAKE_OPTIONS = [50000, 100000, 150000, 200000];
const MIN_STAKE = 50000;
const MAX_STAKE = 200000;

const SpinAndWin = () => {
  const [balance, setBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(50000);
  const [customStake, setCustomStake] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [spinResult, setSpinResult] = useState<"win" | "lose" | null>(null);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to play");
        return;
      }
      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setBalance(profile?.balance || 0);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error loading profile");
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

  const handleStakeSelect = (amount: number) => {
    setStakeAmount(amount);
    setCustomStake("");
  };

  const handleCustomStakeChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;
    setCustomStake(value);
    if (numValue >= MIN_STAKE && numValue <= MAX_STAKE) {
      setStakeAmount(numValue);
    }
  };

  const validateAndSpin = () => {
    if (balance < stakeAmount) {
      toast.error("Insufficient balance");
      return;
    }
    if (stakeAmount < MIN_STAKE || stakeAmount > MAX_STAKE) {
      toast.error(`Stake must be between ${formatCurrency(MIN_STAKE)} and ${formatCurrency(MAX_STAKE)}`);
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSpin = async () => {
    setShowConfirmModal(false);
    
    if (!userId) {
      toast.error("Please login to play");
      return;
    }

    // Deduct stake immediately
    try {
      const newBalance = balance - stakeAmount;
      const { error } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("user_id", userId);

      if (error) throw error;
      setBalance(newBalance);
    } catch (error) {
      console.error("Error deducting stake:", error);
      toast.error("Error processing stake");
      return;
    }
  };

  const handleSpinComplete = async (result: "win" | "lose", prize: number) => {
    setSpinResult(result);
    setPrizeAmount(prize);

    if (!userId) return;

    try {
      // If won, credit the prize
      if (result === "win" && prize > 0) {
        const newBalance = balance + prize;
        const { error: balanceError } = await supabase
          .from("profiles")
          .update({ balance: newBalance })
          .eq("user_id", userId);

        if (balanceError) throw balanceError;
        setBalance(newBalance);
      }

      // Record spin in history
      const { error: historyError } = await supabase
        .from("spin_history")
        .insert({
          user_id: userId,
          stake_amount: stakeAmount,
          result: result,
          prize_amount: prize,
        });

      if (historyError) throw historyError;
      
      setHistoryRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error recording spin:", error);
    }

    setShowResultModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#121212] to-[#0B0B0B] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-purple-700/30">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-xl font-bold text-white">Spin & Win</h1>
          </div>
          
          {/* Balance Display */}
          <div className="flex items-center gap-2 bg-purple-900/30 px-4 py-2 rounded-full border border-purple-500/30">
            <Wallet className="w-4 h-4 text-purple-400" />
            <span className="text-white font-semibold">{formatCurrency(balance)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stake Selection */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-purple-700/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Select Stake Amount</h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Info className="w-4 h-4" />
              <span>₦50k - ₦200k</span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleStakeSelect(amount)}
                disabled={isSpinning}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  stakeAmount === amount && !customStake
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-[0_0_15px_rgba(123,63,228,0.5)]"
                    : "bg-[#222222] text-gray-300 hover:bg-[#2a2a2a] border border-purple-700/20"
                } ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          {/* Custom Stake Input */}
          <div className="space-y-2">
            <label className="text-gray-400 text-sm">Or enter custom amount:</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Enter amount (₦50,000 - ₦200,000)"
              value={customStake}
              onChange={(e) => handleCustomStakeChange(e.target.value)}
              disabled={isSpinning}
              className="w-full bg-[#222222] border border-purple-700/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Selected Stake Display */}
          <div className="flex items-center justify-between bg-[#0B0B0B] rounded-xl px-4 py-3">
            <span className="text-gray-400">Your stake:</span>
            <span className="text-xl font-bold text-purple-400">{formatCurrency(stakeAmount)}</span>
          </div>

          {/* Spin Action Button */}
          <button
            onClick={validateAndSpin}
            disabled={isSpinning || balance < stakeAmount}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              balance < stakeAmount
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 shadow-[0_0_20px_rgba(123,63,228,0.4)]"
            }`}
          >
            {balance < stakeAmount ? (
              <span className="flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Insufficient Balance
              </span>
            ) : (
              "Proceed to Spin"
            )}
          </button>
        </div>

        {/* Spin Wheel Section */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-purple-700/30">
          <SpinWheel
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
            stakeAmount={stakeAmount}
          />
        </div>

        {/* How It Works */}
        <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-purple-700/30">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-400" />
            How It Works
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">1.</span>
              Select your stake amount (₦50,000 - ₦200,000)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">2.</span>
              Click "Proceed to Spin" and confirm
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">3.</span>
              Spin the wheel and win up to 3X your stake!
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">4.</span>
              Winnings are credited instantly to your wallet
            </li>
          </ul>
        </div>

        {/* Spin History */}
        <SpinHistory refreshTrigger={historyRefresh} />
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="bg-[#0B0B0B] border border-purple-700/50 max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-center">Confirm Spin</DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <p className="text-gray-300">You are about to stake:</p>
              <p className="text-3xl font-bold text-purple-400">{formatCurrency(stakeAmount)}</p>
              <p className="text-gray-400 text-sm">
                This amount will be deducted from your wallet. Are you sure you want to proceed?
              </p>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-4 bg-[#222222] text-white rounded-xl font-semibold hover:bg-[#2a2a2a] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSpin}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-purple-700 transition-all"
                >
                  Confirm
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Result Modal */}
      <SpinResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={spinResult}
        prizeAmount={prizeAmount}
      />

      <BottomNav />
    </div>
  );
};

export default SpinAndWin;
