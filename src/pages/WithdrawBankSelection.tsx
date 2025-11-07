import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Bank {
  name: string;
  code: string;
}

const WithdrawBankSelection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;
  const instantWithdraw = location.state?.instantWithdraw || false;

  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    bankCode: "",
    accountName: "",
  });
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);

  // Fetch banks from Paystack API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch("https://api.paystack.co/bank");
        const result = await response.json();

        if (result.status && result.data) {
          const bankList = result.data
            .map((bank: any) => ({
              name: bank.name,
              code: bank.code,
            }))
            .sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));

          setBanks(bankList);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
        toast({
          title: "Error",
          description: "Failed to load bank list. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, [toast]);

  const handleAccountNumberChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      accountNumber: value.replace(/\D/g, "").slice(0, 10),
    }));
  };

  const handleBankChange = (value: string) => {
    const selectedBank = banks.find((b) => b.name === value);
    if (selectedBank) {
      setFormData((prev) => ({
        ...prev,
        bankName: value,
        bankCode: selectedBank.code,
      }));
    }
  };


  const handleCashout = () => {
    if (!formData.accountNumber || !formData.bankName || !formData.accountName) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before cashing out.",
        variant: "destructive",
      });
      return;
    }

    // Navigate directly to withdrawal receipt
    navigate("/withdrawal-receipt", {
      state: {
        withdrawalData: {
          ...formData,
          amount: amount,
          instantWithdraw: instantWithdraw,
        },
      },
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center p-3 max-w-md mx-auto">
      {/* Animated background */}
      <div className="absolute inset-0 animated-bg"></div>

      {/* Page Content */}
      <div className="relative z-10 w-full">
        {/* Header */}
        <div className="flex items-center mb-6 pt-2">
          <Link to="/withdrawal-amount" className="mr-3">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-lg font-semibold text-white">Bank Details</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 space-y-4 border border-purple-700/40">
          {/* Amount Display */}
          <div className="text-center py-4 bg-black/30 rounded-lg border border-purple-700/40">
            <p className="text-sm text-gray-300">Withdrawal Amount</p>
            <p className="text-2xl font-bold text-yellow-400">₦{amount.toLocaleString()}.00</p>
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Account Number
            </label>
            <Input
              type="text"
              placeholder="Enter 10-digit account number"
              value={formData.accountNumber}
              onChange={(e) => handleAccountNumberChange(e.target.value)}
              className="w-full bg-black/20 text-white border border-purple-700"
              maxLength={10}
            />
          </div>

          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Select Bank
            </label>
            <Select
              onValueChange={handleBankChange}
              value={formData.bankName}
              disabled={isLoadingBanks}
            >
              <SelectTrigger className="w-full bg-black/20 text-white border border-purple-700">
                <SelectValue
                  placeholder={
                    isLoadingBanks ? "Loading banks..." : "Choose your bank"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank, idx) => (
                  <SelectItem key={`${bank.code}-${idx}`} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Account Name
            </label>
            <Input
              type="text"
              placeholder="Enter account name"
              value={formData.accountName}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountName: e.target.value }))}
              className="w-full bg-black/20 text-white border border-purple-700"
            />
          </div>

          {/* Golden Cash Out Button */}
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-full mt-6"
            onClick={handleCashout}
          >
            Cash Out
          </Button>
        </div>
      </div>

      {/* Inline gradient animation */}
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
      `}</style>
    </div>
  );
};

export default WithdrawBankSelection;
