import { ArrowLeft, Upload, CheckCircle, Clock, Loader2, AlertTriangle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BlockedAccountOverlay from "@/components/BlockedAccountOverlay";

const PaymentPending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(location.state?.paymentId || null);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [timeRemaining, setTimeRemaining] = useState<number>(3600);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  
  const amount = location.state?.amount || 6800;
  const paymentType = location.state?.paymentType || "verification";

  // Handle real-time status updates
  const handleStatusChange = useCallback((newStatus: string, rejectionReason?: string) => {
    setPaymentStatus(newStatus);
    
    if (newStatus === 'approved') {
      if (paymentType === 'bank_registration') {
        navigate('/bank-registration-form');
      } else {
        navigate('/payment-approved', { state: { amount, paymentType } });
      }
    } else if (newStatus === 'rejected') {
      if (paymentType === 'bank_registration') {
        navigate('/payment-due', { 
          state: { 
            reason: rejectionReason,
            paymentType: 'bank_registration'
          } 
        });
      } else {
        navigate('/payment-due', { 
          state: { 
            amount, 
            reason: rejectionReason,
            paymentType
          } 
        });
      }
    }
  }, [navigate, amount, paymentType]);

  // Countdown timer effect (display only - no auto-expiry)
  useEffect(() => {
    if (!expiresAt || paymentStatus !== 'pending') return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = expiresAt.getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeRemaining(remaining);
      // Timer is display-only - payments remain pending until admin action
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, paymentStatus]);

  // Fetch existing payment or use the one from navigation state
  useEffect(() => {
    const fetchOrCreatePayment = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // If we already have a payment ID from navigation, just fetch its details
      if (paymentId) {
        const { data: existingPayment } = await supabase
          .from('payments')
          .select('*')
          .eq('id', paymentId)
          .single();

        if (existingPayment) {
          if (existingPayment.payment_proof_url) {
            setReceiptUploaded(true);
          }
          if (existingPayment.expires_at) {
            setExpiresAt(new Date(existingPayment.expires_at));
          }
          setPaymentStatus(existingPayment.status);
          
          // Handle if status already changed
          if (existingPayment.status !== 'pending') {
            handleStatusChange(existingPayment.status, existingPayment.rejection_reason);
          }
        }
        return;
      }

      // Check for existing pending payment
      const { data: pendingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .eq('payment_type', paymentType)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (pendingPayment) {
        setPaymentId(pendingPayment.id);
        if (pendingPayment.payment_proof_url) {
          setReceiptUploaded(true);
        }
        if (pendingPayment.expires_at) {
          setExpiresAt(new Date(pendingPayment.expires_at));
        }
      }
    };

    fetchOrCreatePayment();
  }, [paymentId, paymentType, navigate, handleStatusChange]);

  // Real-time subscription
  useEffect(() => {
    if (!paymentId) return;

    const channel = supabase
      .channel(`payment-status-${paymentId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `id=eq.${paymentId}`
        },
        (payload) => {
          const newStatus = payload.new.status;
          handleStatusChange(newStatus, payload.new.rejection_reason);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [paymentId, handleStatusChange]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !paymentId) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${paymentId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-receipts')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-receipts')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('payments')
        .update({ payment_proof_url: publicUrl })
        .eq('id', paymentId);

      if (updateError) throw updateError;

      setReceiptUploaded(true);
      toast({
        title: "Success",
        description: "Receipt uploaded successfully!",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload receipt",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpiringSoon = timeRemaining <= 300;

  return (
    <BlockedAccountOverlay>
      <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto page-transition">
        <div className="absolute inset-0 animated-bg"></div>

        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center mb-8 pt-2">
            <Link to="/dashboard" className="mr-3 btn-press">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Payment Status</h1>
          </div>

          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-6 border border-purple-500/30 space-y-6 animate-slide-up">
            {/* Status Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-luxury-gold to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-luxury-gold/30">
                  <Clock className="w-12 h-12 text-black" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-luxury-purple rounded-full flex items-center justify-center border-2 border-black">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className={`text-center p-4 rounded-xl ${isExpiringSoon ? 'bg-red-900/30 border border-red-500/30' : 'bg-purple-900/30 border border-purple-500/20'}`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {isExpiringSoon && <AlertTriangle className="w-5 h-5 text-red-400" />}
                <span className={`text-sm ${isExpiringSoon ? 'text-red-300' : 'text-purple-300'}`}>
                  {isExpiringSoon ? 'Expiring Soon!' : 'Time Remaining'}
                </span>
              </div>
              <span className={`text-3xl font-bold font-mono ${isExpiringSoon ? 'text-red-400' : 'text-luxury-gold'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-luxury-gold px-4 py-2 rounded-full text-sm font-semibold">
                <Clock className="w-4 h-4" />
                ⏳ Pending Confirmation
              </div>
              <h2 className="text-2xl font-bold text-white">Payment Under Review</h2>
              <p className="text-gray-400">
                Please hold while the admin confirms your payment.
              </p>
            </div>

            {/* Amount Display */}
            <div className="bg-purple-900/30 rounded-2xl p-4 border border-purple-500/20">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="text-2xl font-bold text-luxury-gold">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-400">Payment Type:</span>
                <span className="text-white capitalize">{paymentType.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Receipt Upload Section */}
            <div className="space-y-3">
              {receiptUploaded ? (
                <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-semibold">Receipt Uploaded Successfully</p>
                    <p className="text-gray-400 text-sm">Awaiting admin confirmation</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-300 text-sm text-center">
                    Upload your payment receipt for faster verification
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-4 rounded-xl border border-purple-500/30 btn-press"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Receipt
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>

            {/* Loading Indicator */}
            <div className="flex justify-center gap-1 py-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Info Notice */}
            <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-300 text-sm text-center">
                💡 Your wallet will be credited automatically once the admin approves your payment. This page updates in real-time.
              </p>
            </div>
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
};

export default PaymentPending;
