import { useEffect, useState } from "react";
import { User, Eye, EyeOff, Shield, Users, Calculator, Wifi, CreditCard, Banknote, UserPlus, MessageCircle, Copy, History } from "lucide-react";
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
  const [balance, setBalance] = useState<number>(5000);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [countdown, setCountdown] = useState(5 * 60); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [claimingStarted, setClaimingStarted] = useState(false);

  // Daily claim cooldown state (₦3,000)
  const [dailyClaimDisabled, setDailyClaimDisabled] = useState(false);
  const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

  // Check auth and load profile
  useEffect(() => {
    const checkAuth = async () => {
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
        // FIX: prevent balance from being overwritten by older/smaller value from profile fetch
        setProfile(profileData);
        setBalance((prev: number) => {
          const prevNum = typeof prev === "number" ? prev : 0;
          const profileNum = Number(profileData?.balance) || 5000;
          return Math.max(prevNum, profileNum);
        });

        // Check claiming state (existing 5-minute claim)
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

      // Check daily claim cooldown
      const lastDaily = localStorage.getItem('dailyClaimLast');
      if (lastDaily) {
        const elapsed = Date.now() - parseInt(lastDaily);
        if (elapsed < DAILY_COOLDOWN_MS) {
          setDailyClaimDisabled(true);
        } else {
          setDailyClaimDisabled(false);
        }
      } else {
        setDailyClaimDisabled(false);
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
      // Check if notifications have been shown before
      const hasShownWelcome = localStorage.getItem('hasShownWelcome');
      const hasShownPayment = localStorage.getItem('hasShownPayment');

      // Show welcome notification after 1 second if not shown before
      if (!hasShownWelcome) {
        const welcomeTimer = setTimeout(() => {
          setShowWelcomeNotification(true);
          localStorage.setItem('hasShownWelcome', 'true');
        }, 1000);

        // Show payment notification after 4 seconds if not shown before
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

  // Countdown timer effect with auto-claim for the 5-minute claim (keeps original behavior)
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
      // Auto-claim when timer reaches 0 (existing behavior)
      handleClaimBonus();
    }
    return () => clearInterval(timer);
  }, [timerActive, countdown, claimingStarted, user, isClaiming]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Existing claim (₦5,000) function — now also logs transaction
  const handleClaimBonus = async () => {
    if (!user || !profile) return;

    setIsClaiming(true);

    try {
      // Update balance in Supabase (₦5,000)
      const newBalance = balance + 5000;
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;

      // Insert transaction record
      await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: 'bonus',
          amount: 5000,
          description: 'Timed Claim Bonus +₦5,000',
          created_at: new Date().toISOString()
        }]);

      // Update local state (optimistic + persistent)
      setBalance(newBalance);
      setProfile(prev => ({ ...prev, balance: newBalance }));

      toast({
        title: "Bonus Claimed!",
        description: "₦5,000 added to your balance",
      });

      // Restart timer for next claim
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

  // New Daily Claim (manual) — +₦3,000, 24h cooldown, logs transaction
  const handleDailyClaim = async () => {
    if (!user || !profile) return;
    const lastDaily = localStorage.getItem('dailyClaimLast');
    if (lastDaily && (Date.now() - parseInt(lastDaily)) < DAILY_COOLDOWN_MS) {
      const remaining = DAILY_COOLDOWN_MS - (Date.now() - parseInt(lastDaily));
      const hrs = Math.floor(remaining / (3600 * 1000));
      toast({
        description: `Daily claim locked. Try again in ${hrs}h.`,
      });
      return;
    }

    setIsClaiming(true);
    try {
      const newBalance = balance + 3000;
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log transaction
      const { error: txError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type: 'bonus',
          amount: 3000,
          description: 'Daily Claim Bonus +₦3,000',
          created_at: new Date().toISOString()
        }]);
      if (txError) throw txError;

      // Update local state
      setBalance(newBalance);
      setProfile(prev => ({ ...prev, balance: newBalance }));

      // Set cooldown
      localStorage.setItem('dailyClaimLast', Date.now().toString());
      setDailyClaimDisabled(true);

      toast({
        title: "Daily Claim Success",
        description: "₦3,000 added to your balance",
      });

    } catch (error) {
      console.error('Daily claim error:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily bonus. Try again.",
        variant: "destructive"
      });
    } finally {
      setIsClaiming(false);
    }
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

  // Services array — removed Groups button per request
  const services = [
    { icon: Users, label: "Support", bgClass: "bg-primary/10", route: "/support" },
    // Groups button removed
    { icon: CreditCard, label: "Airtime", bgClass: "bg-primary/10", route: "/buy-airtime" },
    { icon: Wifi, label: "Data", bgClass: "bg-primary/10", route: "/buy-data" },
    { icon: Banknote, label: "Loan", bgClass: "bg-primary/10", route: "/loan" },
    { icon: UserPlus, label: "Invitation", bgClass: "bg-primary/10", route: "/invite-earn" }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-2 max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gold" />
          </div>
      <div className="overflow-hidden">
        <h1 className="text-lg font-semibold text-white typewriter">{profile?.full_name || user?.email}</h1>
        <p className="text-sm text-gray-400">How are you doing today?</p>
      </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Headphones Icon */}
          <div className="w-8 h-8 flex items-center justify-center animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
              <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>
            </svg>
          </div>

          {/* Scan Icon */}
          <div className="w-8 h-8 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.1s' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
              <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
              <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
              <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
              <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
            
