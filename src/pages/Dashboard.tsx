import { useEffect, useState } from "react";
import { User, Eye, EyeOff, Shield, Users, Calculator, Wifi, CreditCard, Banknote, UserPlus, MessageCircle, Copy, History, Gift, TrendingUp, Gamepad2 } from "lucide-react";
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
  const [countdown, setCountdown] = useState(5 * 60); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [claimingStarted, setClaimingStarted] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<number | null>(null);
  const [canCheckin, setCanCheckin] = useState(true);
  const [balanceInitialized, setBalanceInitialized] = useState(false); // ✅ added to prevent unwanted resets

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
        setProfile(profileData);
        
        // ✅ FIX: Only initialize balance once to prevent deduction/reset
        if (!balanceInitialized) {
          setBalance(profileData.balance || 5000);
          setBalanceInitialized(true);
        }
        
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

        // Check last check-in time
        const lastCheckinTime = localStorage.getItem('lastCheckin');
        if (lastCheckinTime) {
          const lastTime = parseInt(lastCheckinTime);
          setLastCheckin(lastTime);
          const now = Date.now();
          const timeSinceCheckin = now - lastTime;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          setCanCheckin(timeSinceCheckin >= twentyFourHours);
        }
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
  }, [navigate, balanceInitialized]);

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

  // Auto-add ₦5000 every 5 minutes
  useEffect(() => {
    if (!user) return;

    const autoBonus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const newBalance = balance + 5000;
        const { error } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('user_id', session.user.id);

        if (!error) {
          setBalance(newBalance);
          
          // Add to activity history
          addToActivityHistory('auto-bonus', 5000, 'Auto Bonus Reward');
          
          toast({
            title: "Auto Bonus!",
            description: "₦5,000 added to your balance",
          });
        }
      } catch (error) {
        console.error('Auto bonus error:', error);
      }
    };

    // Run auto-bonus every 5 minutes
    const interval = setInterval(autoBonus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, balance, toast]);

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
      // Auto-claim when timer reaches 0
      handleClaimBonus();
    }
    return () => clearInterval(timer);
  }, [timerActive, countdown, claimingStarted, user, isClaiming]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addToActivityHistory = (type: string, amount: number, description: string) => {
    const history = JSON.parse(localStorage.getItem('activityHistory') || '[]');
    const newActivity = {
      type,
      amount,
      description,
      timestamp: Date.now()
    };
    history.unshift(newActivity);
    localStorage.setItem('activityHistory', JSON.stringify(history));
  };

  const handleClaimBonus = async () => {
    if (!user || !profile) return;
    
    setIsClaiming(true);
    
    try {
      // Update balance in Supabase
      const newBalance = balance + 5300;
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setBalance(newBalance);
      setProfile(prev => ({ ...prev, balance: newBalance }));
      
      // Add to activity history
      addToActivityHistory('bonus', 5300, 'Bonus Claim Reward');
      
      toast({
        title: "Bonus Claimed!",
        description: "₦5,300 added to your balance",
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

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      const referralUrl = `https://lumexzz-win.lovable.app/login?ref=${profile.referral_code}&tab=signup`;
      navigator.clipboard.writeText(referralUrl);
      toast({
        description: "Referral link copied to clipboard!",
      });
    }
  };

  const handleCheckin = async () => {
    if (!canCheckin) {
      toast({
        title: "Already Checked In",
        description: "You can check in again in 24 hours",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Update balance
      const newBalance = balance + 1500;
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Update state and localStorage
      setBalance(newBalance);
      const now = Date.now();
      setLastCheckin(now);
      setCanCheckin(false);
      localStorage.setItem('lastCheckin', now.toString());

      // Add to activity history
      addToActivityHistory('check-in', 1500, 'Daily Check-in Reward');

      toast({
        title: "Check-in Successful!",
        description: "₦1,500 has been added to your balance",
      });
    } catch (error) {
      console.error("Check-in error:", error);
      toast({
        title: "Error",
        description: "Failed to process check-in",
        variant: "destructive"
      });
    }
  };

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

  if (!user) {
    return null;
  }

  // (Rest of your 683-line dashboard code continues unchanged, all UI, sections, and components remain exactly as-is)
