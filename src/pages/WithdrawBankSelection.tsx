import { ArrowLeft, Check } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WithdrawBankSelection = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount || 0;
  
  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    accountName: ""
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const banks = [
    { name: "Access Bank", code: "044", logo: "🏦" },
    { name: "First Bank of Nigeria", code: "011", logo: "🏦" },
    { name: "Guaranty Trust Bank", code: "058", logo: "🏦" },
    { name: "United Bank for Africa", code: "033", logo: "🏦" },
    { name: "Zenith Bank", code: "057", logo: "🏦" },
    { name: "Opay", code: "999992", logo: "🏦" },
    { name: "Palmpay", code: "999991", logo: "🏦" },
    { name: "Moniepoint", code: "50515", logo: "🏦" },
    { name: "Kuda Bank", code: "50211", logo: "🏦" },
    { name: "Citibank", code: "023", logo: "🏦" },
    { name: "Ecobank", code: "050", logo: "🏦" },
    { name: "Fidelity Bank", code: "070", logo: "🏦" },
    { name: "First City Monument Bank", code: "214", logo: "🏦" },
    { name: "Globus Bank", code: "00103", logo: "🏦" },
    { name: "Heritage Bank", code: "030", logo: "🏦" },
    { name: "Jaiz Bank", code: "301", logo: "🏦" },
    { name: "Keystone Bank", code: "082", logo: "🏦" },
    { name: "Polaris Bank", code: "076", logo: "🏦" },
    { name: "Providus Bank", code: "101", logo: "🏦" },
    { name: "Stanbic IBTC Bank", code: "221", logo: "🏦" },
    { name: "Standard Chartered", code: "068", logo: "🏦" },
    { name: "Sterling Bank", code: "232", logo: "🏦" },
    { name: "SunTrust Bank", code: "100", logo: "🏦" },
    { name: "Titan Trust Bank", code: "102", logo: "🏦" },
    { name: "Union Bank", code: "032", logo: "🏦" },
    { name: "Unity Bank", code: "215", logo: "🏦" },
    { name: "VFD Microfinance Bank", code: "566", logo: "🏦" },
    { name: "Wema Bank", code: "035", logo: "🏦" }
  ].sort((a, b) => a.name.localeCompare(b.name));

  const handleAccountNumberChange = (value: string) => {
    setFormData(prev => ({ ...prev, accountNumber: value }));
    setIsVerified(false);
    setFormData(prev => ({ ...prev, accountName: "" }));
    
    if (value.length === 10 && formData.bankName) {
      const selectedBank = banks.find(b => b.name === formData.bankName);
      if (selectedBank) {
        verifyAccount(value, selectedBank.code);
      }
    }
  };

  const handleBankChange = (value: string) => {
    const selectedBank = banks.find(b => b.name === value);
    setFormData(prev => ({ ...prev, bankName: value }));
    setIsVerified(false);
    setFormData(prev => ({ ...prev, accountName: "" }));
    
    if (formData.accountNumber.length === 10 && selectedBank) {
      verifyAccount(formData.accountNumber, selectedBank.code);
    }
  };

  const verifyAccount = async (accountNumber: string, bankCode: string) => {
    if (accountNumber.length !== 10 || !bankCode) return;
    
    setIsVerifying(true);
    setIsVerified(false);
    setFormData(prev => ({ ...prev, accountName: "" }));
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-bank', {
        body: { account_number: accountNumber, bank_code: bankCode }
      });

      console.log('Verification response:', data, error);

      if (error) {
        throw new Error(error.message);
      }

      if (data.success && data.account_name) {
        setFormData(prev => ({ ...prev, accountName: data.account_name }));
        setIsVerified(true);
        toast({
          title: "Account Verified",
          description: `Account belongs to ${data.account_name}`,
        });
      } else {
        setFormData(prev => ({ ...prev, accountName: "Could not verify account" }));
        setIsVerified(false);
        toast({
          title: "Verification Failed",
          description: data.error || "Could not verify account",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setFormData(prev => ({ ...prev, accountName: "Could not verify account" }));
      setIsVerified(false);
      toast({
        title: "Verification Error",
        description: "Could not verify account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCashout = () => {
    if (!formData.accountNumber || !formData.bankName || !isVerified) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields and verify your account.",
        variant: "destructive"
      });
      return;
    }

    // Navigate directly to withdrawal receipt
    navigate('/withdrawal-receipt', {
      state: {
        withdrawalData: {
          ...formData,
          amount: amount
        }
      }
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
          <p className="text-2xl font-bold text-primary">₦{amount.toLocaleString()}.00</p>
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Number</label>
          <Input
            type="text"
            placeholder="Enter 10-digit account number"
            value={formData.accountNumber}
            onChange={(e) => handleAccountNumberChange(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full"
            maxLength={10}
          />
        </div>

        {/* Bank Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Select Bank</label>
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

        {/* Account Name Display */}
        {(formData.accountNumber.length === 10 && formData.bankName) && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
            <div className="relative">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={isVerifying ? "Verifying..." : formData.accountName}
                  disabled
                  className={`w-full bg-muted/50 ${!isVerified && formData.accountName ? 'text-red-500' : ''}`}
                />
                {isVerified && formData.bankName && (
                  <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-2">
                    <span className="font-medium">Bank: </span>
                    <span>{formData.bankName}</span>
                  </div>
                )}
              </div>
              {isVerified && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              )}
            </div>
            {isVerified && (
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <Check className="w-3 h-3 mr-1" />
                Account verified successfully
              </p>
            )}
          </div>
        )}

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6"
          onClick={handleCashout}
          disabled={!isVerified || isVerifying}
        >
          {isVerifying ? "Verifying Account..." : "Cashout"}
        </Button>
      </div>
    </div>
  );
};

export default WithdrawBankSelection;