import { ArrowLeft, Copy, X, Upload, Loader2, FileCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BlockedAccountOverlay from "@/components/BlockedAccountOverlay";
import { PendingPaymentNotification } from "@/components/PendingPaymentNotification";

const TransferPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showPendingNotification, setShowPendingNotification] = useState(false);
  
  const instantWithdraw = location.state?.instantWithdraw || false;
  const transferAmount = instantWithdraw ? 12800 : 6800;
  const paymentType = instantWithdraw ? "instant_withdrawal" : "verification";

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File",
          description: "Please upload an image or PDF file",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setReceiptFile(file);
      toast({
        title: "Receipt Selected",
        description: file.name,
      });
    }
  };

  const handleTransfer = async () => {
    // STRICT VALIDATION: Receipt is MANDATORY
    if (!receiptFile) {
      toast({
        title: "Receipt Required",
        description: "Please upload payment receipt to continue",
        variant: "destructive",
      });
      return;
    }

    setIsConfirming(true);
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

      // CHECK FOR EXISTING PENDING PAYMENT
      const { data: existingPending, error: pendingError } = await supabase
        .from('payments')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .limit(1);

      if (pendingError) throw pendingError;

      if (existingPending && existingPending.length > 0) {
        setIsConfirming(false);
        setUploading(false);
        // Show pending notification
        setShowPendingNotification(true);
        return;
      }

      // Create expiry time (1 hour from now)
      const expiryTime = new Date(Date.now() + 60 * 60 * 1000);

      // Create payment record first
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: transferAmount,
          payment_type: paymentType,
          status: 'pending',
          expires_at: expiryTime.toISOString()
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Upload receipt to storage
      const fileExt = receiptFile.name.split('.').pop();
      const fileName = `${user.id}/${payment.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, receiptFile, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName);

      // Update payment with receipt URL
      const { error: updateError } = await supabase
        .from('payments')
        .update({ payment_proof_url: publicUrl })
        .eq('id', payment.id);

      if (updateError) throw updateError;

      // Navigate to pending page with payment ID
      navigate("/payment-pending", { 
        state: { 
          amount: transferAmount, 
          paymentType: paymentType,
          paymentId: payment.id
        } 
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
      setIsConfirming(false);
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Copied to clipboard",
    });
  };

  if (isConfirming) {
    return (
      <BlockedAccountOverlay>
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-3 max-w-md mx-auto">
          <div className="absolute inset-0 animated-bg"></div>
          <div className="relative z-10 bg-black/40 backdrop-blur-lg rounded-2xl p-8 text-center space-y-6 w-full border border-purple-700/40">
            <div className="flex justify-center">
              <div className="w-24 h-24 relative">
                <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-luxury-gold">
                {uploading ? "Uploading Receipt..." : "Confirming Payment"}
              </h2>
              <p className="text-gray-300">
                {uploading ? "Please wait while we upload your receipt..." : "Please wait while we verify your transfer..."}
              </p>
            </div>

            <div className="flex justify-center space-x-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animated-bg {
              background: linear-gradient(-45deg, #0a0015, #1a0030, #3b0066, #000000);
              background-size: 400% 400%;
              animation: gradientMove 12s ease infinite;
            }
          `}</style>
        </div>
      </BlockedAccountOverlay>
    );
  }

  return (
    <BlockedAccountOverlay>
      {/* Pending Payment Notification */}
      {showPendingNotification && (
        <PendingPaymentNotification onClose={() => setShowPendingNotification(false)} />
      )}
      <div className="min-h-screen relative overflow-hidden p-3 max-w-md mx-auto page-transition">
        <div className="absolute inset-0 animated-bg"></div>

        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center mb-6 pt-2">
            <Link to="/dashboard" className="mr-3 btn-press">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-lg font-semibold text-white">
              Complete Payment
            </h1>
          </div>

          <div className="space-y-4">
            {/* Amount Card */}
            <div className="bg-luxury-black/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-luxury-glow/40 shadow-lg luxury-glow animate-slide-up card-hover">
              <p className="text-sm text-gray-400 mb-2">Transfer Amount</p>
              <div className="flex justify-center items-center space-x-2 mb-1">
                <p className="text-4xl font-bold text-luxury-gold">₦{transferAmount.toLocaleString()}</p>
                <Copy
                  className="w-5 h-5 text-luxury-gold cursor-pointer hover:text-luxury-gold/80 btn-press"
                  onClick={() => copyToClipboard(transferAmount.toString())}
                />
              </div>
              <p className="text-xs text-gray-400">{instantWithdraw ? "Instant Withdrawal Activation" : "Verification Fee"}</p>
            </div>

            {/* Bank Details Card */}
            <div className="bg-luxury-black/40 backdrop-blur-lg rounded-2xl p-6 space-y-4 border border-luxury-glow/40 animate-slide-up luxury-glow" style={{ animationDelay: '100ms' }}>
              <div className="text-center mb-4">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Transfer to:
                </h2>
                <p className="text-sm text-gray-300">
                  Complete this transfer to proceed
                </p>
              </div>

              <div className="flex flex-col bg-black/30 rounded-xl p-4 border border-purple-700/40 space-y-3">
                <div className="flex justify-between items-center border-b border-purple-700/40 pb-2">
                  <span className="text-sm text-gray-400">Bank:</span>
                  <span className="font-semibold text-white">MONEIPOINT</span>
                </div>

                <div className="flex justify-between items-center border-b border-purple-700/40 pb-2">
                  <span className="text-sm text-gray-400">Account Number:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">8102562883</span>
                    <Copy
                      className="w-4 h-4 text-luxury-gold cursor-pointer hover:text-luxury-gold/80 btn-press"
                      onClick={() => copyToClipboard("8102562883")}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Account Name:</span>
                  <span className="font-semibold text-white text-right">
                    Charis Somtochukwu Chisom
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50/10 border border-yellow-400 rounded-lg p-4 mt-4 backdrop-blur-md">
                <p className="text-sm text-yellow-300 font-medium">
                  ⚠️ Important: Transfer exactly ₦{transferAmount.toLocaleString()} to the account above to
                  {instantWithdraw ? " activate instant withdrawal." : " verify your withdrawal request."}
                </p>
              </div>
            </div>

            {/* Receipt Upload Section - MANDATORY */}
            <div className="bg-luxury-black/40 backdrop-blur-lg rounded-2xl p-6 border border-luxury-glow/40 animate-slide-up" style={{ animationDelay: '150ms' }}>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Upload Payment Receipt
                </h3>
                <p className="text-sm text-red-400 font-medium">
                  ⚠️ Required - You must upload receipt to continue
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {!receiptFile ? (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-2 border-dashed border-purple-500/50 bg-purple-900/20 hover:bg-purple-900/40 text-white py-8 rounded-xl btn-press"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-purple-400" />
                    <span className="text-purple-300">Click to upload receipt (Image or PDF)</span>
                    <span className="text-xs text-gray-500">Max 5MB</span>
                  </div>
                </Button>
              ) : (
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-8 h-8 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-green-400 font-semibold">Receipt Selected</p>
                      <p className="text-gray-400 text-sm truncate max-w-[180px]">{receiptFile.name}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    variant="outline"
                    className="border-green-500/30 text-green-300 btn-press"
                  >
                    Change
                  </Button>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={handleTransfer}
              disabled={!receiptFile || uploading}
              className={`w-full font-semibold py-4 rounded-full text-lg btn-press animate-slide-up ${
                receiptFile 
                  ? 'bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              style={{ animationDelay: '200ms' }}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "I Have Made Transfer"
              )}
            </Button>

            {!receiptFile && (
              <p className="text-center text-red-400 text-sm animate-pulse">
                ↑ Please upload your payment receipt first
              </p>
            )}
          </div>
        </div>

        {/* Popup Side Notification */}
        {showPopup && (
          <div className="fixed top-20 right-4 z-50 w-80 bg-gradient-to-br from-purple-900 via-black to-purple-800 text-white rounded-2xl shadow-xl overflow-hidden animate-slideIn">
            <div className="flex justify-center items-center p-3 border-b border-purple-700/50 relative">
              <span className="font-bold text-lg text-center">PAY NGN {transferAmount.toLocaleString()}</span>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute right-3 top-3 btn-press"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-sm leading-relaxed">
              {[
                "DO NOT USE OPAY TO MAKE TRANSFER",
                "DO NOT DISPUTE ANY TRANSFER MADE TO OUR SERVICES",
                `THIS IS A ONE TIME PAYMENT OF ₦${transferAmount.toLocaleString()} FOR VERIFICATION`,
                "AFTER PAYMENT YOUR ACCOUNT WILL BE VERIFIED",
                "UPLOAD YOUR RECEIPT AFTER TRANSFER"
              ].map((text, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-luxury-gold rounded-full flex items-center justify-center text-luxury-black font-bold text-xs">
                    {index + 1}
                  </span>
                  <p className="uppercase text-white text-sm">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center p-3 border-t border-purple-700/50">
              <Button
                onClick={() => setShowPopup(false)}
                className="bg-green-500 hover:bg-green-600 text-black font-semibold w-full btn-press"
              >
                I Understand
              </Button>
            </div>

            <style>{`
              @keyframes slideIn {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
              }
              .animate-slideIn {
                animation: slideIn 0.6s ease-out forwards;
              }
            `}</style>
          </div>
        )}

        <style>{`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-bg {
            background: linear-gradient(-45deg, #0a0015, #1a0030, #3b0066, #000000);
            background-size: 400% 400%;
            animation: gradientMove 12s ease infinite;
          }
        `}</style>
      </div>
    </BlockedAccountOverlay>
  );
};

export default TransferPage;
