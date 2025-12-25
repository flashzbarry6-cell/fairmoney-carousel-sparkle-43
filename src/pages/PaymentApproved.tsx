import { CheckCircle, ArrowRight, Wallet } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const PaymentApproved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const amount = location.state?.amount || 0;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 success-bg"></div>

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
                backgroundColor: ['#10b981', '#22c55e', '#4ade80', '#86efac', '#fbbf24'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full">
        {/* Main Card */}
        <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-green-500/30 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center animate-pulse-glow">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xl">🎉</span>
              </div>
            </div>
          </div>

          {/* Success Text */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-green-400">Payment Approved!</h1>
            <p className="text-gray-300 text-lg">
              Your payment has been verified successfully
            </p>
          </div>

          {/* Amount Credited */}
          <div className="bg-green-900/30 rounded-2xl p-5 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Amount Credited</p>
                  <p className="text-2xl font-bold text-green-400">₦{amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                CREDITED
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 rounded-xl p-4 border border-green-500/20">
            <p className="text-green-300 text-center">
              ✅ Your wallet has been credited successfully. You can now use your funds!
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 rounded-xl text-lg"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .success-bg {
          background: linear-gradient(-45deg, #022c22, #064e3b, #065f46, #000000);
          background-size: 400% 400%;
          animation: gradientMove 12s ease infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
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
