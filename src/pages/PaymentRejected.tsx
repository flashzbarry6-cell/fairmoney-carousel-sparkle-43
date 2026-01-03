import { XCircle, RefreshCw, MessageCircle, AlertTriangle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BlockedAccountOverlay from "@/components/BlockedAccountOverlay";

const PaymentRejected = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const amount = location.state?.amount || 0;
  const reason = location.state?.reason || "Payment could not be verified. Please contact support for assistance.";

  const handleRetryPayment = () => {
    navigate('/transfer');
  };

  return (
    <BlockedAccountOverlay>
      <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto flex items-center justify-center">
        {/* Animated background */}
        <div className="absolute inset-0 error-bg"></div>

        <div className="relative z-10 w-full">
          {/* Main Card */}
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-red-500/30 space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center animate-shake">
                  <XCircle className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-black" />
                </div>
              </div>
            </div>

            {/* Error Text */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold text-red-400">Payment Rejected</h1>
              <p className="text-gray-300 text-lg">
                Your payment was not approved
              </p>
            </div>

            {/* Amount Not Credited */}
            <div className="bg-red-900/30 rounded-2xl p-5 border border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Amount</p>
                  <p className="text-2xl font-bold text-red-400">₦{amount.toLocaleString()}</p>
                </div>
                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  NOT CREDITED
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-300 font-semibold mb-1">Reason for Rejection:</p>
                  <p className="text-gray-400 text-sm">{reason}</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="bg-gradient-to-r from-red-900/40 to-rose-900/40 rounded-xl p-4 border border-red-500/20">
              <p className="text-red-300 text-center">
                ❌ Please retry payment with a valid receipt.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRetryPayment}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-4 rounded-xl"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry Payment
              </Button>
              
              <Button
                onClick={() => navigate('/support')}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-4 rounded-xl"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .error-bg {
            background: linear-gradient(-45deg, #1a0000, #3b0000, #450a0a, #000000);
            background-size: 400% 400%;
            animation: gradientMove 12s ease infinite;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
            20%, 40%, 60%, 80% { transform: translateX(2px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </BlockedAccountOverlay>
  );
};

export default PaymentRejected;
