import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function JoinGroupNotification({ onComplete }: { onComplete: () => void }) {
  const [hasJoined, setHasJoined] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [flowStep, setFlowStep] = useState(0);

  useEffect(() => {
    if (flowStep === 3) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flowStep, onComplete]);

  const handleProceed = () => {
    if (!hasJoined) {
      setShowWarning(true);
    } else {
      setFlowStep(1);
    }
  };

  const handleJoin = () => {
    window.open("https://t.me/+Z93EW8PWHoQzNGU8", "_blank");
    setHasJoined(true);
  };

  const handleNextFlow = () => {
    if (flowStep === 1) setFlowStep(2);
    else if (flowStep === 2) setFlowStep(3);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-black via-purple-950 to-black text-white overflow-hidden">
      {/* Background Animation */}
      <motion.div
        className="absolute w-96 h-96 bg-purple-600/20 rounded-full blur-3xl top-10 left-10"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-900/30 rounded-full blur-3xl bottom-0 right-0"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Step 0 — Join View */}
      {flowStep === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-black/60 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full backdrop-blur-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Join Our Community</h2>
          <p className="text-gray-400 text-sm mb-6">
            Join our Telegram channel to stay updated and unlock your dashboard access.
          </p>

          {showWarning && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 mb-3 font-semibold"
            >
              Please join the channel first before proceeding.
            </motion.p>
          )}

          <div className="flex flex-col gap-3">
            {!hasJoined ? (
              <>
                <Button
                  onClick={handleJoin}
                  className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full py-3"
                >
                  Join Community Channel
                </Button>
                {!showWarning && (
                  <Button
                    onClick={handleProceed}
                    className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-full py-3"
                  >
                    Proceed
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={() => setFlowStep(1)}
                className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full py-3"
              >
                Proceed
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Step 1 — Secure and Safe */}
      {flowStep === 1 && (
        <motion.div
          key="safe"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-black/60 p-8 rounded-2xl text-center max-w-sm w-full backdrop-blur-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Secure & Safe Transactions</h2>
          <p className="text-gray-400 text-sm mb-6">
            We prioritize your security. Every transaction is encrypted and monitored for safety.
          </p>
          <Button
            onClick={handleNextFlow}
            className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full py-3"
          >
            Proceed
          </Button>
        </motion.div>
      )}

      {/* Step 2 — Welcome Screen */}
      {flowStep === 2 && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-black/60 p-8 rounded-2xl text-center max-w-sm w-full backdrop-blur-lg"
        >
          <motion.h2
            className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 mb-4"
            animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉 Welcome to Lumexzz Win!
          </motion.h2>
          <p className="text-gray-400 mb-6 text-sm">
            Congratulations! You’re now part of our community.
          </p>
          <Button
            onClick={handleNextFlow}
            className="w-full bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-full py-3"
          >
            Proceed to Dashboard
          </Button>
        </motion.div>
      )}

      {/* Step 3 — Final Transition */}
      {flowStep === 3 && (
        <motion.div
          key="final"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h2
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 mb-2"
            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎊 Welcome to Lumexzz Win!
          </motion.h2>
        </motion.div>
      )}
    </div>
  );
}
