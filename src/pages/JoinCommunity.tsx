import { Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinCommunity = () => {
  const navigate = useNavigate();
  const [hasJoinedGroup, setHasJoinedGroup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showProceed, setShowProceed] = useState(true);

  const handleJoinCommunity = () => {
    setHasJoinedGroup(true);
    setShowWarning(false);
    setShowProceed(true);
    // Open WhatsApp Channel
    window.open("https://whatsapp.com/channel/0029Vb6eAwH9mrGTeNSKVh1q", "_blank");
  };

  const handleProceed = () => {
    if (!hasJoinedGroup) {
      setShowWarning(true);
      setShowProceed(false);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-gradient-to-br from-black via-purple-900 to-black animate-gradient-x bg-[length:400%_400%]">
      <div className="rounded-3xl p-8 text-white max-w-sm w-full relative shadow-2xl border border-purple-600/30 animate-in slide-in-from-bottom-4 duration-300">
        <div className="text-center">
          {/* Users Icon */}
          <div className="w-20 h-20 bg-purple-700/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <Users className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4">Join Our Community!</h2>

          {/* Description */}
          <p className="text-sm opacity-90 mb-6 leading-relaxed">
            Join our WhatsApp Channel to get updates, tips, and connect with other users of FairMonie Pay.
          </p>

          {/* Warning Text */}
          {showWarning && (
            <p className="text-red-500 text-sm font-medium mb-4">
              Please join the community before proceeding.
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleJoinCommunity}
              className={`w-full font-semibold py-4 rounded-full text-lg transition-all ${
                hasJoinedGroup
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-white text-purple-700 hover:bg-white/90"
              }`}
            >
              {hasJoinedGroup ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Joined Community</span>
                </div>
              ) : (
                "Join Community"
              )}
            </Button>

            {showProceed && (
              <Button
                onClick={handleProceed}
                className={`w-full font-semibold py-4 rounded-full text-lg transition-all ${
                  hasJoinedGroup
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-500 text-gray-300"
                }`}
              >
                Proceed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunity;
