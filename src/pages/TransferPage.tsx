import { ArrowLeft, Copy, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const TransferPage = () => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1000); // 1 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleTransfer = () => {
    setIsConfirming(true);
    // Show confirming payment for 8 seconds
    setTimeout(() => {
      navigate("/payment-not-confirmed");
    }, 8000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isConfirming) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-3 max-w-md mx-auto">
        <div className="absolute inset-0 animated-bg"></div>
        <div className="relative z-10 bg-black/40 backdrop-blur-lg rounded-2xl p-8 text-center space-y-6 w-full border border-purple-700/40">
          {/* Loading Animation */}
          <div className="flex justify-center">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-yellow-400">
              Confirming Payment
            </h2>
            <p className="text-gray-300">
              Please wait while we verify your transfer...
            </p>
          </div>

          <div className="flex justify-center space-x-1">
            <div
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></div>
            <div
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
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

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">
            Complete Payment
          </h1>
        </div>

        <div className="space-y-4">
          {/* Amount Card */}
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 text-center border border-purple-700/40 shadow-lg">
            <p className="text-sm text-gray-400 mb-2">Transfer Amount</p>
            <div className="flex justify-center items-center space-x-2 mb-1">
              <p className="text-4xl font-bold text-yellow-400">₦9,600</p>
              <Copy
                className="w-5 h-5 text-yellow-400 cursor-pointer hover:text-yellow-300"
                onClick={() => copyToClipboard("9600")}
              />
            </div>
            <p className="text-xs text-gray-400">Verification Fee</p>
          </div>

          {/* Bank Details Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4 border border-purple-700/40">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-white mb-1">
                Transfer to:
              </h2>
              <p className="text-sm text-gray-300">
                Complete this transfer to proceed
              </p>
            </div>

            {/* Horizontal Bank Info */}
            <div className="flex flex-col bg-black/30 rounded-xl p-4 border border-purple-700/40 space-y-3">
              <div className="flex justify-between items-center border-b border-purple-700/40 pb-2">
                <span className="text-sm text-gray-400">Bank:</span>
                <span className="font-semibold text-white">KOLOMONI MFB</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700/40 pb-2">
                <span className="text-sm text-gray-400">Account Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">1100677423</span>
                  <Copy
                    className="w-4 h-4 text-yellow-400 cursor-pointer hover:text-yellow-300"
                    onClick={() => copyToClipboard("1100677423")}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Account Name:</span>
                <span className="font-semibold text-white text-right">
                  Benjamin Charis Somtochukwu 
                </span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50/10 border border-yellow-400 rounded-lg p-4 mt-4 backdrop-blur-md">
              <p className="text-sm text-yellow-300 font-medium">
                ⚠️ Important: Transfer exactly ₦9,600 to the account above to
                verify your withdrawal request.
              </p>
            </div>
          </div>

          {/* Action Button Only */}
          <Button
            onClick={handleTransfer}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 rounded-full text-lg"
          >
            I Have Made Transfer
          </Button>
        </div>
      </div>

      {/* Popup Side Notification */}
      {showPopup && (
        <div className="fixed top-20 right-4 z-50 w-80 bg-gradient-to-br from-purple-900 via-black to-purple-800 text-white rounded-2xl shadow-xl overflow-hidden animate-slideIn">
          {/* Header */}
          <div className="flex justify-center items-center p-3 border-b border-purple-700/50 relative">
            <span className="font-bold text-lg text-center">PAY NGN 9600</span>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute right-3 top-3"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Chat Content with numbered warnings */}
          <div className="p-4 space-y-3 text-sm leading-relaxed">
            {[
              "DO NOT USE OPAY TO MAKE TRANSFER",
              "DO NOT DISPUTE ANY TRANSFER MADE TO OUR SERVICES IT MAY CAUSE WITHDRAW PROBLEMS",
              "THIS IS A ONE TIME PAYMENT OF 9600 FOR YOUR ACCOUNT VERIFICATION",
              "AFTER PAYMENT YOUR ACCOUNT WILL BE VERIFIED FOR WITHDRAWALS",
              "TRANSFER ONLY THE EXACT AMOUNT TO PREVENT SERVER ISSUES"
            ].map((text, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {index + 1}
                </span>
                <p className="uppercase text-white text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center p-3 border-t border-purple-700/50">
            <Button
              onClick={() => setShowPopup(false)}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold w-full"
            >
              I Understand
            </Button>
          </div>

          <style>{`
            @keyframes slideIn {
              0% { transform: translateX(100%); opacity: 0; }
              100% { transform: translateX(0); opacity: 1; }
            }
            .animate-slideIn {
              animation: slideIn 0.6s ease-out forwards;
            }
          `}</style>
        </div>
      )}

      {/* Inline background animation */}
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
};

export default TransferPage;
