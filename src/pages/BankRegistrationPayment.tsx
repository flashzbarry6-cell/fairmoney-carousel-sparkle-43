import { ArrowLeft, Upload, Copy, Check, Loader2, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BlockedAccountOverlay } from "@/components/BlockedAccountOverlay";
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
    <BlockedAccountOverlay>
    <div className="min-h-screen bg-background relative overflow-hidden page-transition">
      {/* Animated Background */}
      <div className="absolute inset-0 premium-bg-animated opacity-50"></div>
      
      {/* Ambient glow effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-float" />

      <div className="relative z-10 p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Link to="/bank-registration-entry" className="mr-3 p-2 rounded-xl bg-card hover:bg-accent transition-all interactive-press border border-border">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Bank Registration Payment</h1>
        </div>

        {/* Amount Card */}
        <div className="animate-fade-up bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 mb-6 shadow-glow">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-primary-foreground/80" />
            <span className="text-primary-foreground/80">Bank Registration Fee</span>
          </div>
          <div className="text-4xl font-bold text-primary-foreground">₦{paymentDetails.amount.toLocaleString()}</div>
        </div>

        {/* Payment Details Card */}
        <div className="animate-fade-up bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-primary/30 mb-6 shadow-neon" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-foreground font-semibold mb-4">Transfer to this account</h3>
          
          <div className="space-y-4">
            {/* Bank Name */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl interactive-press">
              <div>
                <p className="text-muted-foreground text-xs">Bank Name</p>
                <p className="text-foreground font-medium">{paymentDetails.bankName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentDetails.bankName, 'Bank Name')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {copied === 'Bank Name' ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-primary/20 shadow-neon interactive-press">
              <div>
                <p className="text-muted-foreground text-xs">Account Number</p>
                <p className="text-foreground font-bold text-lg">{paymentDetails.accountNumber}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentDetails.accountNumber, 'Account Number')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {copied === 'Account Number' ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>

            {/* Account Name */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl interactive-press">
              <div>
                <p className="text-muted-foreground text-xs">Account Name</p>
                <p className="text-foreground font-medium">{paymentDetails.accountName}</p>
              </div>
              <button
                onClick={() => copyToClipboard(paymentDetails.accountName, 'Account Name')}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                {copied === 'Account Name' ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-primary" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="animate-fade-up bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-primary/30 mb-6" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-foreground font-semibold mb-4">Upload Payment Receipt</h3>
          
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
              className="w-full h-32 border-2 border-dashed border-primary/40 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all interactive-press"
            >
              <Upload className="w-8 h-8 text-primary" />
              <span className="text-muted-foreground">Click to upload receipt</span>
              <span className="text-muted-foreground/60 text-xs">Image or PDF</span>
            </button>
          ) : (
            <div className="flex items-center justify-between p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-emerald-400 font-medium">Receipt Selected</p>
                  <p className="text-muted-foreground text-sm">{receiptFile.name}</p>
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-primary text-sm hover:underline"
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
          className="w-full h-14 interactive-press"
          size="xl"
          variant="luxury"
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
        <p className="text-center text-muted-foreground text-sm mt-4">
          Payment will be verified within 1 hour
        </p>
      </div>
    </div>
    </BlockedAccountOverlay>
  );
};

export default BankRegistrationPayment;