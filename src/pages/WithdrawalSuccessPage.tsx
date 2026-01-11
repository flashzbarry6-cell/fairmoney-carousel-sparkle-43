import { ArrowRight, CheckCircle, CreditCard, Building2, Wallet, Shield, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
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
      {/* Animated Background */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-bg {
          background: linear-gradient(-45deg, #000000 0%, #0d001a 20%, #1a0033 40%, #2d004d 60%, #1a0033 80%, #000000 100%);
          background-size: 400% 400%;
          animation: gradientMove 12s ease infinite;
        }
        
        @keyframes checkmarkDraw {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6), 0 0 60px rgba(34, 197, 94, 0.3); }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .glow-pulse {
          animation: glowPulse 2s ease-in-out infinite;
        }
        
        .float-up {
          animation: floatUp 0.6s ease-out forwards;
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e 0%, #4ade80 25%, #86efac 50%, #4ade80 75%, #22c55e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 animated-bg"></div>
      
      {/* Decorative sparkles */}
      <div className="absolute top-20 left-10 text-purple-400 sparkle" style={{ animationDelay: '0s' }}>
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute top-40 right-8 text-green-400 sparkle" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="absolute bottom-40 left-16 text-yellow-400 sparkle" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-5 h-5" />
      </div>
      <div className="absolute bottom-60 right-12 text-purple-300 sparkle" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="relative z-10 w-full">
        {/* Success Icon with Animation */}
        <div className="flex justify-center mb-8">
          <div className={`relative transition-all duration-700 ${showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-32 h-32 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
            
            {/* Main icon container */}
            <div className="relative w-32 h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 rounded-full flex items-center justify-center glow-pulse shadow-2xl">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            
            {/* Animated ring */}
            <div className="absolute inset-0 w-32 h-32 border-4 border-green-400/50 rounded-full animate-ping"></div>
            
            {/* Bank icons floating around */}
            <div className="absolute -top-2 -right-4 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.4s' }}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="absolute top-1/2 -right-6 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.6s' }}>
              <Wallet className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className={`transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30 shadow-2xl shadow-green-500/10">
            {/* Title */}
            <h1 className="text-3xl font-bold text-center mb-2 shimmer-text">
              Withdrawal Successful
            </h1>
            
            <p className="text-gray-300 text-center mb-6">
              Your withdrawal request has been processed successfully.
            </p>

            {/* Amount Display */}
            <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-6 mb-6">
              <p className="text-green-300 text-sm text-center mb-2">Withdrawn Amount</p>
              <p className="text-4xl font-bold text-white text-center">
                ₦{withdrawalData.amount.toLocaleString()}
              </p>
            </div>

            {/* Transaction Details */}
            <div className="bg-purple-900/30 border border-purple-500/20 rounded-2xl p-5 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Plan</span>
                <span className="text-white font-semibold">{withdrawalData.plan}</span>
              </div>
              <div className="h-px bg-purple-500/20"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 text-sm font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approved
                </span>
              </div>
              <div className="h-px bg-purple-500/20"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction ID</span>
                <span className="text-purple-300 font-mono text-sm">{withdrawalData.transactionId}</span>
              </div>
              <div className="h-px bg-purple-500/20"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Date</span>
                <span className="text-white text-sm">{withdrawalData.timestamp}</span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mb-6 text-green-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secured by Lumexzz</span>
            </div>

            {/* Dashboard Button */}
            <Button
              onClick={handleGoToDashboard}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalSuccessPage;