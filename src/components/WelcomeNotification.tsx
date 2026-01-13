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
    <div className="fixed inset-0 flex items-center justify-center px-4 z-50 bg-black/70 backdrop-blur-sm">
      {/* Compact Card */}
      <div className="w-[92%] max-w-[380px] bg-card/95 backdrop-blur-xl rounded-2xl p-5 border border-primary/20 shadow-2xl animate-fade-up">
        {/* Icon */}
        <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
          <Gift className="w-6 h-6 text-primary" />
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-foreground text-center mb-2 leading-tight">
          Welcome to LUMEXZZ WIN!
        </h2>

        {/* Greeting */}
        <p className="text-sm text-foreground text-center mb-2">
          Hello <span className="font-semibold text-primary">{user?.fullName?.toUpperCase() || "USER"}!</span> 👋
        </p>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">
          Join our Telegram community to get updates and start earning.
        </p>

        {/* Warning Text */}
        {showWarning && (
          <p className="text-destructive text-xs font-medium text-center mb-3 animate-fade-up">
            Please join the community before proceeding.
          </p>
        )}

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            onClick={handleJoinCommunity}
            className={`w-full h-11 text-sm font-medium rounded-xl transition-all ${
              hasJoinedGroup
                ? "bg-success hover:bg-success/90 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {hasJoinedGroup ? (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Joined Community</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                <span>Join Community</span>
              </div>
            )}
          </Button>

          <Button
            onClick={handleProceed}
            variant={hasJoinedGroup ? "default" : "secondary"}
            className={`w-full h-11 text-sm font-medium rounded-xl ${
              hasJoinedGroup
                ? "bg-primary/80 hover:bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNotification;
