import { useEffect, useState } from "react";
import { User, Eye, EyeOff, Shield, Users, Calculator, Wifi, CreditCard, Banknote, UserPlus, MessageCircle, Copy, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { WelcomeNotification } from "@/components/WelcomeNotification";
import { PaymentNotification } from "@/components/PaymentNotification";
import { JoinGroupNotification } from "@/components/JoinGroupNotification";
import { LiveChat } from "@/components/LiveChat";
import  TransactionHistory  from "@/components/TransactionHistory";
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
      const { data: { session } } await supabase.auth.getSession();
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

  const handleClaimBonus = async () => {
    if (!user || !profile) return;
    
    setIsClaiming(true);
    
    try {
      // Update balance in Supabase — amount increased to ₦5,000
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

  const services = [
    { icon: Users, label: "Support", bgClass: "bg-primary/10", route: "/support" },
    { icon: Calculator, label: "Airtime", bgClass: "bg-primary/10", route: "/buy-airtime" },
    { icon: CreditCard, label: "Data", bgClass: "bg-primary/10", route: "/buy-data" },
    { icon: Banknote, label: "Loan", bgClass: "bg-primary/10", route: "/loan" },
    { icon: UserPlus, label: "Invitation", bgClass: "bg-primary/10", route: "/invite-earn" }
    // Removed Groups and More and Withdraw from the grid per request
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-2 max-w-md mx-auto pb-32">
      {/* Header - made sticky */}
      <div className="flex items-center justify-between mb-3 pt-2 sticky top-0 z-50 bg-black">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center overflow-hidden">
            {/* Profile Upload component (shows profile pic / enables upload) */}
            <ProfileUpload />
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
            {/* Eye toggle remains here */}
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
        
        {/* Timer under eye */}
        <div className="flex justify-center mb-2">
          {claimingStarted && (
            <div className="bg-gold text-black text-xs px-3 py-1 rounded-full font-bold">
              {timerActive && countdown > 0 ? formatTime(countdown) : "Ready to claim!"}
            </div>
          )}
        </div>
        
        <div className="text-3xl font-bold mb-4 text-center">
          {showBalance ? `₦${balance.toLocaleString()}.00` : "₦****"}
        </div>
        
        {/* New row: History (left) and Withdraw (right) under the timer */}
        <div className="flex items-center justify-between mb-3">
          <Button
            onClick={() => setShowTransactionHistory(true)}
            size="sm"
            className="bg-gold hover:bg-gold-dark text-black font-semibold h-8 text-xs px-3"
          >
            <History className="w-3 h-3 mr-1" />
            History
          </Button>

          <Button
            onClick={() => navigate("/withdrawal-amount")}
            size="sm"
            className="bg-gold hover:bg-gold-dark text-black font-semibold h-8 text-xs px-3"
          >
            Withdraw
          </Button>
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
            : "🎁 Claim ₦5,000"
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
            <Link key={index} to={service.route} className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg hover:shadow-yellow-500/50 transition-all animate-pulse">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] text-center text-white font-medium leading-tight">
                {service.label}
              </span>
            </Link>
        ))}
      </div>

      {/* Bottom Navigation (sticky/fixed at bottom remains) */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-black border-t border-gold/20">
        <div className="flex justify-around py-2 px-2">
          <Link to="/dashboard" className="flex flex-col items-center space-y-1 flex-1">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dark rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-black rounded-sm"></div>
            </div>
            <span className="text-[10px] text-gold font-medium">Home</span>
          </Link>
          <Link to="/loan" className="flex flex-col items-center space-y-1 flex-1">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
            </div>
            <span className="text-[10px] text-gray-500">Loans</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center space-y-1 flex-1">
            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-600 rounded-sm"></div>
            </div>
            <span className="text-[10px] text-gray-500">Profile</span>
          </Link>
        </div>
      </div>
      
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

      {/* LUMEXZZ write-up under carousel: ~10 lines animated (black & purple) */}
      <div className="mt-4 mb-6 p-4 rounded-2xl border border-purple-700 bg-gradient-to-b from-black to-purple-950 overflow-hidden">
        <div className="animate-pulse space-y-2">
          <p className="text-sm text-purple-300">LUMEXZZ is a cutting-edge fintech platform designed to empower users across Africa with fast, secure and transparent financial services.</p>
          <p className="text-sm text-purple-200">We combine simplicity with power — allowing you to manage funds, claim bonuses and interact with a vibrant community effortlessly.</p>
          <p className="text-sm text-purple-300">At LUMEXZZ security and user experience come first: every feature is crafted to be intuitive while protecting your data.</p>
          <p className="text-sm text-purple-200">We believe in financial inclusion — giving everyone access to tools that grow their savings and unlock new opportunities.</p>
          <p className="text-sm text-purple-300">Our referral system rewards community champions — invite friends and watch your network and earnings grow.</p>
          <p className="text-sm text-purple-200">Get instant support, buy airtime and data, withdraw funds, and explore loan options — all from one beautiful app.</p>
          <p className="text-sm text-purple-300">Expect regular product improvements and features inspired by our users — LUMEXZZ evolves with you.</p>
          <p className="text-sm text-purple-200">Join thousands who trust LUMEXZZ to manage their everyday finances with confidence and style.</p>
          <p className="text-sm text-purple-300">We’re more than an app — we're a community dedicated to financial growth and digital empowerment.</p>
          <p className="text-sm text-purple-200">Welcome to LUMEXZZ — where your financial journey gets simpler, bolder, and more rewarding.</p>
        </div>
      </div>

      <LiveChat />

      <WithdrawalNotification />

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

      {/* Group Modal (still available if showGroupModal toggled somewhere) */}
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
