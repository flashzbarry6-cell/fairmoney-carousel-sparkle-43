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

  // Check auth and load profile
useEffect(() => {
  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    setUser(session.user);

    try {
      // Load user profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        // Only set initial balance if not already set by local state (avoid overwriting)
        setBalance(prev => (typeof prev === "number" && prev !== 5000 ? prev : (profileData.balance || 5000)));

        // Check claiming state
        const claimState = localStorage.getItem("claimingState");
        const lastClaimTime = localStorage.getItem("lastClaimTime");

        if (claimState === "active" && lastClaimTime) {
          const elapsed = Math.floor((Date.now() - parseInt(lastClaimTime)) / 1000);
          const remaining = (2 * 60) - elapsed; // now using 2 minutes

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
        const lastCheckinTime = localStorage.getItem("lastCheckin");
        if (lastCheckinTime) {
          const lastTime = parseInt(lastCheckinTime);
          setLastCheckin(lastTime);
          const now = Date.now();
          const timeSinceCheckin = now - lastTime;
          const twentyFourHours = 24 * 60 * 60 * 1000;
          setCanCheckin(timeSinceCheckin >= twentyFourHours);
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  checkAuth();

  // Auth state listener
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        navigate("/login");
      }
    }
  );

  return () => {
    // cleanup subscription
    subscription?.unsubscribe();
  };
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

  // Auto-add ₦5000 every 2 minutes

  // ✅ Sync local balance updates with Supabase
const syncBalanceToSupabase = async (newBalance: number) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("user_id", session.user.id);

    if (error) console.error("Balance sync error:", error);
  } catch (err) {
    console.error("Sync error:", err);
  }
};
  
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

    // Run auto-bonus every 2 minutes
    const interval = setInterval(autoBonus, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user, balance, toast]);


  // ✅ Step 2 — Listen for task rewards and update balance instantly
useEffect(() => {
  const handleBalanceUpdate = (event: CustomEvent) => {
    const newBalance = event.detail;
    setBalance(newBalance);
    syncBalanceToSupabase(newBalance); // ensures backend matches
  };

  window.addEventListener("balanceUpdated", handleBalanceUpdate);
  return () => window.removeEventListener("balanceUpdated", handleBalanceUpdate);
}, []);


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
      setCountdown(2 * 60);
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
    setCountdown(2 * 60);
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

// ✅ Keep balance persistent across navigation
useEffect(() => {
  if (balance) {
    localStorage.setItem("latestBalance", balance.toString());
  }
}, [balance]);

  const services = [
    { icon: Users, label: "Support", bgClass: "bg-primary/10", route: "/support" },
    { icon: Calculator, label: "Investment", bgClass: "bg-primary/10", route: "/investment" },
   { icon: Gamepad2, label: "Spin & Win", bgClass: "bg-primary/10", route: "/spin-win" },
    { icon: CreditCard, label: "Airtime", bgClass: "bg-primary/10", route: "/buy-airtime" },
    { icon: Wifi, label: "Data", bgClass: "bg-primary/10", route: "/buy-data" },
    { icon: Banknote, label: "Loan", bgClass: "bg-primary/10", route: "/loan" },
    { icon: UserPlus, label: "Invitation", bgClass: "bg-primary/10", route: "/invite-earn" },
    { icon: TrendingUp, label: "Play Games", bgClass: "bg-primary/10", route: "/play-games" }
  ];

  if (!user) {
    return null;
  }

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
            </svg>
          </div>
          
          {/* Notification Bell with Transaction History */}
          <div className="relative">
            <button 
              className="w-8 h-8 flex items-center justify-center animate-bounce"
              style={{ animationDelay: '0.2s' }}
              onClick={() => setShowTransactionHistory(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
              </svg>
              {bonusClaimed && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full"></div>
              )}
            </button>
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
          <div className="flex items-center space-x-2">
            
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              {showBalance ? (
                <Eye className="w-4 h-4 opacity-90" />
              ) : (
                <EyeOff className="w-4 h-4 opacity-90" />
              )}
            </button>
          </div>
        </div>
        
        {/* Timer and Buttons Row */}
        <div className="flex items-center justify-between mb-2">
          <Link to="/upgrade-account">
            <Button
              size="sm"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold h-11 text-sm px-7"
            >
              Upgrade
            </Button>
          </Link>
          
          {claimingStarted && (
            <div className="bg-gold text-black text-xs px-3 py-1 rounded-full font-bold">
              {timerActive && countdown > 0 ? formatTime(countdown) : "Ready to claim!"}
            </div>
          )}
          
          <Link to="/withdrawal-amount">
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold h-11 text-sm px-7"
            >
              Withdraw
            </Button>
          </Link>
        </div>
        
        <div className="text-3xl font-bold mb-4 text-center">
          {showBalance ? `₦${balance.toLocaleString()}.00` : "₦****"}
        </div>
        
        <Button 
          onClick={() => {
            if (!claimingStarted) {
              handleStartClaiming();
            } else if (!timerActive && countdown === 0) {
              handleClaimBonus();
            }
          }}
          disabled={isClaiming || (claimingStarted && timerActive && countdown > 0)}
          className={`w-full font-semibold py-3 rounded-full ${
            isClaiming
              ? "bg-gold/70 text-black cursor-not-allowed"
              : (claimingStarted && timerActive && countdown > 0)
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-gold hover:bg-gold-dark text-black"
          }`}
        >
          {isClaiming 
            ? "⏳ Claiming..." 
            : !claimingStarted
            ? "🎁 Start Claim"
            : (timerActive && countdown > 0)
            ? `⏰ Wait ${formatTime(countdown)}`
            : "🎁 Claim ₦5,300"
          }
        </Button>
      </div>

      {/* Referral Code Section */}
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
            <Button onClick={copyReferralCode} size="icon" className="bg-gold hover:bg-gold-dark text-black border-0">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {services.map((service, index) => (
          service.route === "groups" ? (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-yellow-500/50 transition-all animate-pulse"
                onClick={() => setShowGroupModal(true)}
              >
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] text-center text-white font-medium leading-tight">
                {service.label}
              </span>
            </div>
          ) : (
            <Link key={index} to={service.route} className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg hover:shadow-yellow-500/50 transition-all animate-pulse">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] text-center text-white font-medium leading-tight">
                {service.label}
              </span>
            </Link>
          )
        ))}
      </div>

      <BottomNav />
      
      {/* Claiming Bonus Notification */}
      {isClaiming && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gold text-black px-6 py-3 rounded-full shadow-lg animate-pulse z-50">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Claiming bonus...</span>
          </div>
        </div>
      )}
      
      {/* Bottom Carousel */}
      <BottomCarousel />

      {/* Task and Check-in Buttons */}
      <div className="grid grid-cols-2 gap-1 mb-6 px-2 mt-0">
        <Link to="/activity">
          <div className="bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl p-4 border border-purple-500/30 hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white font-semibold">Task</h3>
            </div>
            <p className="text-purple-200 text-sm">Complete daily tasks</p>
          </div>
        </Link>

        <div 
          onClick={handleCheckin}
          className={`bg-gradient-to-br from-green-900 to-green-700 rounded-2xl p-4 border border-green-500/30 cursor-pointer hover:scale-105 transition-transform ${
            !canCheckin ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <h3 className="text-white font-semibold">Check-in</h3>
          </div>
          <p className="text-green-200 text-sm">
            {canCheckin ? 'Earn ₦1,500' : '24hrs cooldown'}
          </p>
        </div>
      </div>

      {/* Lumexzz Info Section */}
      <div className="bg-gradient-to-br from-white via-purple-950 to-purple rounded-2xl p-6 mb-6 mx-2 border border-purple-500/30">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gold mb-2">GO Lumexzz?</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-white-400 mx-auto mb-4"></div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">safe and Secure</h3>
              <p className="text-white-200 text-sm">Bank-level encryption protects your transactions and personal data</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
              <p className="text-white-200 text-sm">fast withdrawals and secure transactions in seconds</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">sure% Reliable</h3>
              <p className="text-white-200 text-sm">24/7 trusted and guaranteed service uptime</p>
            </div>
          </div>
        </div>

        <Link to="/invite-earn">
          <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 rounded-full text-lg">
            Earn Now
          </Button>
        </Link>
      </div>

      {/* Live Chat */}
      <LiveChat />

      {/* Withdrawal Notifications */}
      <WithdrawalNotification />

      {/* Notifications */}
        {showJoinGroupNotification && (
          <JoinGroupNotification
            onClose={() => setShowJoinGroupNotification(false)}
            onGetStarted={() => setShowJoinGroupNotification(false)}
          />
        )}

        {showWelcomeNotification && (
          <WelcomeNotification
            onClose={() => setShowWelcomeNotification(false)}
            onJoinCommunity={() => {
              setShowWelcomeNotification(false);
              setShowJoinGroupNotification(true);
            }}
          />
        )}

      {showPaymentNotification && (
        <PaymentNotification
          onClose={() => setShowPaymentNotification(false)}
          onStartPayments={() => setShowPaymentNotification(false)}
        />
      )}

      {/* Transaction History */}
      <TransactionHistory
        isOpen={showTransactionHistory}
        onClose={() => setShowTransactionHistory(false)}
      />

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Join Our Community</h2>
              <button onClick={() => setShowGroupModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <a 
                href="https://chat.whatsapp.com/Ct9thGEQZUMAhy0Sqp23Hc?mode=ems_copy_c"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 rounded-full font-semibold transition-colors"
                onClick={() => setShowGroupModal(false)}
              >
                Join WhatsApp Group
              </a>
              <a 
                href="https://t.me/+Z93EW8PWHoQzNGU8"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 rounded-full font-semibold transition-colors"
                onClick={() => setShowGroupModal(false)}
              >
                Join Telegram Group
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
