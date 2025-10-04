import { ArrowLeft, Check } from "lucide-react";
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
  
  const [formData, setFormData] = useState({
    accountNumber: "",
    bankName: "",
    bankCode: "",
    accountName: ""
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(true);

  // Fetch banks from Paystack API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch('https://api.paystack.co/bank');
        const result = await response.json();
        
        if (result.status && result.data) {
          const bankList = result.data.map((bank: any) => ({
            name: bank.name,
            code: bank.code
          })).sort((a: Bank, b: Bank) => a.name.localeCompare(b.name));
          
          setBanks(bankList);
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        toast({
          title: "Error",
          description: "Failed to load bank list. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingBanks(false);
      }
    };

    fetchBanks();
  }, [toast]);

  const handleAccountNumberChange = (value: string) => {
    setFormData(prev => ({ ...prev, accountNumber: value }));
    setIsVerified(false);
    setFormData(prev => ({ ...prev, accountName: "" }));
    
    if (value.length === 10 && formData.bankCode) {
      verifyAccount(value, formData.bankCode);
    }
  };

  const handleBankChange = (value: string) => {
    const selectedBank = banks.find(b => b.name === value);
    if (selectedBank) {
      setFormData(prev => ({ 
        ...prev, 
        bankName: value,
        bankCode: selectedBank.code 
      }));
      setIsVerified(false);
      setFormData(prev => ({ ...prev, accountName: "" }));
      
      if (formData.accountNumber.length === 10) {
        verifyAccount(formData.accountNumber, selectedBank.code);
      }
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
          <Select onValueChange={handleBankChange} value={formData.bankName} disabled={isLoadingBanks}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingBanks ? "Loading banks..." : "Choose your bank"} />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.code} value={bank.name}>
                  {bank.name}
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
                  className={`w-full bg-muted/50 ${!isVerified && formData.accountName && formData.accountName.includes('Could not') ? 'text-red-500' : ''}`}
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