import { ArrowRight, CheckCircle, CreditCard, Building2, Wallet, Shield, Sparkles, Banknote, ArrowUpRight, BadgeCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface WithdrawalData {
  amount: number;
  plan: string;
  transactionId: string;
  timestamp: string;
}

const WithdrawalSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [countedAmount, setCountedAmount] = useState(0);
  
  const withdrawalData = location.state?.withdrawalData as WithdrawalData;
  
  // Redirect if no withdrawal data
  useEffect(() => {
    if (!withdrawalData) {
      navigate('/dashboard');
      return;
    }
    
    // Animate checkmark appearance
    const timer1 = setTimeout(() => setShowCheckmark(true), 300);
    const timer2 = setTimeout(() => setShowContent(true), 800);
    
    // Count-up animation for amount
    const timer3 = setTimeout(() => {
      const duration = 1500;
      const startTime = Date.now();
      const targetAmount = withdrawalData.amount;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCountedAmount(Math.round(targetAmount * easeOut));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [withdrawalData, navigate]);

  if (!withdrawalData) {
    return null;
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-6 bg-background">
      {/* Animated Background - Simplified */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-72 h-72 bg-primary/15 rounded-full blur-[100px] animate-float" 
          style={{ top: '-10%', left: '-10%' }} 
        />
        <div className="absolute w-64 h-64 bg-success/10 rounded-full blur-[80px] animate-float" 
          style={{ bottom: '-5%', right: '-10%', animationDelay: '2s' }} 
        />
      </div>
      
      {/* Floating Icons - Smaller & Subtle */}
      <div className="absolute top-20 left-6 text-primary/40 animate-float" style={{ animationDelay: '0s' }}>
        <CreditCard className="w-5 h-5" />
      </div>
      <div className="absolute top-32 right-8 text-primary/40 animate-float" style={{ animationDelay: '1.5s' }}>
        <Building2 className="w-5 h-5" />
      </div>
      <div className="absolute bottom-36 left-10 text-primary/40 animate-float" style={{ animationDelay: '2.5s' }}>
        <Banknote className="w-5 h-5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-[92%] max-w-[380px] mx-auto">
        {/* Success Icon */}
        <div className="flex justify-center mb-5">
          <div className={`relative transition-all duration-500 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {/* Glow */}
            <div className="absolute inset-0 w-20 h-20 bg-success/30 rounded-full blur-xl"></div>
            
            {/* Icon container */}
            <div className="relative w-20 h-20 bg-gradient-to-br from-success to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            {/* Ping */}
            <div className="absolute inset-0 w-20 h-20 border-2 border-success/40 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Content Card */}
        <div className={`transition-all duration-500 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-5 border border-primary/20 shadow-xl">
            {/* Title */}
            <h1 className="text-xl font-semibold text-center mb-1 text-foreground">
              Withdrawal Successful
            </h1>
            
            <p className="text-sm text-muted-foreground text-center mb-4">
              Your request has been processed.
            </p>

            {/* Amount */}
            <div className="bg-success/10 border border-success/25 rounded-xl p-4 mb-4">
              <p className="text-success text-xs text-center mb-1 font-medium">Withdrawn Amount</p>
              <p className="text-2xl font-bold text-foreground text-center">
                ₦{countedAmount.toLocaleString()}
              </p>
            </div>

            {/* Details */}
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 mb-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-foreground font-medium">{withdrawalData.plan}</span>
              </div>
              <div className="h-px bg-border/50"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/15 border border-success/30 rounded-full text-success text-xs font-medium">
                  <BadgeCheck className="w-3 h-3" />
                  Approved
                </span>
              </div>
              <div className="h-px bg-border/50"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="text-primary font-mono text-xs">{withdrawalData.transactionId}</span>
              </div>
              <div className="h-px bg-border/50"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground text-xs">{withdrawalData.timestamp}</span>
              </div>
            </div>

            {/* Security */}
            <div className="flex items-center justify-center gap-1.5 mb-4 text-success text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Secured by Lumexzz</span>
            </div>

            {/* Button */}
            <Button
              onClick={handleGoToDashboard}
              className="w-full h-11 text-sm font-medium rounded-xl bg-primary hover:bg-primary/90"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSuccessPage;
