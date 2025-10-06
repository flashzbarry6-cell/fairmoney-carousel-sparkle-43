import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock } from "lucide-react";

export default function UpgradeConfirming() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = searchParams.get("plan") || "";
  const amount = searchParams.get("amount") || "";
  const name = searchParams.get("name") || "";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/payment-not-confirmed?from=upgrade&plan=${plan}&amount=${amount}&name=${name}`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, plan, amount, name]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-6">
      <div className="text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Clock className="w-16 h-16 text-white animate-spin" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Confirming Payment</h1>
          <p className="text-xl text-purple-300">
            Please wait while we verify your payment...
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <CheckCircle2 className="w-5 h-5 animate-pulse" />
            <span>Processing {name} upgrade</span>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
