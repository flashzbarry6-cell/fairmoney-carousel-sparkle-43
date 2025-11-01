import { ArrowLeft, LogOut, Mail, Users, Copy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileUpload } from "@/components/ProfileUpload";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name, referral_code, total_referrals")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setEmail(profile.email || session.user.email || "");
        setFullName(profile.full_name || extractNameFromEmail(profile.email || session.user.email || ""));
        setReferralCode(profile.referral_code || "");
        setTotalReferrals(profile.total_referrals || 0);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractNameFromEmail = (email: string) => {
    if (!email) return "User";
    const username = email.split('@')[0];
    const nameOnly = username.replace(/[^a-zA-Z]/g, '');
    return nameOnly.charAt(0).toUpperCase() + nameOnly.slice(1).toLowerCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
  };

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-4 max-w-md mx-auto">
      <style>{`
        @keyframes purpleGoldGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animated-profile-bg {
          background: linear-gradient(-45deg, #4b0082, #9333ea, #eab308, #fbbf24, #9333ea, #4b0082);
          background-size: 400% 400%;
          animation: purpleGoldGradient 8s ease infinite;
        }
      `}</style>

      <div className="absolute inset-0 animated-profile-bg opacity-90"></div>

      {/* Header */}
      <div className="flex items-center mb-6 pt-2 relative z-10">
        <Link to="/dashboard" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 mb-6 relative z-10 border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <ProfileUpload />
          <h2 className="text-2xl font-bold text-white mt-4">{fullName}</h2>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl border border-white/20">
            <Mail className="w-5 h-5 text-yellow-400 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-300">Email</div>
              <div className="text-white font-medium break-all">{email}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl border border-white/20">
            <Copy className="w-5 h-5 text-yellow-400 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-300">Referral Code</div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">{referralCode}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyReferralCode}
                  className="text-yellow-400 hover:text-yellow-300 p-1 h-auto"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl border border-white/20">
            <Users className="w-5 h-5 text-yellow-400 mt-1" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-300">Total Referrals</div>
              <div className="text-white font-bold text-2xl">{totalReferrals}</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Profile;