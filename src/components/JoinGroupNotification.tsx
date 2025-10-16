import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function JoinGroupNotification() {
  const navigate = useNavigate();
  const [hasJoined, setHasJoined] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showStep, setShowStep] = useState<"join" | "secure" | "welcome">("join");

  // Simulate join action
  const handleJoin = () => {
    setHasJoined(true);
    setShowWarning(false);
  };

  // Handle proceed logic
  const handleProceed = () => {
    if (!hasJoined) {
      setShowWarning(true);
      return;
    }

    // Step flow animation
    setShowStep("secure");
    setTimeout(() => setShowStep("welcome"), 3000);
    setTimeout(() => navigate("/dashboard"), 6000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative text-center p-8 rounded-3xl shadow-lg border border-purple-600 bg-black/60 backdrop-blur-lg w-[90%] max-w-sm"
      >
        {showStep === "join" && (
          <>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-400 mb-6">
              Connect with Lumexzz members for updates, support, and bonuses.
            </p>

            {showWarning && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 font-semibold mb-4"
              >
                ⚠️ Please join the community first before proceeding.
              </motion.p>
            )}

            <div className="space-y-4">
              {!hasJoined && (
                <Button
                  onClick={handleJoin}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full"
                >
                  Join Community Channel
                </Button>
              )}

              <Button
                onClick={handleProceed}
                className={`w-full font-semibold py-3 rounded-full ${
                  hasJoined
                    ? "bg-gold hover:bg-yellow-500 text-black"
                    : "bg-purple-900 text-gray-400"
                }`}
              >
                {hasJoined ? "Proceed" : "Proceed"}
              </Button>
            </div>
          </>
        )}

        {showStep === "secure" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-purple-300 mb-3">
              🔒 Secure & Safe Transactions
            </h2>
            <p className="text-gray-400 mb-6">
              Your funds and data are protected by Lumexzz’s advanced system.
            </p>
            <Button
              onClick={() => setShowStep("welcome")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {showStep === "welcome" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-3xl font-extrabold text-purple-400 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              🎉 Welcome to Lumexzz Win!
            </motion.h2>
            <p className="text-gray-300 mb-4">
              Congratulations on joining the winning community!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
