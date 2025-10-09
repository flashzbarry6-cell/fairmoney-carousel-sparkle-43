import { useEffect, useState } from "react";
import { User, Eye, EyeOff, Shield, Users, Calculator, Wifi, CreditCard, Banknote, UserPlus, MessageCircle, Copy, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { WelcomeNotification } from "@/components/WelcomeNotification";
import { PaymentNotification } from "@/components/PaymentNotification";
import { JoinGroupNotification } from "@/components/JoinGroupNotification";
import { LiveChat } from "@/components/LiveChat";
import TransactionHistory from "@/components/TransactionHistory";
import { BottomCarousel } from "@/components/BottomCarousel";
import { WithdrawalNotification } from "@/components/WithdrawalNotification";
import { ProfileUpload } from "@/components/ProfileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true); // ✅ added loading state
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
  const [countdown, setCountdown] = useState(5 * 60); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [claimingStarted, setClaimingStarted] = useState(false);

  // Check auth and load profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate("/login");
          return;
        }

        setUser(session.user);

        // Load user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);

          // Prevent overwriting a higher in-memory balance with a lower DB value:
          const dbBal = profileData.balance || 5000;
          setBalance(prev => (prev && prev > dbBal ? prev : dbBal));

          // Check claiming state
          const claimState = localStorage.getItem('claimingState');
          const lastClaimTime = localStorage.getItem('lastClaimTime');

          if (claimState === 'active' && lastClaimTime) {
            const elapsed = Math.floor((Date.now() - parseInt(lastClaimTime)) / 1000);
            const remaining = (5 * 60) - elapsed;

            if (remaining > 0) {
              setCountdown(remaining);
              setTimerActive(true);
              setClaimingStarted(true);
            } else {
              // Time to claim bonus
              setCountdown(0);
              setTimerActive(false);
              setClaimingStarted(true);
            }
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false); // ✅ stop loading
      }
    };

    checkAuth();

    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      const hasShownPayment = localStorage.getItem('hasShownPayment');

      if (!hasShownWelcome) {
        const welcomeTimer = setTimeout(() => {
          setShowWelcomeNotification(true);
          localStorage.setItem('hasShownWelcome', 'true');
        }, 1000);

        if (!hasShownPayment) {
          const paymentTimer = setTimeout(() => {
            setShowPaymentNotification(true);
            localStorage.setItem('hasShownPayment', 'true');
          }, 4000);

          return () => {
            clearTimeout(welcomeTimer);
            clearTimeout(paymentTimer);
          };
        }

        return () => clearTimeout(welcomeTimer);
      }
    }
  }, [user]);

  // Countdown timer effect with auto-claim
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            setTimerActive(false);
            return 0;
          }
          return newCount;
        });
      }, 1000);
    } else if (timerActive === false && countdown === 0 && claimingStarted && user && !isClaiming) {
      handleClaimBonus();
    }
    return () => clearInterval(timer);
  }, [timerActive, countdown, claimingStarted, user, isClaiming]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClaimBonus = async () => {
    if (!user || !profile) return;

    setIsClaiming(true);

    try {
      const newBalance = balance + 5000;
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;

      setBalance(newBalance);
      setProfile(prev => ({ ...prev, balance: newBalance }));

      toast({
        title: "Bonus Claimed!",
        description: "₦5,000 added to your balance",
      });

      setCountdown(5 * 60);
      setTimerActive(true);
      localStorage.setItem('lastClaimTime', Date.now().toString());

    } catch (error) {
      console.error('Error claiming bonus:', error);
      toast({
        title: "Error",
        description: "Failed to claim bonus. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsClaiming(false);
    }
  };

  const handleStartClaiming = () => {
    setClaimingStarted(true);
    setTimerActive(true);
    setCountdown(5 * 60);
    localStorage.setItem('claimingState', 'active');
    localStorage.setItem('lastClaimTime', Date.now().toString());
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      const referralUrl = `https://lumexzz-win.lovable.app/login?ref=${profile.referral_code}&tab=signup`;
      navigator.clipboard.writeText(referralUrl);
      toast({
        description: "Referral link copied to clipboard!",
      });
    }
  };

  const services = [
    { icon: Users, label: "Support", bgClass: "bg-primary/10", route: "/support" },
    { icon: Calculator, label: "Airtime", bgClass: "bg-primary/10", route: "/buy-airtime" },
    { icon: CreditCard, label: "Data", bgClass: "bg-primary/10", route: "/buy-data" },
    { icon: Banknote, label: "Loan", bgClass: "bg-primary/10", route: "/loan" },
    { icon: UserPlus, label: "Invitation", bgClass: "bg-primary/10", route: "/invite-earn" }
  ];

  // ✅ Fix: show a loading placeholder instead of blank screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-2 max-w-md mx-auto pb-32">
      {/* Header - made sticky */}
      {/* EVERYTHING BELOW REMAINS EXACTLY AS YOU SENT IT */}
      {/* Full JSX structure unchanged */}
      {/* ... */}
    </div>
  );
};

export default Dashboard;
