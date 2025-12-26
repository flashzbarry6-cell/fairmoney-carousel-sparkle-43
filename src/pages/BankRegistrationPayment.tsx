import { ArrowLeft, Upload, Copy, Check, Loader2, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BankRegistrationPayment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const paymentDetails = {
    bankName: "Money Point",
    accountNumber: "8102562863",
    accountName: "Charismatic",
    amount: 3600
  };

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!receiptFile) {
      toast({
        title: "Receipt Required",
        description: "Please upload your payment receipt",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Check for existing pending bank registration payment
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('payment_type', 'bank_registration')
        .eq('status', 'pending')
        .single();

      if (existingPayment) {
        toast({
          title: "Payment Pending",
          description: "You already have a pending bank registration payment",
        });
        navigate('/payment-pending', { 
          state: { 
            amount: paymentDetails.amount, 
            paymentType: 'bank_registration' 
          } 
        });
        return;
      }

      // Upload receipt
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/bank-reg-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, receiptFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName);

      // Create payment record
      const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: paymentDetails.amount,
          payment_type: 'bank_registration',
          status: 'pending',
          payment_proof_url: publicUrl,
          expires_at: expiryTime.toISOString()
        });

      if (insertError) throw insertError;

      toast({
        title: "Payment Submitted",
        description: "Your payment is being reviewed",
      });

      navigate('/payment-pending', { 
        state: { 
          amount: paymentDetails.amount, 
          paymentType: 'bank_registration' 
        } 
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit payment",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#6B2CF5]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Link to="/bank-registration" className="mr-3 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-semibold text-white font-['Inter']">Bank Registration Payment</h1>
        </div>

        {/* Amount Card */}
        <div className="animate-slide-up bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] rounded-2xl p-6 mb-6 shadow-[0_0_40px_rgba(107,44,245,0.4)]">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-white/80" />
            <span className="text-white/80 font-['Inter']">Bank Registration Fee</span>
          </div>
          <div className="text-4xl font-bold text-white font-['Inter']">₦{paymentDetails.amount.toLocaleString()}</div>
        </div>

        {/* Payment Details Card */}
        <div className="animate-slide-up-delay-1 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-[#6B2CF5]/30 mb-6 shadow-[0_0_30px_rgba(107,44,245,0.1)]">
          <h3 className="text-white font-semibold mb-4 font-['Inter']">Transfer to this account</h3>
          
          <div className="space-y-4">
            {/* Bank Name */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-500 text-xs font-['Inter']">Bank Name</p>
                <p className="text-white font-medium font-['Inter']">{paymentDetails.bankName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentDetails.bankName, 'Bank Name')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'Bank Name' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-[#6B2CF5]" />
                )}
              </button>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-[#6B2CF5]/20 shadow-[0_0_15px_rgba(107,44,245,0.2)]">
              <div>
                <p className="text-gray-500 text-xs font-['Inter']">Account Number</p>
                <p className="text-white font-bold text-lg font-['Inter']">{paymentDetails.accountNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentDetails.accountNumber, 'Account Number')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'Account Number' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-[#6B2CF5]" />
                )}
              </button>
            </div>

            {/* Account Name */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div>
                <p className="text-gray-500 text-xs font-['Inter']">Account Name</p>
                <p className="text-white font-medium font-['Inter']">{paymentDetails.accountName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentDetails.accountName, 'Account Name')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {copied === 'Account Name' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-[#6B2CF5]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="animate-slide-up-delay-2 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-[#6B2CF5]/30 mb-6">
          <h3 className="text-white font-semibold mb-4 font-['Inter']">Upload Payment Receipt</h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!receiptFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-[#6B2CF5]/40 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#6B2CF5] hover:bg-[#6B2CF5]/5 transition-all"
            >
              <Upload className="w-8 h-8 text-[#6B2CF5]" />
              <span className="text-gray-400 font-['Inter']">Click to upload receipt</span>
              <span className="text-gray-600 text-xs font-['Inter']">Image or PDF</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-green-400 font-medium font-['Inter']">Receipt Selected</p>
                  <p className="text-gray-400 text-sm font-['Inter']">{receiptFile.name}</p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#6B2CF5] text-sm font-['Inter'] hover:underline"
              >
                Change
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={uploading || !receiptFile}
          className="w-full h-14 bg-gradient-to-r from-[#6B2CF5] to-[#8B5CF6] hover:from-[#5B1CE5] hover:to-[#7B4CE6] text-white font-semibold rounded-2xl shadow-[0_0_30px_rgba(107,44,245,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(107,44,245,0.6)] disabled:opacity-50 disabled:cursor-not-allowed font-['Inter']"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "I Have Made Payment"
          )}
        </Button>

        {/* Note */}
        <p className="text-center text-gray-500 text-sm mt-4 font-['Inter']">
          Payment will be verified within 1 hour
        </p>
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
        .animate-slide-up-delay-2 {
          animation: slide-up 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default BankRegistrationPayment;