import { ArrowLeft, Share2, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const WithdrawalAmount = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const loadBalance = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("balance, total_referrals, referral_code")
          .eq("user_id", session.user.id)
          .single();

        let userReferralCode = profile?.referral_code;

        // 🔹 Auto-generate referral code if missing
        if (!userReferralCode) {
          userReferralCode = session.user.id.slice(0, 6).toUpperCase();
          await supabase
            .from("profiles")
            .update({ referral_code: userReferralCode })
            .eq("user_id", session.user.id);
        }

        setReferralCode(userReferralCode);
        setBalance(profile?.balance || 0);
        setTotalReferrals(profile?.total_referrals || 0);
      }
    };

    loadBalance();
  }, []);

  // 🟣 LIVE REFERRAL + BALANCE UPDATE
  useEffect(() => {
    let subscription;
    const setupRealtime = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      subscription = supabase
        .channel("realtime-referral-balance")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "profiles",
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            const newProfile = payload.new;
            if (!newProfile) return;

            // Only update when data changes
            if (
              newProfile.total_referrals !== totalReferrals ||
              newProfile.balance !== balance
            ) {
              setBalance(newProfile.balance || 0);
              setTotalReferrals(newProfile.total_referrals || 0);

              const addedReferrals =
                (newProfile.total_referrals || 0) - totalReferrals;
              if (addedReferrals > 0) {
                const addedAmount = addedReferrals * 5000;
                toast({
                  title: "New Referral Added!",
                  description: `₦${addedAmount.toLocaleString()} added to your balance.`,
                });
              }
            }
          }
        )
        .subscribe();
    };

    setupRealtime();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [balance, totalReferrals, toast]);

  const handleContinue = () => {
    const withdrawalAmount = parseFloat(amount);
    if (!amount || withdrawalAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }

    if (balance < 100000 || totalReferrals < 5) {
      toast({
        title: "Requirements Not Met",
        description: "You need ₦100,000 balance and 5 referrals to withdraw.",
        variant: "destructive",
      });
      return;
    }

    navigate("/withdraw-bank-selection", { state: { amount: withdrawalAmount } });
  };

  // ✅ FIXED REFERRAL LINK TO MATCH INVITE & EARN PAGE
  const handleRefer = async () => {
    if (referralCode) {
      const referralUrl = `https://lumexzz.netlify.app/login?ref=${referralCode}&tab=signup`;
      const message = `🎉 Join me on LUMEXZZ WIN and start earning! Get your bonus when you sign up: ${referralUrl}`;

      if (navigator.share) {
        navigator.share({
          title: "Join LUMEXZZ WIN!",
          text: message,
        });
      } else {
        navigator.clipboard.writeText(message);
        toast({ description: "Referral link copied to clipboard!" });
      }
    }
  };

  const quickAmounts = [5000, 10000, 20000, 50000];
  const isRequirementsMet = balance >= 100000 && totalReferrals >= 5;
  const balanceColor = balance >= 100000 ? "text-green-600" : "text-red-600";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-3 max-w-md mx-auto">
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #000000 0%, #1e0536 25%, #4b0082 50%, #1e0536 75%, #000000 100%);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
        }
      `}</style>

      <div className="absolute inset-0 animated-bg opacity-95"></div>

      <div className="relative z-10 w-full">
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">Withdraw Funds</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-purple-700/40">
            <p className="text-sm text-gray-300 mb-1">Available Balance</p>
            <p className={`text-3xl font-bold ${balanceColor}`}>
              ₦{balance.toLocaleString()}.00
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-purple-700/40">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Enter Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                ₦
              </span>
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                className="pl-8 text-lg font-semibold bg-black/20 text-white border border-purple-700"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              {quickAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(amt.toString())}
                  className="text-xs text-yellow-300 border-yellow-500 hover:bg-yellow-500/10"
                >
                  ₦{amt.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-800/50 to-black/50 border border-purple-600 rounded-2xl p-4">
            <h3 className="font-semibold text-yellow-300 mb-3">
              Withdrawal Requirements:
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Minimum balance: ₦100,000</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Refer 5 friends to unlock withdrawals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Each friend must complete registration</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-purple-700/40">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Referrals Progress</span>
              <span className="text-sm font-semibold text-yellow-400">
                {totalReferrals}/5
              </span>
            </div>
            <div className="w-full bg-purple-900 rounded-full h-2 mb-4">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalReferrals / 5) * 100, 100)}%` }}
              ></div>
            </div>
            <Button
              onClick={handleRefer}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 rounded-full"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Start Referring Friends
            </Button>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!isRequirementsMet}
            className={`w-full font-semibold py-4 rounded-full ${
              isRequirementsMet
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isRequirementsMet ? "Cash Out" : "Requirements Not Met"}
          </Button>

          {!isRequirementsMet && (
            <p className="text-xs text-center text-gray-400">
              You need ₦100,000 balance and 5 referrals to withdraw
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalAmount;
