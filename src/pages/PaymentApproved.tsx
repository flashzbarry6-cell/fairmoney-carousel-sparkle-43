import { ArrowRight, CheckCircle, Wallet, X, Loader2, Shield, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import BlockedAccountOverlay from "@/components/BlockedAccountOverlay";
import { useBalanceDeduction } from "@/hooks/useBalanceDeduction";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PaymentApproved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [showNotification, setShowNotification] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeductionAnimation, setShowDeductionAnimation] = useState(false);
  const [animatedBalance, setAnimatedBalance] = useState<number | null>(null);
  const [deductionAmount, setDeductionAmount] = useState<number | null>(null);
  const processedRef = useRef(false);
  
  const { 
    checkAutoDeductEnabled, 
    processWithdrawalDeduction,
    animateBalanceChange,
    checkSessionLock,
    setSessionLock
  } = useBalanceDeduction();
  
  // Plan amount (₦6,800 or ₦12,800) - used for validation
  const planAmount = location.state?.amount || 6800;
  // Withdrawal amount - the actual amount user typed on /withdrawal-amount page
  // Read from localStorage if not in state (set on /withdrawal-amount page)
  const storedWithdrawAmount = localStorage.getItem('pendingWithdrawAmount');
  const withdrawAmount = location.state?.withdrawAmount || (storedWithdrawAmount ? parseFloat(storedWithdrawAmount) : 0);
  const paymentType = location.state?.paymentType || "verification";

  useEffect(() => {
    // Generate confetti
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: ['#FFD700', '#6B2CF5', '#00FF00', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 5)]
    }));
    setConfetti(newConfetti);

    // Show bank registration notification after 2 seconds
    const timer = setTimeout(() => setShowNotification(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProceedToWithdrawal = async () => {
    // STRICT VALIDATION: Only ₦6,800 or ₦12,800 plans
    if (planAmount !== 6800 && planAmount !== 12800) {
      toast({
        title: "Invalid Plan",
        description: "This feature is only available for ₦6,800 or ₦12,800 plans",
        variant: "destructive"
      });
      return;
    }

    // Prevent double-clicks with strict lock
    if (isProcessing || processedRef.current) {
      toast({
        title: "Already Processing",
        description: "This action has already been initiated",
        variant: "destructive"
      });
      return;
    }

    // Create unique session key to prevent duplicate deductions
    const sessionKey = `withdrawal_continue_${planAmount}_${Date.now()}`;
    if (checkSessionLock(sessionKey)) {
      toast({
        title: "Action Already Completed",
        description: "This withdrawal action has already been processed",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    processedRef.current = true;

    try {
      // 🎯 CRITICAL FIX: Check toggle state FIRST from DATABASE before ANY other logic
      // This MUST happen before any routing decisions
      const autoDeductEnabled = await checkAutoDeductEnabled();
      
      console.log('Toggle state from DB:', autoDeductEnabled);

      // 🟢 TOGGLE ON: Execute deduction flow and STOP
      if (autoDeductEnabled === true) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive"
          });
          processedRef.current = false;
          setIsProcessing(false);
          navigate('/login');
          return;
        }

        // Use the withdrawal amount the user typed on /withdrawal-amount page
        // NEVER use plan price or fixed values
        const amountToDeduct = withdrawAmount > 0 ? withdrawAmount : 0;
        
        if (amountToDeduct <= 0) {
          toast({
            title: "Invalid Amount",
            description: "Please enter a valid withdrawal amount first",
            variant: "destructive"
          });
          processedRef.current = false;
          setIsProcessing(false);
          navigate('/withdrawal-amount');
          return;
        }

        // Get current balance for animation
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', session.user.id)
          .single();

        if (!profile) {
          toast({
            title: "Error",
            description: "Could not fetch your profile",
            variant: "destructive"
          });
          processedRef.current = false;
          setIsProcessing(false);
          return;
        }

        const currentBalance = profile.balance || 0;

        // Check if sufficient balance
        if (currentBalance < amountToDeduct) {
          toast({
            title: "Insufficient Balance",
            description: `You need ₦${amountToDeduct.toLocaleString()} to proceed`,
            variant: "destructive"
          });
          processedRef.current = false;
          setIsProcessing(false);
          return;
        }

        // Show deduction animation
        setAnimatedBalance(currentBalance);
        setDeductionAmount(amountToDeduct);
        setShowDeductionAnimation(true);

        // Process the deduction (atomic database operation)
        const result = await processWithdrawalDeduction(amountToDeduct);

        if (result.success) {
          // Lock this action permanently for this session
          setSessionLock(sessionKey);

          // Animate balance drop
          animateBalanceChange(
            currentBalance,
            result.balance_after || currentBalance - amountToDeduct,
            1500,
            (value) => setAnimatedBalance(value)
          );

          // Generate transaction ID
          const transactionId = `TXN${Date.now().toString(36).toUpperCase()}`;
          const timestamp = new Date().toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short'
          });

          // Wait for animation then redirect to WITHDRAWAL SUCCESS PAGE
          setTimeout(() => {
            setShowDeductionAnimation(false);
            
            // Clear the stored withdrawal amount
            localStorage.removeItem('pendingWithdrawAmount');
            
            toast({
              title: "Withdrawal Amount Deducted Successfully",
              description: `₦${amountToDeduct.toLocaleString()} has been deducted from your balance`,
            });
            
            // Navigate to Withdrawal Success Page with data
            navigate('/withdrawal-success-page', {
              state: {
                withdrawalData: {
                  amount: amountToDeduct,
                  plan: planAmount === 6800 ? '₦6,800' : '₦12,800',
                  transactionId,
                  timestamp
                }
              }
            });
          }, 2000);
        } else {
          // Deduction failed - show error and don't redirect
          setShowDeductionAnimation(false);
          processedRef.current = false;
          toast({
            title: "Deduction Failed",
            description: result.message || "Could not process deduction. Please try again.",
            variant: "destructive"
          });
          setIsProcessing(false);
        }
        
        // 🛑 CRITICAL: RETURN / STOP EXECUTION AFTER TOGGLE ON FLOW
        // Do NOT let any other code run after this
        return;
      }
      
      // 🔴 TOGGLE OFF: No deduction, redirect to Bank Registration
      // This ONLY runs if toggle is explicitly OFF
      toast({
        title: "Complete Bank Setup",
        description: "Complete bank setup to proceed with withdrawals",
      });
      
      // Clear processing state before redirect
      processedRef.current = false;
      setIsProcessing(false);
      
      navigate('/bank-registration');
      return;
      
    } catch (error: any) {
      console.error('Error processing withdrawal:', error);
      setShowDeductionAnimation(false);
      processedRef.current = false;
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <BlockedAccountOverlay>
      <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto page-transition">
        {/* Animated Background */}
        <div className="absolute inset-0 animated-bg"></div>
        
        {/* Confetti */}
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              backgroundColor: piece.color
            }}
          />
        ))}

        {/* Deduction Animation Overlay */}
        {showDeductionAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-gradient-to-br from-purple-900/90 to-black/90 border border-purple-500/40 rounded-3xl p-8 max-w-sm mx-4 shadow-2xl animate-scale-in">
              {/* Animated Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-500/50">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Processing Withdrawal
              </h2>
              
              {/* Amount being deducted */}
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
                <p className="text-red-300 text-sm text-center mb-1">Amount Reserved</p>
                <p className="text-2xl font-bold text-red-400 text-center animate-pulse">
                  -₦{deductionAmount?.toLocaleString()}
                </p>
              </div>

              {/* Animated Balance */}
              <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl p-4 mb-4">
                <p className="text-purple-300 text-sm text-center mb-1">New Balance</p>
                <p className="text-2xl font-bold text-white text-center transition-all duration-300">
                  ₦{animatedBalance?.toLocaleString()}
                </p>
              </div>

              {/* Loading indicator */}
              <div className="flex items-center justify-center gap-2 text-purple-300">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Initiating withdrawal...</span>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 mt-4 text-green-400 text-xs">
                <Shield className="w-4 h-4" />
                <span>Secured by Lumexzz</span>
              </div>
            </div>
          </div>
        )}

        <div className="relative z-10 animate-fade-in">
          {/* Main Success Card */}
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 space-y-6 mt-12 animate-slide-up shadow-lg shadow-green-500/10">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 animate-pulse">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-black font-bold text-sm">✓</span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-white">
                Payment Confirmed! 🎉
              </h1>
              <p className="text-gray-300 text-lg">
                Your payment of <span className="text-luxury-gold font-bold">₦{planAmount.toLocaleString()}</span> has been verified successfully.
              </p>
            </div>

            {/* Wallet Credit Info */}
            <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-green-400 font-semibold text-lg">Wallet Credited</p>
                  <p className="text-gray-400">₦{planAmount.toLocaleString()} added to your balance</p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Approved
              </span>
            </div>

            {/* Action Button - Single CTA */}
            <Button
              onClick={handleProceedToWithdrawal}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-luxury-purple to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold text-lg btn-press shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Continue to Withdraw
                </>
              )}
            </Button>

            {/* Info */}
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-300 text-sm text-center">
                💡 Register your bank account to enable withdrawals from your wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Side Notification for Bank Registration */}
        {showNotification && (
          <div className="fixed top-20 right-4 z-50 w-80 animate-slideIn">
            <div className="bg-gradient-to-br from-purple-900 via-black to-purple-800 border border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-purple-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-black" />
                  </div>
                  <span className="font-bold text-white">Withdrawal Setup</span>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-gray-400 hover:text-white btn-press"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <p className="text-gray-300 text-sm">
                  Register your valid bank account to enable withdrawals from your wallet.
                </p>

                <Button
                  onClick={handleProceedToWithdrawal}
                  disabled={isProcessing}
                  className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-black font-semibold py-3 rounded-xl btn-press"
                >
                  Register Bank Account
                </Button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-bg {
            background: linear-gradient(-45deg, #0a0015, #1a0030, #3b0066, #000000);
            background-size: 400% 400%;
            animation: gradientMove 12s ease infinite;
          }
          
          @keyframes slideIn {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-out forwards;
          }

          @keyframes confettiFall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            top: 0;
            animation: confettiFall 4s linear forwards;
            z-index: 5;
          }

          @keyframes scaleIn {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-in {
            animation: scaleIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </BlockedAccountOverlay>
  );
};

export default PaymentApproved;