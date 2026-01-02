import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import SpinWheel from "@/components/SpinWheel";
import SpinHistory from "@/components/SpinHistory";
import SpinResultModal from "@/components/SpinResultModal";
import BlockedAccountOverlay from "@/components/BlockedAccountOverlay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Configuration - easily adjustable stake amounts
const STAKE_OPTIONS = [500, 1000, 2000, 5000, 10000, 20000];

const SpinAndWin = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(500);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [spinResult, setSpinResult] = useState<"win" | "lose" | null>(null);
  const [prizeAmount, setPrizeAmount] = useState(0);
  const [lostAmount, setLostAmount] = useState(0);
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
        navigate("/login");
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
  };

  const startSpin = async () => {
    if (isSpinning) return;
    
    if (balance < stakeAmount) {
      toast.error("Insufficient balance");
      return;
    }

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
      setIsSpinning(true);
    } catch (error) {
      console.error("Error deducting stake:", error);
      toast.error("Error processing stake");
    }
  };


  const handleSpinComplete = async (result: "win" | "lose", prize: number) => {
    setSpinResult(result);
    setPrizeAmount(prize);
    setLostAmount(result === "lose" ? stakeAmount : 0);
    setIsSpinning(false);

    if (!userId) return;

    try {
      // If won, credit the prize (stake already deducted, so add full prize)
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
          prize_amount: result === "win" ? prize : 0,
        });

      if (historyError) throw historyError;
      
      setHistoryRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error recording spin:", error);
    }

    setShowResultModal(true);
  };

  const handleModalClose = () => {
    setShowResultModal(false);
  };

  const handleSpinAgain = () => {
    setShowResultModal(false);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BlockedAccountOverlay>
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
          <h3 className="text-white font-semibold">Select Stake Amount</h3>

          {/* Preset Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {STAKE_OPTIONS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleStakeSelect(amount)}
                disabled={isSpinning}
                className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                  stakeAmount === amount
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-[0_0_15px_rgba(123,63,228,0.5)]"
                    : "bg-[#222222] text-gray-300 hover:bg-[#2a2a2a] border border-purple-700/20"
                } ${isSpinning ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          {/* Selected Stake Display */}
          <div className="flex items-center justify-between bg-[#0B0B0B] rounded-xl px-4 py-3">
            <span className="text-gray-400">Your stake:</span>
            <span className="text-xl font-bold text-purple-400">{formatCurrency(stakeAmount)}</span>
          </div>
        </div>

        {/* Spin Wheel Section */}
        <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-purple-700/30">
          <SpinWheel
            onSpinComplete={handleSpinComplete}
            isSpinning={isSpinning}
            onSpin={startSpin}
            stakeAmount={stakeAmount}
            balance={balance}
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
              Select your stake amount
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">2.</span>
              Click "SPIN NOW" to start
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">3.</span>
              Win up to 3X your stake!
            </li>
          </ul>
        </div>

        {/* Spin History */}
        <SpinHistory refreshTrigger={historyRefresh} />
      </div>


      {/* Result Modal */}
      <SpinResultModal
        isOpen={showResultModal}
        onClose={handleModalClose}
        result={spinResult}
        prizeAmount={prizeAmount}
        lostAmount={lostAmount}
        onSpinAgain={handleSpinAgain}
        onBackToDashboard={handleBackToDashboard}
        canSpinAgain={balance >= stakeAmount}
      />

      <BottomNav />
    </div>
    </BlockedAccountOverlay>
  );
};

export default SpinAndWin;
