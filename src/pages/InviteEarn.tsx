import { ArrowLeft, Gift, Copy, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const InviteEarn = () => {
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ added
  const referralLink = referralCode
    ? `https://lumexzz.netlify.app/login?ref=${referralCode}&tab=signup`
    : "";

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("referral_code, total_referrals, balance, last_referral_count")
        .eq("user_id", session.user.id)
        .single();

      if (error || !profile) {
        console.error("Profile fetch error:", error);
        setLoading(false);
        return;
      }

      let userReferralCode = profile.referral_code;

      // 🔹 Auto-generate referral code if missing
      if (!userReferralCode) {
        userReferralCode = session.user.id.slice(0, 6).toUpperCase();
        await supabase
          .from("profiles")
          .update({ referral_code: userReferralCode })
          .eq("user_id", session.user.id);
      }

      setReferralCode(userReferralCode);

      const totalRefs = profile.total_referrals || 0;
      const lastCount = profile.last_referral_count || 0;
      const balance = profile.balance || 0;

      const newRefs = totalRefs - lastCount;

      // 🔹 Update only if new referrals are detected
      if (newRefs > 0) {
        const addedAmount = newRefs * 5000;
        const updatedBalance = balance + addedAmount;

        await supabase
          .from("profiles")
          .update({
            balance: updatedBalance,
            last_referral_count: totalRefs, // mark counted
          })
          .eq("user_id", session.user.id);
      }

      setTotalEarnings(totalRefs * 5000);
      setTotalReferrals(totalRefs);
      setLoading(false);
    };

    loadUserData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      description: "Referral link copied to clipboard!",
    });
  };

  const shareOnWhatsApp = () => {
    const message = `🎉 Join me on LUMEXZZ WIN and start earning! Get your bonus when you sign up: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareOnTelegram = () => {
    const message = `🎉 Join me on LUMEXZZ WIN and start earning! Get your bonus when you sign up: ${referralLink}`;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        referralLink
      )}&text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black animate-[pulse_6s_infinite] opacity-90" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white">Invite & Earn</h1>
        </div>

        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-purple-800 to-black rounded-2xl p-6 text-white mb-6 border border-purple-500/30">
          <div className="flex flex-col items-center space-y-4">
            <Gift className="w-12 h-12 text-gold" />
            <div className="text-center">
              <div className="text-3xl font-bold">
                ₦{totalEarnings.toLocaleString()}
              </div>
              <div className="text-sm opacity-90">Total Earnings</div>
            </div>
            <div className="flex justify-between w-full text-center">
              <div>
                <div className="text-2xl font-bold">{totalReferrals}</div>
                <div className="text-sm opacity-90">Referrals</div>
              </div>
              <div>
                <div className="text-2xl font-bold">₦5,000</div>
                <div className="text-sm opacity-90">Per Referral</div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-black/60 rounded-2xl p-6 border border-purple-700/40">
          <h2 className="text-lg font-semibold text-white mb-4">
            Your Referral Link
          </h2>
          <div className="flex space-x-2 mb-4">
            <Input
              value={referralLink || "No referral link yet"}
              readOnly
              className="flex-1 bg-white/10 text-white border-purple-700/50"
            />
            <Button
              onClick={copyToClipboard}
              size="icon"
              variant="outline"
              className="border-gold text-gold"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={shareOnWhatsApp}
            className="w-full mb-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
          >
            <Share className="w-4 h-4 mr-2" />
            Share on WhatsApp
          </Button>
          <Button
            onClick={shareOnTelegram}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold"
          >
            <Share className="w-4 h-4 mr-2" />
            Share on Telegram
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteEarn;
