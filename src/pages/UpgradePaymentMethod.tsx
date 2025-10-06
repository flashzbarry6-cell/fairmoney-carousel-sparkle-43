import { ArrowLeft, Building2, Coins } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UpgradePaymentMethod() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = searchParams.get("plan") || "";
  const amount = searchParams.get("amount") || "";
  const name = searchParams.get("name") || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Select Payment Method</h1>
            <p className="text-sm opacity-90">Choose how to pay for your upgrade</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Plan Summary */}
        <Card className="bg-gradient-to-br from-white to-purple-50 p-6 border-2 border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Upgrading to</p>
              <p className="text-xl font-bold text-purple-600">{name} Plan</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-2xl font-bold text-gray-800">₦{parseInt(amount).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
          
          {/* Bank Transfer */}
          <Card
            onClick={() => navigate(`/upgrade-bank-transfer?plan=${plan}&amount=${amount}&name=${name}`)}
            className="bg-white p-6 cursor-pointer hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-800">Bank Transfer</h4>
                <p className="text-sm text-gray-600">Transfer directly to our account</p>
              </div>
              <ArrowLeft className="w-6 h-6 text-purple-600 rotate-180" />
            </div>
          </Card>

          {/* Crypto (Coming Soon) */}
          <Card className="bg-gray-100 p-6 opacity-60 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-600">Cryptocurrency</h4>
                <p className="text-sm text-gray-500">Coming Soon</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
