import { ArrowLeft, Building2, Check, Loader2, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlockedAccountOverlay } from "@/components/BlockedAccountOverlay";
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
      <BlockedAccountOverlay>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 page-transition">
        {/* Success glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 text-center animate-fade-up">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(34,197,94,0.5)] glow-pulse">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Bank Account Registered!</h1>
          <p className="text-muted-foreground mb-6">Your bank account has been successfully added.</p>
          <p className="text-muted-foreground/60 text-sm">Redirecting to dashboard...</p>
        </div>
      </div>
      </BlockedAccountOverlay>
    );
  }

  return (
    <BlockedAccountOverlay>
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Animated Background */}
      <div className="absolute inset-0 premium-bg-animated opacity-50"></div>
      
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-float" />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Link to="/dashboard" className="mr-3 p-2 rounded-xl bg-card hover:bg-accent transition-all interactive-press border border-border">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Register Your Bank Account</h1>
        </div>

        {/* Success Banner */}
        <div className="animate-fade-up bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-emerald-400 font-semibold">Payment Approved!</p>
            <p className="text-muted-foreground text-sm">Now register your bank details</p>
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-primary/30 shadow-neon space-y-5">
            {/* Icon Header */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-glow glow-pulse">
                <Building2 className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Account Holder Name</Label>
              <Input
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Enter account holder name"
                className="h-12 bg-muted/50 border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl"
              />
            </div>

            {/* Bank Name */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Bank Name</Label>
              <Select 
                value={formData.bankName} 
                onValueChange={(value) => setFormData({ ...formData, bankName: value })}
              >
                <SelectTrigger className="h-12 bg-muted/50 border-primary/30 text-foreground rounded-xl">
                  <SelectValue placeholder="Select your bank" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30 max-h-60">
                  {nigerianBanks.map((bank) => (
                    <SelectItem 
                      key={bank} 
                      value={bank}
                      className="text-foreground hover:bg-primary/20"
                    >
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Account Number</Label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, accountNumber: value });
                }}
                placeholder="Enter 10-digit account number"
                className="h-12 bg-muted/50 border-primary/30 text-foreground placeholder:text-muted-foreground focus:border-primary rounded-xl"
                inputMode="numeric"
              />
              {formData.accountNumber && formData.accountNumber.length !== 10 && (
                <p className="text-gold text-xs">{10 - formData.accountNumber.length} digits remaining</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-muted-foreground">Account Type</Label>
              <Select 
                value={formData.accountType} 
                onValueChange={(value) => setFormData({ ...formData, accountType: value })}
              >
                <SelectTrigger className="h-12 bg-muted/50 border-primary/30 text-foreground rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/30">
                  <SelectItem value="savings" className="text-foreground hover:bg-primary/20">
                    Savings Account
                  </SelectItem>
                  <SelectItem value="current" className="text-foreground hover:bg-primary/20">
                    Current Account
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 interactive-press"
              size="xl"
              variant="luxury"
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
        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Shield className="w-4 h-4" />
          <span>Your bank details are encrypted and secure</span>
        </div>
      </div>
    </div>
    </BlockedAccountOverlay>
  );
};

export default BankRegistrationForm;