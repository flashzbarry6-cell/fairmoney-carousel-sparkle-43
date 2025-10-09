import { ArrowLeft, Building2, Coins } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UpgradePaymentMethod = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");

  const handleBankTransfer = () => {
    navigate(`/upgrade-bank-transfer?plan=${plan}&amount=${amount}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/upgrade-account" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Select Payment Method</h1>
      </div>

      {/* Plan Info */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-5 mb-6 border border-purple-500/30">
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-1">Upgrading to</p>
          <h2 className="text-white text-2xl font-bold mb-2">{plan} Plan</h2>
          <p className="text-yellow-400 text-3xl font-bold">₦{amount?.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        {/* Bank Transfer */}
        <button
          onClick={handleBankTransfer}
          className="w-full bg-gradient-to-br from-purple-900/50 to-black rounded-2xl p-6 border border-purple-500/30 backdrop-blur-sm hover:border-purple-400 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-white font-semibold text-lg mb-1">Bank Transfer</h3>
              <p className="text-purple-300 text-sm">Transfer directly to our bank account</p>
            </div>
          </div>
        </button>

        {/* Crypto (Coming Soon) */}
        <div className="relative">
          <div className="w-full bg-gradient-to-br from-gray-900/50 to-black rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                <Coins className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-gray-400 font-semibold text-lg mb-1">Cryptocurrency</h3>
                <p className="text-gray-500 text-sm">Pay with Bitcoin, USDT, or other crypto</p>
              </div>
            </div>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
            COMING SOON
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-purple-900/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
        <p className="text-purple-200 text-sm text-center">
          Choose your preferred payment method to complete the upgrade
        </p>
      </div>
    </div>
  );
};

export default UpgradePaymentMethod;
