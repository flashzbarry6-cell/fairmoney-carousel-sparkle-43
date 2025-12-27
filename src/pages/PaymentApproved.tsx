import { CheckCircle, ArrowRight, Wallet, Building2, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const PaymentApproved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showBankNotification, setShowBankNotification] = useState(true);
  
  const amount = location.state?.amount || 0;
  const paymentType = location.state?.paymentType || 'deposit';

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto flex items-center justify-center page-transition">
      {/* Animated purple background */}
      <div className="absolute inset-0 premium-bg-animated"></div>
      
      {/* Purple glow effects */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#6B2CF5', '#8B5CF6', '#A78BFA', '#10b981', '#fbbf24'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full space-y-4">
        {/* Main Success Card */}
        <div className="bg-card/80 backdrop-blur-lg rounded-3xl p-8 border border-primary/30 space-y-6 animate-fade-up shadow-neon">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center glow-pulse">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gold rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xl">🎉</span>
              </div>
            </div>
          </div>

          {/* Success Text */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-emerald-400 glow-text">Payment Approved!</h1>
            <p className="text-muted-foreground text-lg">
              Your payment has been verified successfully
            </p>
          </div>

          {/* Amount Credited */}
          <div className="bg-emerald-900/30 rounded-2xl p-5 border border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Amount Credited</p>
                  <p className="text-2xl font-bold text-emerald-400">₦{amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                CREDITED
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/40 rounded-xl p-4 border border-emerald-500/20">
            <p className="text-emerald-300 text-center text-sm">
              ✅ Payment confirmed! Proceed to dashboard or register your bank for withdrawals.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary text-primary-foreground font-semibold py-4 rounded-xl text-lg interactive-press"
              size="xl"
            >
              Proceed for Withdrawal
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Bank Registration Side Notification */}
        {showBankNotification && (
          <div className="bg-card/90 backdrop-blur-lg rounded-2xl p-5 border border-primary/40 animate-fade-up shadow-neon" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-base">Register Your Bank</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Register your valid bank for withdrawals
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowBankNotification(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 interactive-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Button
              onClick={() => navigate('/bank-registration-entry')}
              className="w-full mt-4 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-semibold rounded-xl interactive-press"
              variant="outline"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Register Bank Account
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          animation: confetti-fall 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentApproved;