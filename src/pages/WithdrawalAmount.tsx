import { ArrowLeft, Share2, Users } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
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
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance, total_referrals, referral_code')
          .eq('user_id', session.user.id)
          .single();
          
        if (profile) {
          setBalance(profile.balance || 0);
          setTotalReferrals(profile.total_referrals || 0);
          setReferralCode(profile.referral_code || "");
        }
      }
    };
    loadBalance();
  }, []);

  const handleContinue = () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (!amount || withdrawalAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive"
      });
      return;
    }
    
    if (withdrawalAmount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive"
      });
      return;
    }

    if (balance < 100000 || totalReferrals < 5) {
      toast({
        title: "Requirements Not Met",
        description: "You need ₦100,000 balance and 5 referrals to withdraw.",
        variant: "destructive"
      });
      return;
    }

    navigate('/withdraw-bank-selection', { state: { amount: withdrawalAmount } });
  };

  const handleRefer = async () => {
    if (referralCode) {
      const referralUrl = `https://earnbuzzzz.netlify.app/login?tab=signup&ref=${referralCode}`;
      const message = `🎉 Join me on LUMEXZZ WIN and start earning! Get your bonus when you sign up: ${referralUrl}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Join LUMEXZZ WIN!',
          text: message,
        });
      } else {
        navigator.clipboard.writeText(message);
        toast({ description: 'Referral link copied to clipboard!' });
      }
    }
  };

  const quickAmounts = [5000, 10000, 20000, 50000];
  const isRequirementsMet = balance >= 100000 && totalReferrals >= 5;
  const balanceColor = balance >= 100000 ? "text-green-600" : "text-red-600";

  return (
    <div className="min-h-screen bg-muted/30 p-3 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Withdraw Funds</h1>
      </div>

      <div className="space-y-4">
        {/* Balance Display */}
        <div className="bg-card rounded-2xl p-4">
          <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
          <p className={`text-3xl font-bold ${balanceColor}`}>
            ₦{balance.toLocaleString()}.00
          </p>
        </div>

        {/* Withdrawal Amount Input */}
        <div className="bg-card rounded-2xl p-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Enter Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-lg">
              ₦
            </span>
            <Input
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              className="pl-8 text-lg font-semibold"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
                className="text-xs"
              >
                ₦{amt.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        {/* Referral Requirements */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-2xl p-4">
          <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Withdrawal Requirements:</h3>
          <div className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Minimum balance: ₦100,000</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Refer 5 friends to unlock withdrawals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Each friend must complete registration</span>
            </div>
          </div>
        </div>

        {/* Referrals Progress */}
        <div className="bg-card rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Referrals Progress</span>
            <span className="text-sm font-semibold text-foreground">{totalReferrals}/5</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min((totalReferrals / 5) * 100, 100)}%` }}
            ></div>
          </div>

          <Button 
            onClick={handleRefer}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Start Referring Friends
          </Button>
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!isRequirementsMet}
          className={`w-full font-semibold py-4 rounded-full ${
            isRequirementsMet 
              ? "bg-primary hover:bg-primary/90 text-white" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isRequirementsMet ? "Continue" : "Requirements Not Met"}
        </Button>

        {!isRequirementsMet && (
          <p className="text-xs text-center text-muted-foreground">
            You need ₦100,000 balance and 5 referrals to withdraw
          </p>
        )}
      </div>
    </div>
  );
};

export default WithdrawalAmount;
