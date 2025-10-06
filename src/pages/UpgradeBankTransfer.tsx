import { ArrowLeft, Copy, Building2, AlertCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function UpgradeBankTransfer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const plan = searchParams.get("plan") || "";
  const amount = searchParams.get("amount") || "";
  const name = searchParams.get("name") || "";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

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
            <h1 className="text-2xl font-bold">Bank Transfer</h1>
            <p className="text-sm opacity-90">Complete your payment</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Plan Summary */}
        <Card className="bg-gradient-to-br from-white to-purple-50 p-6 border-2 border-purple-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-600">Plan</p>
              <p className="text-xl font-bold text-purple-600">{name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Amount to Pay</p>
              <p className="text-2xl font-bold text-gray-800">₦{parseInt(amount).toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Bank Account Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
          <Card className="relative bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Transfer Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-lg">
                <span className="text-sm opacity-90">Bank Name</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">Moniepoint</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("Moniepoint")}
                    className="text-white hover:bg-white/20"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-lg">
                <span className="text-sm opacity-90">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">8102562883</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard("8102562883")}
                    className="text-white hover:bg-white/20"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl backdrop-blur-lg">
                <span className="text-sm opacity-90">Amount</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">₦{parseInt(amount).toLocaleString()}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(amount)}
                    className="text-white hover:bg-white/20"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="bg-yellow-50 border-2 border-yellow-300 p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Important Notice</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Do NOT use Opay for transfer</li>
                <li>• Transfer the EXACT amount only</li>
                <li>• Payment confirmation takes up to 30 minutes</li>
                <li>• Keep your receipt for verification</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button
          onClick={() => navigate(`/upgrade-receipt-upload?plan=${plan}&amount=${amount}&name=${name}`)}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-6 text-lg font-semibold"
        >
          I Have Made Payment
        </Button>
      </div>
    </div>
  );
}
