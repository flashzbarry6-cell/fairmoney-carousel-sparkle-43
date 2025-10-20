import { useState } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const BuyAirtime = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);

  const networks = ["MTN", "Airtel", "Glo", "9mobile"];

  return (
    <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg"></div>

      {/* Page Content */}
      <div className={`relative z-10 transition-all duration-300 ${showUpgradeNotice ? "blur-md" : ""}`}>
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white">Buy Airtime</h1>
        </div>

        {/* Form Card */}
        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 space-y-6 border border-purple-700/40">
          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Phone Number</label>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full bg-black/30 border-purple-700/40 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Network Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-200">Select Network</label>
            <div className="grid grid-cols-2 gap-3">
              {networks.map((network) => (
                <button
                  key={network}
                  onClick={() => setSelectedNetwork(network)}
                  className={`p-4 rounded-lg border text-center font-medium transition-colors ${
                    selectedNetwork === network
                      ? "bg-purple-700 text-white border-purple-500"
                      : "bg-black/30 border-purple-700/40 text-gray-200 hover:border-purple-500/50"
                  }`}
                >
                  {network}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Amount</label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/30 border-purple-700/40 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-full mt-4 shadow-lg hover:shadow-yellow-500/40 transition-shadow"
            onClick={() => setShowUpgradeNotice(true)}
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Upgrade Notification Modal */}
      {showUpgradeNotice && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowUpgradeNotice(false)}
        >
          <div
            className="relative bg-gradient-to-br from-black via-purple-950 to-purple-800 text-white p-6 rounded-2xl border border-purple-500/40 shadow-2xl max-w-sm w-full mx-4 animate-pulse-slow"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3 text-center text-purple-300">
              Kindly Upgrade Your Lumexzz Account
            </h2>
            <p className="text-sm text-center text-gray-300 mb-5">
              To purchase airtime, please upgrade your Lumexzz account. Upgrading gives you full access to all premium features.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/upgrade")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-yellow-500/40 transition-all"
              >
                Upgrade
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Animated Background CSS */}
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
      `}</style>
    </div>
  );
};

export default BuyAirtime;
