import { ArrowRight, CheckCircle, Wallet, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import BlockedAccountOverlay from "@/components/BlockedAccountOverlay";

const PaymentApproved = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);
  
  const amount = location.state?.amount || 6800;
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

  const handleProceedToWithdrawal = () => {
    navigate('/bank-registration');
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
                Your payment of <span className="text-luxury-gold font-bold">₦{amount.toLocaleString()}</span> has been verified successfully.
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
                  <p className="text-gray-400">₦{amount.toLocaleString()} added to your balance</p>
                </div>
              </div>
            </div>

            {/* Action Button - Single CTA */}
            <Button
              onClick={handleProceedToWithdrawal}
              className="w-full bg-gradient-to-r from-luxury-purple to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold text-lg btn-press shadow-lg shadow-purple-500/30"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Proceed for Withdrawal
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
        `}</style>
      </div>
    </BlockedAccountOverlay>
  );
};

export default PaymentApproved;
