import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WithdrawBankSelection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;

  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    accountName: "",
  });

  const banks = [
    { name: "Access Bank", logo: "🏦" },
    { name: "Citibank", logo: "🏦" },
    { name: "Ecobank", logo: "🏦" },
    { name: "Fidelity Bank", logo: "🏦" },
    { name: "First Bank of Nigeria", logo: "🏦" },
    { name: "First City Monument Bank", logo: "🏦" },
    { name: "Globus Bank", logo: "🏦" },
    { name: "Guaranty Trust Bank", logo: "🏦" },
    { name: "Heritage Bank", logo: "🏦" },
    { name: "Jaiz Bank", logo: "🏦" },
    { name: "Keystone Bank", logo: "🏦" },
    { name: "Kuda Bank", logo: "🏦" },
    { name: "Moniepoint", logo: "🏦" },
    { name: "Opay", logo: "🏦" },
    { name: "Palmpay", logo: "🏦" },
    { name: "Polaris Bank", logo: "🏦" },
    { name: "Providus Bank", logo: "🏦" },
    { name: "Stanbic IBTC Bank", logo: "🏦" },
    { name: "Standard Chartered", logo: "🏦" },
    { name: "Sterling Bank", logo: "🏦" },
    { name: "SunTrust Bank", logo: "🏦" },
    { name: "Titan Trust Bank", logo: "🏦" },
    { name: "Union Bank", logo: "🏦" },
    { name: "United Bank for Africa", logo: "🏦" },
    { name: "Unity Bank", logo: "🏦" },
    { name: "VFD Microfinance Bank", logo: "🏦" },
    { name: "Wema Bank", logo: "🏦" },
    { name: "Zenith Bank", logo: "🏦" },
  ].sort((a, b) => a.name.localeCompare(b.name));

  const handleAccountNumberChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      accountNumber: value.replace(/\D/g, "").slice(0, 10),
    }));
  };

  const handleBankChange = (value: string) => {
    setFormData((prev) => ({ ...prev, bankName: value }));
  };

  const handleAccountNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, accountName: value }));
  };

  const handleCashout = () => {
    if (!formData.accountNumber || !formData.bankName || !formData.accountName) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    navigate("/withdrawal-receipt", {
      state: {
        withdrawalData: {
          ...formData,
          amount: amount,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 p-3 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/withdrawal-amount" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Bank Details</h1>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        {/* Amount Display */}
        <div className="text-center py-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
          <p className="text-2xl font-bold text-primary">
            ₦{amount.toLocaleString()}.00
          </p>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Number
          </label>
          <Input
            type="text"
            placeholder="Enter 10-digit account number"
            value={formData.accountNumber}
            onChange={(e) => handleAccountNumberChange(e.target.value)}
            className="w-full"
            maxLength={10}
          />
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Select Bank
          </label>
          <Select onValueChange={handleBankChange} value={formData.bankName}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.name} value={bank.name}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{bank.logo}</span>
                    <span>{bank.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Account Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Name
          </label>
          <Input
            type="text"
            placeholder="Enter account name"
            value={formData.accountName}
            onChange={(e) => handleAccountNameChange(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Cashout Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6"
          onClick={handleCashout}
        >
          Cashout
        </Button>
      </div>
    </div>
  );
};

export default WithdrawBankSelection;
