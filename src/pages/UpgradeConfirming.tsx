import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const UpgradeConfirming = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/payment-not-confirmed");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center border border-purple-500/30">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
        <div className="absolute inset-0 bg-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
      </div>

      {/* Text */}
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Confirming Payment</h2>
      <p className="text-purple-300 text-center mb-6">
        Please wait while we verify your payment
      </p>

      {/* Plan Info */}
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl px-6 py-4 border border-purple-500/20">
        <div className="text-center">
          <p className="text-purple-300 text-sm mb-1">{plan} Plan</p>
          <p className="text-yellow-400 text-xl font-bold">₦{amount?.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-8">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
};

export default UpgradeConfirming;
