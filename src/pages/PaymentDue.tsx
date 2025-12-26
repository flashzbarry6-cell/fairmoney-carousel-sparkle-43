import { ArrowLeft, XCircle, RefreshCw, MessageCircle, AlertTriangle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PaymentDue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const reason = location.state?.reason || "Payment verification failed";
  const paymentType = location.state?.paymentType || "bank_registration";

  const getRetryPath = () => {
    switch (paymentType) {
      case 'bank_registration':
        return '/bank-registration-payment';
      case 'verification':
        return '/upgrade-payment-method';
      default:
        return '/dashboard';
    }
  };

  const getTitle = () => {
    switch (paymentType) {
      case 'bank_registration':
        return 'Bank Registration Payment Due';
      default:
        return 'Payment Due';
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">
      {/* Red ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Link to="/dashboard" className="mr-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white font-['Inter']">Payment Status</h1>
        </div>

        {/* Main Card */}
        <div className="animate-fade-in">
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)]">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                  <XCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#0B0B0F] rounded-full flex items-center justify-center border-2 border-red-500">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-3 font-['Inter']">
              {getTitle()}
            </h2>

            {/* Status Badge */}
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold font-['Inter']">
                <XCircle className="w-4 h-4" />
                Payment Declined
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-center mb-6 font-['Inter']">
              We couldn't confirm your payment. Please retry to continue.
            </p>

            {/* Reason Card */}
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-4 mb-8">
              <p className="text-red-300 text-sm text-center font-['Inter']">
                <span className="font-semibold">Reason:</span> {reason}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => navigate(getRetryPath())}
                className="w-full h-14 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:from-[#5B1CE5] hover:to-[#7B4CE6] text-white font-semibold rounded-2xl shadow-[0_0_30px_rgba(107,44,245,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(107,44,245,0.6)] font-['Inter']"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Retry Payment
              </Button>

              <Button
                onClick={() => navigate('/support')}
                variant="outline"
                className="w-full h-14 bg-transparent border-2 border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-semibold rounded-2xl transition-all font-['Inter']"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm font-['Inter']">
                If you believe this is an error, please contact our support team with your payment proof.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Link */}
        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-[#6B2CF5] hover:text-[#8B5CF6] font-medium font-['Inter'] transition-colors">
            Return to Dashboard
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentDue;