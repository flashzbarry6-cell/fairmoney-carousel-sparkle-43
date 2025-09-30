import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WithdrawalReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const withdrawalData = location.state?.withdrawalData;
  
  // Get current date and time
  const currentDate = new Date();
  const formatDate = currentDate.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  const formatTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Generate transaction reference
  const transactionRef = `FMP${Date.now().toString().slice(-8)}`;

  if (!withdrawalData) {
    return (
      <div className="min-h-screen bg-muted/30 p-3 max-w-md mx-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No withdrawal data found</p>
          <Link to="/dashboard">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
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
        <h1 className="text-lg font-semibold text-foreground">Withdrawal Receipt</h1>
      </div>

      <div className="bg-card rounded-2xl p-6 space-y-6">
        {/* Receipt Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">🧾 Withdrawal Receipt</h2>
        </div>

        {/* Transaction Receipt */}
        <div className="bg-gradient-to-br from-muted/30 to-muted/50 rounded-xl p-5 space-y-3 border-2 border-dashed border-muted-foreground/20">
          <h3 className="text-sm font-semibold text-center text-muted-foreground mb-3">TRANSACTION DETAILS</h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">User:</span>
              <span className="font-semibold text-foreground text-sm">{withdrawalData.accountName}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="font-bold text-lg text-foreground">₦{withdrawalData.amount?.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="font-medium text-foreground text-sm">{formatDate}, {formatTime}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-t border-muted-foreground/20 mt-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <span className="font-semibold text-red-600 flex items-center text-sm">
                🔴 Withdrawal Pending
              </span>
            </div>
          </div>
        </div>

        {/* Reason Box */}
        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg p-4">
          <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>
              <strong>⚠️ Withdrawals are manually verified to prevent fraud and ensure referral authenticity.</strong>
            </span>
          </p>
        </div>

        {/* Bank Details */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-semibold mb-2">BANK DETAILS</p>
          <div className="space-y-1 text-sm">
            <p className="flex justify-between">
              <span className="text-muted-foreground">Bank:</span>
              <span className="font-medium text-foreground">{withdrawalData.bankName}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-medium text-foreground">{withdrawalData.accountNumber}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-medium text-foreground text-xs">{transactionRef}</span>
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button 
            onClick={() => navigate('/transfer-page', { state: { withdrawalData } })}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 rounded-full"
          >
            Fix Issue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalReceipt;