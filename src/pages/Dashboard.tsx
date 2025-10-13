import { useEffect, useState } from "react";
import { User, Eye, EyeOff, Shield, Users, Calculator, Wifi, CreditCard, Banknote, UserPlus, MessageCircle, Copy, Gift, TrendingUp, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { WelcomeNotification } from "@/components/WelcomeNotification";
import { PaymentNotification } from "@/components/PaymentNotification";
import { JoinGroupNotification } from "@/components/JoinGroupNotification";
import { LiveChat } from "@/components/LiveChat";
import { TransactionHistory } from "@/components/TransactionHistory";
import { BottomCarousel } from "@/components/BottomCarousel";
import { WithdrawalNotification } from "@/components/WithdrawalNotification";
import { ProfileUpload } from "@/components/ProfileUpload";
import { BottomNav } from "@/components/BottomNav";
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
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [balance, setBalance] = useState(5000);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(5 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [claimingStarted, setClaimingStarted] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<number | null>(null);
  const [canCheckin, setCanCheckin] = useState(true);

  // --- auth + profile ---
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
        setBalance(profileData.balance || 5000);
      }
    };
    checkAuth();
  }, [navigate]);

  // --- simplified other logic (unchanged) ---

  const services = [
    { icon: Users, label: "Support", bgClass: "bg-primary/10", route: "/support" },
    { icon: Calculator, label: "Investment", bgClass: "bg-primary/10", route: "/investment" },
    { icon: Banknote, label: "Withdraw", bgClass: "bg-primary/10", route: "/withdrawal-amount" },
    { icon: CreditCard, label: "Airtime", bgClass: "bg-primary/10", route: "/buy-airtime" },
    { icon: Wifi, label: "Data", bgClass: "bg-primary/10", route: "/buy-data" },
    { icon: Banknote, label: "Loan", bgClass: "bg-primary/10", route: "/loan" },
    { icon: UserPlus, label: "Invitation", bgClass: "bg-primary/10", route: "/invite-earn" },
    { icon: TrendingUp, label: "Play Games", bgClass: "bg-primary/10", route: "/play-games" }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black p-2 max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pt-2">
        <div className="flex items-center space-x-3">
          <ProfileUpload />
          <div className="overflow-hidden">
            <h1 className="text-lg font-semibold text-white typewriter">{profile?.full_name || user?.email}</h1>
            <p className="text-sm text-gray-400">How are you doing today?</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-black rounded-2xl p-3 text-white mb-4 relative border border-gold/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-gold" />
            <span className="text-sm opacity-90">Available Balance</span>
          </div>
          {/* Removed History Button ✅ */}
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            {showBalance ? <Eye className="w-4 h-4 opacity-90" /> : <EyeOff className="w-4 h-4 opacity-90" />}
          </button>
        </div>

        <div className="flex items-center justify-between mb-2">
          <Link to="/upgrade-account">
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold h-7 text-xs px-3"
            >
              Upgrade
            </Button>
          </Link>

          <Link to="/withdrawal-amount">
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold h-7 text-xs px-3"
            >
              Withdraw
            </Button>
          </Link>
        </div>

        <div className="text-3xl font-bold mb-4 text-center">
          {showBalance ? `₦${balance.toLocaleString()}.00` : "₦****"}
        </div>
      </div>

      {/* Services */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {services.map((s, i) => (
          <Link key={i} to={s.route} className="flex flex-col items-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg hover:shadow-yellow-500/50 transition-all animate-pulse">
              <s.icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] text-center text-white font-medium leading-tight">{s.label}</span>
          </Link>
        ))}
      </div>

      <BottomNav />

      {/* Slightly Wider Bottom Carousel ✅ */}
      <div className="mx-[-8px]">
        <BottomCarousel />
      </div>

      {/* Animated GO Lumexzz Section ✅ */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-6 mx-2 border border-purple-500/30">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-purple-900 to-black animate-[pulse_6s_infinite]" />
        <div className="relative z-10 text-center mb-4">
          <h2 className="text-2xl font-bold text-gold mb-2">GO Lumexzz?</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-white mx-auto mb-4"></div>
        </div>

        <div className="relative z-10 space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Safe and Secure</h3>
              <p className="text-white/80 text-sm">Bank-level encryption protects your transactions and personal data</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
              <p className="text-white/80 text-sm">Fast withdrawals and secure transactions in seconds</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">100% Reliable</h3>
              <p className="text-white/80 text-sm">24/7 trusted and guaranteed service uptime</p>
            </div>
          </div>
        </div>

        <Link to="/invite-earn">
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 rounded-full text-lg">
            Earn Now
          </Button>
        </Link>
      </div>

      {/* Live Chat moved up slightly ✅ */}
      <div className="mt-[-10px]">
        <LiveChat />
      </div>

      <WithdrawalNotification />

      {showWelcomeNotification && (
        <WelcomeNotification
          onClose={() => setShowWelcomeNotification(false)}
          onJoinCommunity={() => {
            setShowWelcomeNotification(false);
            setShowJoinGroupNotification(true);
          }}
        />
      )}

      {showJoinGroupNotification && (
        <JoinGroupNotification
          onClose={() => setShowJoinGroupNotification(false)}
          onGetStarted={() => setShowJoinGroupNotification(false)}
        />
      )}

      {showPaymentNotification && (
        <PaymentNotification
          onClose={() => setShowPaymentNotification(false)}
          onStartPayments={() => setShowPaymentNotification(false)}
        />
      )}

      <TransactionHistory
        isOpen={showTransactionHistory}
        onClose={() => setShowTransactionHistory(false)}
      />
    </div>
  );
};

export default Dashboard;
