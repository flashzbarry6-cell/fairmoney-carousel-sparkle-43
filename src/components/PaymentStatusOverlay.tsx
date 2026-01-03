import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentStatusOverlayProps {
  onClose: () => void;
}

interface PaymentRecord {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  rejection_reason?: string | null;
  created_at: string;
}

export const PaymentStatusOverlay = ({ onClose }: PaymentStatusOverlayProps) => {
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Check if user has dismissed this overlay in this session
        const dismissedKey = `payment_overlay_dismissed_${user.id}`;
        const lastDismissed = sessionStorage.getItem(dismissedKey);
        
        // Fetch the most recent payment
        const { data: paymentData, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error || !paymentData) {
          setLoading(false);
          return;
        }

        // Only show overlay for approved/rejected if not dismissed this session
        if (paymentData.status === 'approved' || paymentData.status === 'rejected') {
          if (lastDismissed === paymentData.id) {
            setLoading(false);
            return;
          }
          setPayment(paymentData);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, []);

  const handleDismiss = async () => {
    if (payment) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        sessionStorage.setItem(`payment_overlay_dismissed_${user.id}`, payment.id);
      }
    }
    setDismissed(true);
    onClose();
  };

  const handleApprovedAction = () => {
    handleDismiss();
    navigate('/bank-registration');
  };

  const handleRejectedAction = () => {
    handleDismiss();
    navigate('/transfer');
  };

  if (loading || dismissed || !payment) {
    return null;
  }

  const isApproved = payment.status === 'approved';
  const isRejected = payment.status === 'rejected';

  if (!isApproved && !isRejected) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-sm bg-black/90 border ${isApproved ? 'border-green-500/40' : 'border-red-500/40'} rounded-3xl p-6 shadow-2xl ${isApproved ? 'shadow-green-500/20' : 'shadow-red-500/20'}`}>
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isApproved ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
            {isApproved ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <XCircle className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-4">
          <h2 className={`text-2xl font-bold ${isApproved ? 'text-green-400' : 'text-red-400'}`}>
            {isApproved ? '✅ Payment Approved' : '❌ Payment Rejected'}
          </h2>
          <p className="text-gray-300 mt-2">
            ₦{payment.amount.toLocaleString()}
          </p>
        </div>

        {/* Message */}
        <div className={`rounded-xl p-4 mb-6 ${isApproved ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
          <p className={`text-sm text-center ${isApproved ? 'text-green-300' : 'text-red-300'}`}>
            {isApproved 
              ? 'You may continue with withdrawal.' 
              : payment.rejection_reason || 'Please retry payment with a valid receipt.'}
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={isApproved ? handleApprovedAction : handleRejectedAction}
          className={`w-full py-4 rounded-xl font-semibold ${
            isApproved 
              ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800' 
              : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
          }`}
        >
          {isApproved ? (
            <>
              <ArrowRight className="w-5 h-5 mr-2" />
              Continue to Withdrawal
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Retry Payment
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStatusOverlay;