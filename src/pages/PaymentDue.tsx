import { ArrowLeft, XCircle, RefreshCw, MessageCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlockedAccountOverlay } from "@/components/BlockedAccountOverlay";

const PaymentDue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const reason = location.state?.reason || "Payment verification failed";
  const paymentType = location.state?.paymentType || "bank_registration";

  const getRetryPath = () => {
    switch (paymentType) {
      case 'bank_registration':
        return '/bank-registration-payment';
      case 'verification_6800':
        return '/upgrade-payment-method';
      case 'verification_12800':
        return '/upgrade-payment-method';
      default:
        return '/dashboard';
    }
  };

  const getTitle = () => {
    switch (paymentType) {
      case 'bank_registration':
        return 'Bank Registration Payment Due';
      case 'verification_6800':
      case 'verification_12800':
        return 'Verification Payment Due';
      default:
        return 'Payment Due';
    }
  };

  return (
    <BlockedAccountOverlay>
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Animated Background */}
      <div className="absolute inset-0 premium-bg-animated opacity-50"></div>
      
      {/* Red ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-destructive/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Purple accent glow */}
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none"></div>

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Link to="/dashboard" className="mr-3 p-2 rounded-xl bg-card hover:bg-accent transition-colors interactive-press border border-border">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Payment Status</h1>
        </div>

        {/* Main Card */}
        <div className="animate-fade-up">
          <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-destructive/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-destructive to-red-700 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-background rounded-full flex items-center justify-center border-2 border-destructive">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground text-center mb-3">
              {getTitle()}
            </h2>

            {/* Status Badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-destructive/20 text-destructive px-4 py-2 rounded-full text-sm font-semibold">
                <XCircle className="w-4 h-4" />
                Payment Declined
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-center mb-6">
              We couldn't confirm your payment. Please retry to continue.
            </p>

            {/* Reason Card */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 mb-8">
              <p className="text-red-300 text-sm text-center">
                <span className="font-semibold">Reason:</span> {reason}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => navigate(getRetryPath())}
                className="w-full h-14 interactive-press"
                size="xl"
                variant="luxury"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry Payment
              </Button>

              <Button
                onClick={() => navigate('/support')}
                variant="outline"
                size="xl"
                className="w-full h-14 interactive-press"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                If you believe this is an error, please contact our support team with your payment proof.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-primary hover:text-primary-light font-medium transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
    </BlockedAccountOverlay>
  );
};

export default PaymentDue;