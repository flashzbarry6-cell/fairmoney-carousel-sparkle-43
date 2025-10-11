import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoanApplication = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cooldownActive, setCooldownActive] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    dob: "",
    email: "",
    address: "",
    loanAmount: ""
  });

  useEffect(() => {
    const checkCooldown = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("last_loan_time")
        .eq("user_id", session.user.id)
        .single();

      if (profile?.last_loan_time) {
        const lastLoan = new Date(profile.last_loan_time);
        const now = new Date();
        const diffDays = (now.getTime() - lastLoan.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 7) setCooldownActive(true);
      }
    };
    checkCooldown();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleObtain = async () => {
    const loanAmount = parseInt(formData.loanAmount);

    if (!loanAmount || isNaN(loanAmount)) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid loan amount",
        variant: "destructive"
      });
      return;
    }

    if (loanAmount > 40000) {
      toast({
        title: "Invalid Loan Amount",
        description: "Maximum loan amount is ₦40,000",
        variant: "destructive"
      });
      return;
    }

    if (
      !formData.name ||
      !formData.surname ||
      !formData.dob ||
      !formData.email ||
      !formData.address
    ) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
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

      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", session.user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentBalance = profile?.balance || 0;
      const newBalance = currentBalance + loanAmount;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          balance: newBalance,
          last_loan_time: new Date().toISOString()
        })
        .eq("user_id", session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Loan Obtained Successfully!",
        description: `₦${loanAmount.toLocaleString()} has been added to your balance`,
      });

      setCooldownActive(true);

      setTimeout(() => navigate("/dashboard"), 2000);
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
    <div className="min-h-screen p-3 max-w-md mx-auto relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900 to-black animate-gradient-x opacity-90"></div>

      {/* Header */}
      <div className="flex items-center mb-6 pt-2 relative z-10">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-purple-200" />
        </Link>
        <h1 className="text-xl font-semibold text-purple-100">Apply for Loan</h1>
      </div>

      <div className="bg-black/60 backdrop-blur-md border border-purple-500/30 rounded-2xl p-4 space-y-4 relative z-10 shadow-lg shadow-purple-900/50">
        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={cooldownActive}
            className="w-full bg-transparent border border-purple-500/40 text-white placeholder-purple-400 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Surname</label>
          <Input
            type="text"
            name="surname"
            placeholder="Enter your surname"
            value={formData.surname}
            onChange={handleInputChange}
            disabled={cooldownActive}
            className="w-full bg-transparent border border-purple-500/40 text-white placeholder-purple-400 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Date of Birth</label>
          <Input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            disabled={cooldownActive}
            className="w-full bg-transparent border border-purple-500/40 text-white rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={cooldownActive}
            className="w-full bg-transparent border border-purple-500/40 text-white placeholder-purple-400 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">House Address</label>
          <Input
            type="text"
            name="address"
            placeholder="Enter your house address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={cooldownActive}
            className="w-full bg-transparent border border-purple-500/40 text-white placeholder-purple-400 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-200 mb-2">Loan Amount</label>
          <Input
            type="number"
            name="loanAmount"
            placeholder="Enter loan amount"
            value={formData.loanAmount}
            onChange={handleInputChange}
            disabled={cooldownActive}
            className="w-full bg-transparent border border-purple-500/40 text-white placeholder-purple-400 rounded-md focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full mt-6 transition-all duration-300"
          onClick={handleObtain}
          disabled={isProcessing || cooldownActive}
        >
          {cooldownActive
            ? "Loan on cooldown (7 days)"
            : isProcessing
            ? "Processing..."
            : "Obtain"}
        </Button>
      </div>
    </div>
  );
};

export default LoanApplication;
