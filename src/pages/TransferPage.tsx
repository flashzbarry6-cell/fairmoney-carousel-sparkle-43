import { ArrowLeft, Copy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const TransferPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const transferDetails = {
    amount: "8500",
    accountNumber: "8102562883",
    bankName: "Opay",
    accountName: "Veronica Chisom Benjamin"
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copied to clipboard!`,
    });
  };

  const handleTransferMade = () => {
    navigate("/confirming-payment");
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/payment-notification" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
      </div>

      {/* Amount Display */}
      <div className="text-center mb-6">
        <div className="flex justify-center items-center mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">NGN {transferDetails.amount}</h1>
        <p className="text-lg text-foreground">Complete this bank transfer to proceed</p>
      </div>

      {/* Transfer Details Card */}
      <div className="bg-card rounded-2xl p-6 space-y-6">
        {/* Selected Bank */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Selected Bank:</p>
            <p className="text-lg font-semibold text-primary">{transferDetails.bankName}</p>
          </div>
          <Button variant="ghost" className="text-primary">Change Bank</Button>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Amount</p>
            <p className="text-xl font-bold text-foreground">NGN {transferDetails.amount}</p>
          </div>
          <Button 
            onClick={() => handleCopy(transferDetails.amount, "Amount")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            Copy
          </Button>
        </div>

        {/* Account Number */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <span className="font-bold text-foreground">12</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Number</p>
              <p className="text-lg font-bold text-foreground">{transferDetails.accountNumber}</p>
            </div>
          </div>
          <Button 
            onClick={() => handleCopy(transferDetails.accountNumber, "Account number")}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            Copy
          </Button>
        </div>

        {/* Bank Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">🏢</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bank Name</p>
            <p className="text-lg font-bold text-foreground">{transferDetails.bankName}</p>
          </div>
        </div>

        {/* Account Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account Name</p>
            <p className="text-lg font-bold text-foreground">{transferDetails.accountName}</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 mt-6">
          <p className="text-sm text-muted-foreground">
            Transfer the exact amount to the account above with your Reference ID - 500320 for instant verification.
          </p>
        </div>
      </div>

      {/* Transfer Button */}
      <Button 
        onClick={handleTransferMade}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 rounded-full mt-6"
      >
        I have made transfer
      </Button>
    </div>
  );
};

export default TransferPage;