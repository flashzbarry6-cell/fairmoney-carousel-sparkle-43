import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoanApplication = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
    bank: "",
    loanAmount: "",
    fairCode: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleProceed = async () => {
    const loanAmount = parseInt(formData.loanAmount);
    
    // Validate loan amount
    if (!loanAmount || isNaN(loanAmount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid loan amount",
        variant: "destructive"
      });
      return;
    }

    if (loanAmount > 200000) {
      toast({
        title: "Invalid Loan Amount",
        description: "Maximum loan amount is ₦200,000",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }

      // Get current balance
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentBalance = profile?.balance || 0;
      const newBalance = currentBalance + loanAmount;

      // Update balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('user_id', session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Loan Approved!",
        description: `₦${loanAmount.toLocaleString()} has been added to your balance`,
      });

      // Navigate back to dashboard
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      console.error("Loan processing error:", error);
      toast({
        title: "Error",
        description: "Failed to process loan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-3 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Apply for Loan</h1>
      </div>

      <div className="bg-card rounded-2xl p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Number</label>
          <Input
            type="text"
            name="accountNumber"
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={handleInputChange}
            className="w-full border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Account Name</label>
          <Input
            type="text"
            name="accountName"
            placeholder="Enter account name"
            value={formData.accountName}
            onChange={handleInputChange}
            className="w-full border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Select Bank</label>
          <Input
            type="text"
            name="bank"
            placeholder="Select your bank"
            value={formData.bank}
            onChange={handleInputChange}
            className="w-full border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Enter Loan Amount</label>
          <Input
            type="text"
            name="loanAmount"
            placeholder="Enter loan amount"
            value={formData.loanAmount}
            onChange={handleInputChange}
            className="w-full border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Fair Code</label>
          <Input
            type="text"
            name="fairCode"
            placeholder="Enter your faircode"
            value={formData.fairCode}
            onChange={handleInputChange}
            className="w-full border border-input rounded-md focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-full mt-6"
          onClick={handleProceed}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Proceed"}
        </Button>
      </div>
    </div>
  );
};

export default LoanApplication;