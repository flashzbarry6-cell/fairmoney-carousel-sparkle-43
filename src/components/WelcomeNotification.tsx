import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface WelcomeNotificationProps {
  onClose: () => void;
  onJoinCommunity: () => void;
}

export const WelcomeNotification = ({ onClose, onJoinCommunity }: WelcomeNotificationProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-gradient-to-br from-black via-purple-900 to-black animate-gradient-x bg-[length:400%_400%]">
      <div className="rounded-3xl p-8 text-white max-w-sm w-full relative shadow-2xl border border-purple-600/30 animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center">
          {/* Gift Icon */}
          <div className="w-20 h-20 bg-purple-700/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <Gift className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4">Welcome to LUMEXZZ WIN!</h2>

          {/* Greeting */}
          <p className="text-lg mb-4">
            Hello <span className="font-bold">{user?.fullName?.toUpperCase() || "USER"}!</span> 👋
          </p>

          {/* Description */}
          <p className="text-sm opacity-90 mb-8 leading-relaxed">
            Welcome to LUMEXZZ WIN! Join our community to get updates and start earning with LUMEXZZ WIN.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onJoinCommunity}
              className="w-full font-semibold py-4 rounded-full text-lg bg-white text-purple-700 hover:bg-white/90"
            >
              Join Community
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Keep export for consistency
export default WelcomeNotification;
