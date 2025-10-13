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
    <div className="min-h-screen bg-muted/30 p-4 max-w-md mx-auto flex flex-col justify-center items-center text-center">
      {/* Header */}
      <div className="absolute top-4 left-4">
        <Link to="/dashboard">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
      </div>

      <div className="mb-8">
        <Send className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Join Our Community
        </h1>
        <p className="text-muted-foreground">
          Join our community to get updates, tips, and start earning with
          LUMEXZZ WIN!
        </p>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-4">
        <Button
          onClick={handleTelegramJoin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-semibold rounded-2xl"
        >
          Join Telegram Community
        </Button>

        <Button
          onClick={handleProceed}
          disabled={!joinedTelegram}
          className={`w-full py-6 text-lg font-semibold rounded-2xl ${
            joinedTelegram
              ? "bg-primary hover:bg-primary-dark text-white"
              : "bg-gray-400 cursor-not-allowed text-white"
          }`}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default JoinCommunity;
