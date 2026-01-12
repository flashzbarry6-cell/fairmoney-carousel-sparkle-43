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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      {/* 🔥 Phoenix Animated Background */}
      <div className="absolute inset-0 phoenix-bg-animated"></div>
      
      {/* Floating Purple Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-float" 
          style={{ top: '-15%', left: '-15%' }} 
        />
        <div className="absolute w-[350px] h-[350px] bg-primary/15 rounded-full blur-[100px] animate-float" 
          style={{ bottom: '-10%', right: '-15%', animationDelay: '3s' }} 
        />
        <div className="absolute w-[200px] h-[200px] bg-success/10 rounded-full blur-[80px] animate-float" 
          style={{ top: '30%', right: '10%', animationDelay: '5s' }} 
        />
        
        {/* Phoenix glow lines */}
        <div className="phoenix-glow-line top-1/4 opacity-40" />
        <div className="phoenix-glow-line top-1/2 opacity-30" style={{ animationDelay: '1s' }} />
        <div className="phoenix-glow-line top-3/4 opacity-35" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Floating Bank Icons */}
      <div className="absolute top-16 left-6 text-primary/60 animate-float" style={{ animationDelay: '0s' }}>
        <div className="w-12 h-12 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/30">
          <CreditCard className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute top-32 right-8 text-primary/60 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-10 h-10 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/30">
          <Building2 className="w-5 h-5" />
        </div>
      </div>
      <div className="absolute bottom-32 left-10 text-primary/60 animate-float" style={{ animationDelay: '2.5s' }}>
        <div className="w-11 h-11 bg-primary/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-primary/30">
          <Banknote className="w-5 h-5" />
        </div>
      </div>
      <div className="absolute bottom-48 right-6 text-primary/60 animate-float" style={{ animationDelay: '3.5s' }}>
        <div className="w-9 h-9 bg-primary/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/30">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
      
      {/* Decorative Sparkles */}
      <div className="absolute top-24 left-1/4 text-primary/50 animate-pulse" style={{ animationDelay: '0s' }}>
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute top-44 right-1/4 text-success/60 animate-pulse" style={{ animationDelay: '0.7s' }}>
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute bottom-40 left-1/3 text-gold/50 animate-pulse" style={{ animationDelay: '1.4s' }}>
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="relative z-10 w-full">
        {/* Success Icon with Phoenix Animation */}
        <div className="flex justify-center mb-8">
          <div className={`relative transition-all duration-700 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-32 h-32 bg-success/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Secondary glow */}
            <div className="absolute -inset-4 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-float"></div>
            
            {/* Main icon container */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-success via-emerald-500 to-success rounded-full flex items-center justify-center shadow-2xl"
              style={{
                boxShadow: '0 0 40px hsl(142 76% 42% / 0.5), 0 0 80px hsl(142 76% 42% / 0.2), inset 0 2px 4px rgba(255,255,255,0.2)'
              }}
            >
              <CheckCircle className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
            
            {/* Animated ping ring */}
            <div className="absolute inset-0 w-32 h-32 border-4 border-success/50 rounded-full animate-ping"></div>
            
            {/* Floating accent icons */}
            <div className="absolute -top-2 -right-4 w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center shadow-lg animate-bounce border border-primary/50" style={{ animationDelay: '0.2s' }}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-gradient-to-br from-primary-dark to-primary rounded-full flex items-center justify-center shadow-lg animate-bounce border border-primary/50" style={{ animationDelay: '0.4s' }}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-1/2 -right-6 w-8 h-8 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center shadow-lg animate-bounce border border-gold/50" style={{ animationDelay: '0.6s' }}>
              <Wallet className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className={`transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="phoenix-card-glow">
            {/* Title with shimmer */}
            <h1 className="text-3xl font-bold text-center mb-2 glow-text text-foreground">
              Withdrawal Successful
            </h1>
            
            <p className="text-muted-foreground text-center mb-6">
              Your withdrawal request has been processed successfully.
            </p>

            {/* Amount Display with count-up */}
            <div className="bg-success/10 border border-success/30 rounded-2xl p-6 mb-6 relative overflow-hidden">
              {/* Shimmer overlay */}
              <div className="absolute inset-0 shimmer opacity-50"></div>
              
              <p className="text-success text-sm text-center mb-2 font-medium relative z-10">Withdrawn Amount</p>
              <p className="text-4xl font-bold text-foreground text-center relative z-10 count-up">
                ₦{countedAmount.toLocaleString()}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Plan</span>
                <span className="text-foreground font-semibold">{withdrawalData.plan}</span>
              </div>
              <div className="phoenix-divider"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/20 border border-success/40 rounded-full text-success text-sm font-medium">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Approved
                </span>
              </div>
              <div className="phoenix-divider"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="text-primary font-mono text-sm">{withdrawalData.transactionId}</span>
              </div>
              <div className="phoenix-divider"></div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground text-sm">{withdrawalData.timestamp}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 text-success text-sm">
              <Shield className="w-4 h-4" />
              <span>Secured by Lumexzz</span>
            </div>

            {/* Dashboard Button */}
            <Button
              onClick={handleGoToDashboard}
              variant="phoenix"
              size="xl"
              className="w-full"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
        
        {/* Phoenix Divider */}
        <div className="mt-8 flex justify-center animate-fade-up" style={{ animationDelay: '1s' }}>
          <div className="phoenix-divider w-32" />
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSuccessPage;
