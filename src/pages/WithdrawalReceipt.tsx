import { ArrowLeft, AlertTriangle, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const WithdrawalReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const withdrawalData = location.state?.withdrawalData;
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Show modal 3 seconds after page loads
  useEffect(() => {
    if (withdrawalData?.status === "pending") {
      const timer = setTimeout(() => setShowVerificationModal(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [withdrawalData]);

  // Get current date and time
  const currentDate = new Date();
  const formatDate = currentDate.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const formatTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Generate transaction reference
  const transactionRef = `FMP${Date.now().toString().slice(-8)}`;

  if (!withdrawalData) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-3 max-w-md mx-auto">
        <div className="absolute inset-0 animated-bg"></div>
        <div className="relative z-10 text-center bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-purple-700/40">
          <p className="text-gray-200">No withdrawal data found</p>
          <Link to="/dashboard">
            <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
              Back to Dashboard
            </Button>
          </Link>
        </div>

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
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-3 max-w-md mx-auto">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg"></div>

      {/* Page content */}
      <div className={`relative z-10 transition-all duration-300 ${showVerificationModal ? "blur-md" : ""}`}>
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">Withdrawal Receipt</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-6 border border-purple-700/40 shadow-lg">
          {/* Receipt Title */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">🧾 Withdrawal Receipt</h2>
            <p className="text-sm text-gray-300">Transaction summary and verification details</p>
          </div>

          {/* Transaction Receipt */}
          <div className="bg-black/30 rounded-xl p-5 space-y-3 border border-purple-700/40">
            <h3 className="text-sm font-semibold text-center text-gray-400 mb-3">TRANSACTION DETAILS</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">User:</span>
                <span className="font-semibold text-white text-sm">{withdrawalData.accountName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">Amount:</span>
                <span className="font-bold text-lg text-yellow-400">₦{withdrawalData.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-400">Date:</span>
                <span className="font-medium text-white text-sm">{formatDate}, {formatTime}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t border-purple-700/40 mt-2">
                <span className="text-sm text-gray-400">Status:</span>
                <span className="font-semibold text-red-500 flex items-center text-sm">🔴 Withdrawal Pending</span>
              </div>
            </div>
          </div>

          {/* Reason Box */}
          <div className="bg-yellow-50/10 border-l-4 border-yellow-400 rounded-lg p-4 backdrop-blur-md">
            <p className="text-sm text-yellow-300 flex items-start">
              <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>⚠️ Withdrawals are manually verified to prevent fraud and ensure referral authenticity.</strong>
              </span>
            </p>
          </div>

          {/* Bank Details */}
          <div className="bg-black/30 rounded-lg p-4 space-y-2 border border-purple-700/40">
            <p className="text-xs text-gray-400 font-semibold mb-2">BANK DETAILS</p>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-400">Bank:</span>
                <span className="font-medium text-white">{withdrawalData.bankName}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Account:</span>
                <span className="font-medium text-white">{withdrawalData.accountNumber}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-400">Reference:</span>
                <span className="font-medium text-gray-300 text-xs">{transactionRef}</span>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={() => navigate("/transfer-page", { state: { withdrawalData } })}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-full"
            >
              Fix Issue
            </Button>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowVerificationModal(false)}
        >
          <div
            className="relative bg-gradient-to-br from-black via-purple-950 to-purple-800 text-white p-6 rounded-2xl border border-purple-500/40 shadow-2xl max-w-md w-full mx-4 animate-pulse-slow"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-3 text-center text-purple-400">
              Lumexzz Account Verification
            </h2>
            <p className="text-sm text-gray-300 mb-4 text-center">
              To comply with CBN regulations and ensure all transactions are secure and legitimate, Lumexzz requires account verification for withdrawals. Completing verification guarantees your funds are safe, secure, and fully protected.
            </p>

            {/* Bank animation placeholder */}
            <div className="flex justify-center mb-4 space-x-2">
              <div className="w-8 h-8 bg-purple-700 rounded-full animate-bounce"></div>
              <div className="w-8 h-8 bg-yellow-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-8 h-8 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            </div>

            {/* Verify Account Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowVerificationModal(false);
                  navigate("/transfer-page", { state: { withdrawalData } });
                }}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-yellow-500/40 transition-all"
              >
                Verify Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inline animation styling */}
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

        .animate-pulse-slow {
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(128,0,255,0.5); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.2); }
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
};

export default WithdrawalReceipt;
