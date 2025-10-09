import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Wallet, ArrowRight } from "lucide-react";

const UpgradeProcessing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/upgrade-payment-method?plan=${plan}&amount=${amount}`);
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate, plan, amount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto flex flex-col items-center justify-center">
      {/* Bank to Wallet Animation */}
      <div className="relative mb-8">
        <div className="flex items-center gap-8">
          {/* Bank Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center border border-purple-500/30">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          </div>

          {/* Arrow Animation */}
          <div className="animate-bounce">
            <ArrowRight className="w-8 h-8 text-yellow-400" />
          </div>

          {/* Wallet Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center border border-yellow-500/30">
              <Wallet className="w-10 h-10 text-black" />
            </div>
            <div className="absolute inset-0 bg-yellow-400 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Processing Text */}
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Processing Upgrade</h2>
      <p className="text-purple-300 text-center mb-6">
        Upgrading to {plan} Plan
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mb-4">
        <div className="bg-purple-900/30 rounded-full h-4 overflow-hidden border border-purple-500/30">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-yellow-400 transition-all duration-100 ease-linear flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
            <span className="text-xs font-bold text-white">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl px-6 py-3 border border-purple-500/20">
        <p className="text-purple-300 text-sm">Amount</p>
        <p className="text-yellow-400 text-2xl font-bold">₦{amount?.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default UpgradeProcessing;
