import { useEffect, useState, ChangeEvent } from "react";
import {
  User,
  Eye,
  EyeOff,
  Shield,
  Copy,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { WelcomeNotification } from "@/components/WelcomeNotification";
import { PaymentNotification } from "@/components/PaymentNotification";
import { JoinGroupNotification } from "@/components/JoinGroupNotification";
import { LiveChat } from "@/components/LiveChat";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BottomCarousel } from "@/components/BottomCarousel";
import { WithdrawalNotification } from "@/components/WithdrawalNotification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const [showJoinGroupNotification, setShowJoinGroupNotification] = useState(false);
  const [showPaymentNotification, setShowPaymentNotification] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [balance, setBalance] = useState<number>(5000);
  const [isClaiming, setIsClaiming] = useState(false);
  const [dailyClaimDisabled, setDailyClaimDisabled] = useState(false);

  const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;

  // Fixed Profile image upload
  const handleProfilePicUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files?.length || !user) return;

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop() ?? "jpg";
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase storage (upsert true to overwrite existing)
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // getPublicUrl is synchronous in the SDK (returns an object). Grab the URL safely:
      const urlRes = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = urlRes?.data?.publicUrl ?? "";

      if (!publicUrl) throw new Error("Failed to get public URL for uploaded avatar.");

      // Update user's profile record with the new public URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_pic_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Update UI state
      setProfile((prev: any) => ({ ...(prev || {}), profile_pic_url: publicUrl }));

      toast({
        title: "Profile Picture Updated",
        description: "Your new photo has been saved successfully.",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture.",
        variant: "destructive",
      });
    }
  };

  // Load session and profile
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      // supabase.auth.getSession() returns { data: { session } } in v2
      const session = (data as any)?.session ?? null;
      if (!session) {
        navigate("/login");
        return;
      }
      setUser(session.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setBalance(Number(profileData.balance ?? 5000));
      }
    };
    checkAuth();
  }, [navigate]);

  // Daily Claim Bonus
  const handleDailyClaim = async () => {
    if (!user || !profile) return;
    setIsClaiming(true);
    try {
      const newBalance = Number(balance) + 3000;
      const { error } = await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("user_id", user.id);

      if (error) throw error;

      await supabase.from("transactions").insert([
        {
          user_id: user.id,
          type: "bonus",
          amount: 3000,
          description: "Daily Claim Bonus +₦3,000",
          created_at: new Date().toISOString(),
        },
      ]);

      // Keep local UI in sync (persisting server value)
      setBalance(newBalance);
      setDailyClaimDisabled(true);
      localStorage.setItem("dailyClaimLast", Date.now().toString());

      toast({ title: "Daily Claim Success", description: "₦3,000 added to your balance" });
    } catch (error) {
      console.error("Daily claim error:", error);
      toast({
        title: "Error",
        description: "Failed to claim daily bonus. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      const referralUrl = `https://lumexzz-win.lovable.app/login?ref=${profile.referral_code}&tab=signup`;
      navigator.clipboard.writeText(referralUrl);
      toast({ description: "Referral link copied to clipboard!" });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black p-2 max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gold/20 flex items-center justify-center">
            {profile?.profile_pic_url ? (
              <img src={profile.profile_pic_url} alt="Profile" className="w-10 h-10 object-cover" />
            ) : (
              <User className="w-5 h-5 text-gold" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{profile?.full_name || user?.email}</h1>
            <p className="text-sm text-gray-400">How are you doing today?</p>
            <input type="file" accept="image/*" onChange={handleProfilePicUpload} className="text-xs text-gray-400 mt-1" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setShowTransactionHistory(true)} className="w-8 h-8 flex items-center justify-center text-gold">
            <History className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-black rounded-2xl p-3 text-white mb-4 border border-gold/20">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-sm opacity-90">Available Balance</span>
          </div>
          <button onClick={() => setShowBalance(!showBalance)} className="hover:bg-white/10 rounded-full p-1">
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-3xl font-bold mb-4 text-center">{showBalance ? `₦${balance.toLocaleString()}.00` : "₦****"}</div>

        <Button
          onClick={handleDailyClaim}
          disabled={dailyClaimDisabled || isClaiming}
          className={`w-full font-semibold py-3 rounded-full ${dailyClaimDisabled ? "bg-gray-700 text-gray-400" : "bg-gold text-black hover:bg-gold-dark"}`}
        >
          {dailyClaimDisabled ? "Daily Claimed" : "🎁 Claim ₦3,000"}
        </Button>
      </div>

      {/* Referral Section */}
      {profile?.referral_code && (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-gold/20 rounded-2xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-400">Your Referral Code</span>
            <span className="text-sm text-gray-400">Referrals: {profile.total_referrals || 0}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-black/50 rounded-lg p-3 border border-gold/30">
              <span className="font-bold text-gold text-lg">{profile.referral_code}</span>
            </div>
            <Button onClick={copyReferralCode} size="icon" className="bg-gold text-black">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Carousel and Footer */}
      <BottomCarousel />
      <LiveChat />
      <WithdrawalNotification />

      <TransactionHistory isOpen={showTransactionHistory} onClose={() => setShowTransactionHistory(false)} />

      {showWelcomeNotification && (
        <WelcomeNotification onClose={() => setShowWelcomeNotification(false)} onJoinCommunity={() => setShowJoinGroupNotification(true)} />
      )}
      {showJoinGroupNotification && <JoinGroupNotification onClose={() => setShowJoinGroupNotification(false)} onGetStarted={() => setShowJoinGroupNotification(false)} />}
      {showPaymentNotification && <PaymentNotification onClose={() => setShowPaymentNotification(false)} onStartPayments={() => setShowPaymentNotification(false)} />}
    </div>
  );
};

export default Dashboard;
