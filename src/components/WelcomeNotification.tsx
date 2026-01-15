import { Gift, CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface WelcomeNotificationProps {
  onClose: () => void;
  onJoinCommunity: () => void;
}

export const WelcomeNotification = ({ onClose, onJoinCommunity }: WelcomeNotificationProps) => {
  const [user, setUser] = useState<any>(null);
  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleJoinCommunity = () => {
    setHasJoinedGroup(true);
    setShowWarning(false);
    // Open Telegram Channel
    window.open("https://t.me/Plutozanki", "_blank");
  };

  const handleProceed = () => {
    if (!hasJoinedGroup) {
      setShowWarning(true);
      return;
    }
    onJoinCommunity();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-md">
      {/* Centered Card - Luxurious Purple & Black */}
      <div className="w-[90%] max-w-[400px] bg-gradient-to-b from-[#1a1025] via-[#2d1b4e] to-[#1a1025] backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-[0_0_60px_rgba(139,92,246,0.3)] animate-fade-up mx-auto">
        {/* Icon */}
        <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-400/40 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
          <Gift className="w-10 h-10 text-purple-300" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3 leading-tight">
          Welcome to LUMEXZZ WIN!
        </h2>

        {/* Greeting */}
        <p className="text-base text-white/90 text-center mb-3">
          Hello <span className="font-bold text-white">{user?.fullName?.toUpperCase() || "USER"}!</span> 👋
        </p>

        {/* Description */}
        <p className="text-sm text-white/80 text-center mb-6 leading-relaxed">
          Earn welcome bonus and daily cash by completing easy tasks. But first, join our Telegram channel for updates!
        </p>

        {/* Warning Text */}
        {showWarning && (
          <p className="text-yellow-300 text-sm font-medium text-center mb-4 animate-pulse">
            ⚠️ Please join the community before proceeding.
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleJoinCommunity}
            className={`w-full h-12 text-base font-semibold rounded-xl transition-all shadow-lg ${
              hasJoinedGroup
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-purple-500 hover:bg-purple-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]"
            }`}
          >
            {hasJoinedGroup ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Joined Community</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                <span>Join Telegram Channel</span>
              </div>
            )}
          </Button>

          <Button
            onClick={handleProceed}
            className={`w-full h-12 text-base font-semibold rounded-xl transition-all ${
              hasJoinedGroup
                ? "bg-purple-500/30 hover:bg-purple-500/50 text-white border border-purple-400/40"
                : "bg-white/5 text-white/50 border border-white/10"
            }`}
          >
            Proceed
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-purple-400/40"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400/40"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400/40"></div>
          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNotification;
