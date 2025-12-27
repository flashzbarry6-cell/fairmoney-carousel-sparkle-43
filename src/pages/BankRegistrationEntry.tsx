import { ArrowLeft, Building2, Shield, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BankRegistrationEntry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Animated Background */}
      <div className="absolute inset-0 premium-bg-animated opacity-50"></div>
      
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-float" style={{ animationDelay: '3s' }} />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Link to="/dashboard" className="mr-3 p-2 rounded-xl bg-card hover:bg-accent transition-all interactive-press border border-border">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Bank Registration</h1>
        </div>

        {/* Main Card */}
        <div className="animate-fade-up">
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-primary/30 shadow-neon">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-2xl flex items-center justify-center shadow-glow glow-pulse">
                  <Building2 className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full flex items-center justify-center border-2 border-primary">
                  <CreditCard className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground text-center mb-3">
              Bank Account Registration
            </h2>

            {/* Description */}
            <p className="text-muted-foreground text-center mb-8 leading-relaxed">
              To register your bank account for withdrawals, a one-time registration fee is required.
            </p>

            {/* Fee Display */}
            <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="text-3xl font-bold text-foreground">₦3,600</span>
              </div>
              <p className="text-primary text-sm mt-2">One-time payment</p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 interactive-press p-2 rounded-xl hover:bg-accent/50 transition-colors">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Secure & Verified</p>
                  <p className="text-muted-foreground text-sm">Bank details verified by admin</p>
                </div>
              </div>
              <div className="flex items-center gap-3 interactive-press p-2 rounded-xl hover:bg-accent/50 transition-colors">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">Instant Withdrawals</p>
                  <p className="text-muted-foreground text-sm">Withdraw earnings anytime</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/bank-registration-payment')}
              className="w-full h-14 interactive-press"
              size="xl"
              variant="luxury"
            >
              Proceed to Bank Registration Payment
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Shield className="w-4 h-4" />
          <span>Your data is protected with bank-grade encryption</span>
        </div>
      </div>
    </div>
  );
};

export default BankRegistrationEntry;