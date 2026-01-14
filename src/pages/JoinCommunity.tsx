import { Users, CheckCircle, Send } from "lucide-react";
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
    // Open Telegram Channel
    window.open("https://t.me/Plutozanki", "_blank");
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
    <div className="fixed inset-0 flex items-center justify-center px-4 z-50 bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-64 h-64 bg-primary/20 rounded-full blur-[100px] animate-float" 
          style={{ top: '-10%', left: '-10%' }} 
        />
        <div className="absolute w-56 h-56 bg-primary/15 rounded-full blur-[80px] animate-float" 
          style={{ bottom: '-5%', right: '-5%', animationDelay: '2s' }} 
        />
      </div>

      {/* Compact Card Container */}
      <div className="relative z-10 w-[92%] max-w-[380px] mx-auto">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl p-5 border border-primary/20 shadow-2xl animate-fade-up  -mt-16 sm:mt-0">">
          {/* Icon */}
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <Send className="w-6 h-6 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-foreground text-center mb-2 leading-tight">
            Join Our Community!
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center mb-5 leading-relaxed">
            Join our Telegram Channel to get updates, tips, and connect with other users.
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

            {showProceed && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunity;
