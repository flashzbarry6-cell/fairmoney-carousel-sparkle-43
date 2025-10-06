import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UpgradeProcessing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const plan = searchParams.get("plan") || "";
  const amount = searchParams.get("amount") || "";
  const name = searchParams.get("name") || "";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-6">
      <Card className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="text-center">
          {/* Animation */}
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-25"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Wallet className="w-16 h-16 text-white animate-pulse" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Upgrade</h2>
          <p className="text-gray-600 mb-8">
            Upgrading to <span className="font-bold text-purple-600">{name}</span> plan
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-8">{progress}%</p>

          {/* Plan Details */}
          {isComplete && (
            <div className="space-y-4 animate-fade-in">
              <Card className="bg-purple-50 p-4">
                <p className="text-sm text-gray-600">Plan Selected</p>
                <p className="text-lg font-bold text-purple-600">{name} Tier</p>
              </Card>
              
              <Card className="bg-purple-50 p-4">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg font-bold text-gray-800">₦{parseInt(amount).toLocaleString()}</p>
              </Card>

              <Button
                onClick={() => navigate(`/upgrade-payment-method?plan=${plan}&amount=${amount}&name=${name}`)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-6 text-lg font-semibold"
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
