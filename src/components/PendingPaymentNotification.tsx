import { Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface PendingPaymentNotificationProps {
  onClose: () => void;
}

export const PendingPaymentNotification = ({ onClose }: PendingPaymentNotificationProps) => {
  const navigate = useNavigate();

  const handleGoToPending = () => {
    onClose();
    navigate('/payment-pending');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-black/90 border border-purple-500/40 rounded-3xl p-6 shadow-2xl shadow-purple-500/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700 animate-pulse">
            <Clock className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-purple-400">
            Payment Already Pending
          </h2>
          <p className="text-gray-300 mt-2">
            Please wait for admin approval.
          </p>
        </div>

        {/* Message */}
        <div className="rounded-xl p-4 mb-6 bg-purple-900/30 border border-purple-500/30">
          <p className="text-sm text-center text-purple-300">
            You can only have one pending payment at a time. Your current payment is being reviewed.
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleGoToPending}
          className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
        >
          <Clock className="w-5 h-5 mr-2" />
          View Pending Payment
        </Button>
      </div>
    </div>
  );
};

export default PendingPaymentNotification;