import { ArrowLeft, Copy, CheckCircle, AlertTriangle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const UpgradeBankTransfer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const plan = searchParams.get("plan");
  const amount = searchParams.get("amount");

  const bankDetails = {
    bankName: "Moniepoint",
    accountName: "Veronica Chisom Benjamin",
    accountNumber: "8102562883"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      description: `${label} copied to clipboard!`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMadePayment = () => {
    navigate(`/upgrade-receipt-upload?plan=${plan}&amount=${amount}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/upgrade-payment-method" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Bank Transfer</h1>
      </div>

      {/* Animated Bank Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center border border-purple-500/30 animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-purple-600 rounded-2xl blur-xl opacity-50"></div>
        </div>
      </div>

      {/* Plan Info */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-4 mb-6 border border-purple-500/30">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-purple-200 text-sm">Upgrading to</p>
            <p className="text-white font-bold text-lg">{plan} Plan</p>
          </div>
          <p className="text-yellow-400 text-2xl font-bold">₦{amount?.toLocaleString()}</p>
        </div>
      </div>

      {/* Bank Details Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-black rounded-2xl p-5 border border-purple-500/30 backdrop-blur-sm mb-6">
        <h3 className="text-white font-semibold mb-4 text-center">Transfer to:</h3>
        
        <div className="space-y-3">
          {/* Amount */}
          <div className="bg-black/50 rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-300 text-xs mb-1">Amount</p>
            <div className="flex items-center justify-between">
              <p className="text-yellow-400 text-xl font-bold">₦{amount?.toLocaleString()}</p>
              <Button
                onClick={() => copyToClipboard(amount || "", "Amount")}
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                {copied === "Amount" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Bank Name */}
          <div className="bg-black/50 rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-300 text-xs mb-1">Bank Name</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">{bankDetails.bankName}</p>
              <Button
                onClick={() => copyToClipboard(bankDetails.bankName, "Bank Name")}
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                {copied === "Bank Name" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Account Name */}
          <div className="bg-black/50 rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-300 text-xs mb-1">Account Name</p>
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold">{bankDetails.accountName}</p>
              <Button
                onClick={() => copyToClipboard(bankDetails.accountName, "Account Name")}
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                {copied === "Account Name" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Account Number */}
          <div className="bg-black/50 rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-300 text-xs mb-1">Account Number</p>
            <div className="flex items-center justify-between">
              <p className="text-white text-lg font-bold tracking-wider">{bankDetails.accountNumber}</p>
              <Button
                onClick={() => copyToClipboard(bankDetails.accountNumber, "Account Number")}
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300"
              >
                {copied === "Account Number" ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-red-200">
            <p className="font-semibold">Important Notice:</p>
            <ul className="space-y-1 list-disc list-inside text-xs">
              <li>Do NOT use Opay for transfer</li>
              <li>Transfer ONLY the exact amount shown</li>
              <li>Payment confirmation takes up to 30 minutes</li>
              <li>Keep your receipt for verification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Button */}
      <Button
        onClick={handleMadePayment}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-4 rounded-full border border-purple-500/30 text-lg"
      >
        I Have Made Payment
      </Button>
    </div>
  );
};

export default UpgradeBankTransfer;
