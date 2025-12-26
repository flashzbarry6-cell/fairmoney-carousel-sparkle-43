import { ArrowLeft, Building2, Check, Loader2, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const nigerianBanks = [
  "Access Bank",
  "Citibank",
  "Ecobank Nigeria",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank (FCMB)",
  "Guaranty Trust Bank (GTBank)",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Providus Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Union Bank of Nigeria",
  "United Bank for Africa (UBA)",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
  "Opay",
  "Kuda Bank",
  "Palmpay",
  "Moniepoint"
];

const BankRegistrationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    accountType: "savings"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountName || !formData.bankName || !formData.accountNumber) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.accountNumber.length !== 10) {
      toast({
        title: "Invalid Account Number",
        description: "Account number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { error } = await supabase
        .from('bank_accounts')
        .insert({
          user_id: user.id,
          account_name: formData.accountName,
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_type: formData.accountType
        });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Success",
        description: "Bank account registered successfully!",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to register bank account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-4">
        {/* Success glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 text-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)]">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 font-['Inter']">Bank Account Registered!</h1>
          <p className="text-gray-400 mb-6 font-['Inter']">Your bank account has been successfully added.</p>
          <p className="text-gray-500 text-sm font-['Inter']">Redirecting to dashboard...</p>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6B2CF5]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Link to="/dashboard" className="mr-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white font-['Inter']">Register Your Bank Account</h1>
        </div>

        {/* Success Banner */}
        <div className="animate-slide-up bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-green-400 font-semibold font-['Inter']">Payment Approved!</p>
            <p className="text-gray-400 text-sm font-['Inter']">Now register your bank details</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="animate-slide-up-delay-1">
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-[#6B2CF5]/30 shadow-[0_0_30px_rgba(107,44,245,0.1)] space-y-5">
            {/* Icon Header */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6B2CF5] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(107,44,245,0.4)]">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-['Inter']">Account Holder Name</Label>
              <Input
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Enter account holder name"
                className="h-12 bg-white/5 border-[#6B2CF5]/30 text-white placeholder:text-gray-500 focus:border-[#6B2CF5] rounded-xl font-['Inter']"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-['Inter']">Bank Name</Label>
              <Select 
                value={formData.bankName} 
                onValueChange={(value) => setFormData({ ...formData, bankName: value })}
              >
                <SelectTrigger className="h-12 bg-white/5 border-[#6B2CF5]/30 text-white rounded-xl font-['Inter']">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1f] border-[#6B2CF5]/30 max-h-60">
                  {nigerianBanks.map((bank) => (
                    <SelectItem 
                      key={bank} 
                      value={bank}
                      className="text-white hover:bg-[#6B2CF5]/20 font-['Inter']"
                    >
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-['Inter']">Account Number</Label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, accountNumber: value });
                }}
                placeholder="Enter 10-digit account number"
                className="h-12 bg-white/5 border-[#6B2CF5]/30 text-white placeholder:text-gray-500 focus:border-[#6B2CF5] rounded-xl font-['Inter']"
                inputMode="numeric"
              />
              {formData.accountNumber && formData.accountNumber.length !== 10 && (
                <p className="text-yellow-500 text-xs font-['Inter']">{10 - formData.accountNumber.length} digits remaining</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-gray-300 font-['Inter']">Account Type</Label>
              <Select 
                value={formData.accountType} 
                onValueChange={(value) => setFormData({ ...formData, accountType: value })}
              >
                <SelectTrigger className="h-12 bg-white/5 border-[#6B2CF5]/30 text-white rounded-xl font-['Inter']">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1f] border-[#6B2CF5]/30">
                  <SelectItem value="savings" className="text-white hover:bg-[#6B2CF5]/20 font-['Inter']">
                    Savings Account
                  </SelectItem>
                  <SelectItem value="current" className="text-white hover:bg-[#6B2CF5]/20 font-['Inter']">
                    Current Account
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:from-[#5B1CE5] hover:to-[#7B4CE6] text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(107,44,245,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(107,44,245,0.6)] disabled:opacity-50 font-['Inter']"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                "Submit Bank Details"
              )}
            </Button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm font-['Inter']">
          <Shield className="w-4 h-4" />
          <span>Your bank details are encrypted and secure</span>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        .animate-slide-up-delay-1 {
          animation: slide-up 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default BankRegistrationForm;