import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const InvestmentPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const planAmount = searchParams.get("plan");
  
  const planDetails: { [key: string]: { naira: number; returns: string } } = {
    "20": { naira: 32000, returns: "150%" },
    "50": { naira: 80000, returns: "200%" },
    "200": { naira: 320000, returns: "300%" }
  };

  const plan = planAmount ? planDetails[planAmount] : null;

  const bankDetails = {
    bankName: "First Bank Nigeria",
    accountName: "Lumexzz Investment Ltd",
    accountNumber: "3085749261"
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast({
      description: `${label} copied to clipboard!`,
    });
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmPayment = () => {
    navigate("/payment-not-confirmed");
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Invalid plan selected</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/investment" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Complete Investment</h1>
      </div>

      {/* Investment Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-5 mb-6 border border-purple-500/30">
        <h2 className="text-white font-semibold mb-3">Investment Summary</h2>
        <div className="space-y-2 text-purple-100">
          <div className="flex justify-between">
            <span>Plan Amount:</span>
            <span className="font-semibold">${planAmount} USD</span>
          </div>
          <div className="flex justify-between">
            <span>Amount to Pay:</span>
            <span className="font-semibold text-yellow-400">₦{plan.naira.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Expected Returns:</span>
            <span className="font-semibold text-green-400">{plan.returns}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-5 mb-6 border border-purple-500/20">
        <h3 className="text-white font-semibold mb-3">Payment Instructions</h3>
        <ol className="space-y-2 text-purple-200 text-sm list-decimal list-inside">
          <li>Transfer the exact amount to the account below</li>
          <li>Use the account number provided</li>
          <li>Click "Confirm Payment" after transferring</li>
          <li>Your investment will be activated within 24 hours</li>
        </ol>
      </div>

      {/* Bank Details Card */}
      <div className="bg-gradient-to-br from-purple-900/50 to-black rounded-2xl p-5 border border-purple-500/30 backdrop-blur-sm mb-6">
        <h3 className="text-white font-semibold mb-4 text-center">Transfer to:</h3>
        
        <div className="space-y-4">
          {/* Amount */}
          <div className="bg-black/50 rounded-xl p-4 border border-purple-500/20">
            <p className="text-purple-300 text-sm mb-1">Amount</p>
            <div className="flex items-center justify-between">
              <p className="text-yellow-400 text-2xl font-bold">₦{plan.naira.toLocaleString()}</p>
              <Button
                onClick={() => copyToClipboard(plan.naira.toString(), "Amount")}
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
            <p className="text-purple-300 text-sm mb-1">Bank Name</p>
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
            <p className="text-purple-300 text-sm mb-1">Account Name</p>
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
            <p className="text-purple-300 text-sm mb-1">Account Number</p>
            <div className="flex items-center justify-between">
              <p className="text-white text-xl font-bold tracking-wider">{bankDetails.accountNumber}</p>
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

      {/* Confirm Button */}
      <Button
        onClick={handleConfirmPayment}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-4 rounded-full border border-purple-500/30 text-lg"
      >
        Confirm Payment
      </Button>

      {/* Warning */}
      <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
        <p className="text-yellow-200 text-xs text-center">
          ⚠️ Please ensure you transfer the exact amount to avoid delays in activation
        </p>
      </div>
    </div>
  );
};

export default InvestmentPayment;
