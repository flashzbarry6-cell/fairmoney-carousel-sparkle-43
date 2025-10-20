import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BuyData = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [formData, setFormData] = useState({
    phoneNumber: ""
  });
  const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);

  const networks = ["MTN", "Airtel", "Glo", "9mobile"];
  const dataPlans = [
    { size: "1GB", price: "₦300" },
    { size: "2GB", price: "₦600" },
    { size: "5GB", price: "₦1,500" },
    { size: "10GB", price: "₦3,000" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Handler for Upgrade button
  const handleUpgrade = () => {
    setShowUpgradeNotice(false); // close modal
    navigate("/upgrade");         // navigate to UpgradeAccount page
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-3 max-w-md mx-auto">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-bg"></div>

      {/* Page Content */}
      <div className={`relative z-10 transition-all duration-300 ${showUpgradeNotice ? "blur-md" : ""}`}>
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/dashboard" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white">Buy Data</h1>
        </div>

        <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-4 space-y-4 border border-purple-700/40">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Phone Number
            </label>
            <Input
              type="text"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full bg-black/30 border-purple-700/40 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Select Network
            </label>
            <div className="grid grid-cols-2 gap-3">
              {networks.map((network) => (
                <button
                  key={network}
                  onClick={() => setSelectedNetwork(network)}
                  className={`p-3 rounded-xl border text-center font-medium transition-colors ${
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

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Select Data Plan
            </label>
            <div className="space-y-3">
              {dataPlans.map((plan) => (
                <button
                  key={plan.size}
                  onClick={() => setSelectedPlan(plan.size)}
                  className={`w-full p-3 rounded-xl border text-center font-medium transition-colors ${
                    selectedPlan === plan.size
                      ? "bg-purple-700 text-white border-purple-500"
                      : "bg-black/30 border-purple-700/40 text-gray-200 hover:border-purple-500/50"
                  }`}
                >
                  {plan.size} - {plan.price}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-full mt-6"
            onClick={() => setShowUpgradeNotice(true)} // ✅ Trigger Upgrade modal
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
              To purchase data, please upgrade your Lumexzz account. Upgrading gives you full access to all premium features.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleUpgrade} // ✅ Navigate to upgrade
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

export default BuyData;
