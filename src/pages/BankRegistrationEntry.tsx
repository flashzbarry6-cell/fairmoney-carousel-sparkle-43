import { ArrowLeft, Building2, Shield, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BankRegistrationEntry = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6B2CF5]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#6B2CF5]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8 pt-4">
          <Link to="/dashboard" className="mr-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white font-['Inter']">Bank Registration</h1>
        </div>

        {/* Main Card */}
        <div className="animate-fade-in">
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl p-8 border border-[#6B2CF5]/30 shadow-[0_0_50px_rgba(107,44,245,0.15)]">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#6B2CF5] to-[#9B5CFF] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(107,44,245,0.5)]">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#0B0B0F] rounded-full flex items-center justify-center border-2 border-[#6B2CF5]">
                  <CreditCard className="w-4 h-4 text-[#6B2CF5]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-3 font-['Inter']">
              Bank Account Registration
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-center mb-8 leading-relaxed font-['Inter']">
              To register your bank account for withdrawals, a one-time registration fee is required.
            </p>

            {/* Fee Display */}
            <div className="bg-[#6B2CF5]/10 rounded-2xl p-6 border border-[#6B2CF5]/20 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-['Inter']">Registration Fee</span>
                <span className="text-3xl font-bold text-white font-['Inter']">₦3,600</span>
              </div>
              <p className="text-[#9B5CFF] text-sm mt-2 font-['Inter']">One-time payment</p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6B2CF5]/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#6B2CF5]" />
                </div>
                <div>
                  <p className="text-white font-medium font-['Inter']">Secure & Verified</p>
                  <p className="text-gray-500 text-sm font-['Inter']">Bank details verified by admin</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#6B2CF5]/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#6B2CF5]" />
                </div>
                <div>
                  <p className="text-white font-medium font-['Inter']">Instant Withdrawals</p>
                  <p className="text-gray-500 text-sm font-['Inter']">Withdraw earnings anytime</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              onClick={() => navigate('/bank-registration-payment')}
              className="w-full h-14 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:from-[#5B1CE5] hover:to-[#7B4CE6] text-white font-semibold rounded-2xl shadow-[0_0_30px_rgba(107,44,245,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(107,44,245,0.6)] font-['Inter']"
            >
              Proceed to Bank Registration Payment
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm font-['Inter']">
          <Shield className="w-4 h-4" />
          <span>Your data is protected with bank-grade encryption</span>
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

export default BankRegistrationEntry;