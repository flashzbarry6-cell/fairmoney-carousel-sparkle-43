import { ArrowLeft, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const JoinCommunity = () => {
  const navigate = useNavigate();
  const [joinedTelegram, setJoinedTelegram] = useState(false);

  const handleTelegramJoin = () => {
    // Open Telegram channel and mark as joined
    window.open("https://t.me/Plutozanki", "_blank");
    setJoinedTelegram(true);
  };

  const handleProceed = () => {
    if (joinedTelegram) {
      navigate("/dashboard");
    } else {
      alert("Please join our Telegram community first before proceeding.");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <h1 className="text-xl font-semibold text-foreground">
          Join Our Community
        </h1>
      </div>

      {/* Description */}
      <div className="text-center mb-8">
        <p className="text-muted-foreground">
          Join our community to get updates, tips, and start earning with
          LUMEXZZ WIN !
        </p>
      </div>

      {/* Telegram Community */}
      <div className="bg-card rounded-2xl p-6 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Send className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              FairMonie Telegram
            </h3>
            <p className="text-sm text-muted-foreground">
              Join our official Telegram community for updates and exclusive
              content.
            </p>
          </div>
        </div>
        <Button
          onClick={handleTelegramJoin}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        >
          Join Community
        </Button>
      </div>

      {/* Proceed Button */}
      <Button
        onClick={handleProceed}
        disabled={!joinedTelegram}
        className={`w-full mt-4 ${
          joinedTelegram
            ? "bg-primary hover:bg-primary-dark text-white"
            : "bg-gray-400 cursor-not-allowed text-white"
        }`}
      >
        Proceed
      </Button>
    </div>
  );
};

export default JoinCommunity;
