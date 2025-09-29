import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const WithdrawalReceipt = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email || "");
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('user_id', session.user.id)
          .single();
          
        if (profile) {
          setBalance(profile.balance || 0);
        }
      }
    };
    loadUserData();
  }, []);

  const handleFixIssue = () => {
    navigate("/payment-notification");
  };

  const currentDate = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-muted/30 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/referral-requirement" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Withdrawal Receipt</h1>
      </div>

      {/* Receipt */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-dashed border-muted mb-6">
        {/* Receipt Title */}
        <div className="text-center mb-6">
          <div className="text-2xl mb-2">🧾</div>
          <h2 className="text-xl font-bold text-foreground">Withdrawal Receipt</h2>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-muted mb-4"></div>

        {/* Details Section */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">User:</span>
            <span className="font-medium text-foreground">{userEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-foreground">₦{balance.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span className="font-medium text-foreground">{currentDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-bold text-red-600 flex items-center">
              🔴 Withdrawal Pending
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-muted mb-4"></div>

        {/* Reason Section */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
          <div className="flex items-start">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <span className="text-sm text-yellow-800">
              Withdrawals are manually verified to prevent fraud and ensure referral authenticity.
            </span>
          </div>
        </div>
      </div>

      {/* Fix Issue Button */}
      <Button 
        onClick={handleFixIssue}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-full"
      >
        Fix Issue
      </Button>
    </div>
  );
};

export default WithdrawalReceipt;