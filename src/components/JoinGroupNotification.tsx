import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function JoinGroupNotification({
  showGroupModal,
  setShowGroupModal,
}: {
  showGroupModal: boolean;
  setShowGroupModal: (v: boolean) => void;
}) {
  const [hasJoined, setHasJoined] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // flow: 1 = join/proceed, 2 = secure info, 3 = welcome
  const [show, setShow] = useState(showGroupModal);

  useEffect(() => {
    setShow(showGroupModal);
  }, [showGroupModal]);

  const handleJoin = () => {
    window.open("https://t.me/+Z93EW8PWHoQzNGU8", "_blank");
    setHasJoined(true);
    setShowError(false);
  };

  const handleProceed = () => {
    if (!hasJoined) {
      setShowError(true);
      return;
    }

    // move to next step
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // close modal after final step
      setTimeout(() => {
        setShowGroupModal(false);
      }, 3000);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-black via-purple-950 to-black p-6 rounded-3xl shadow-lg max-w-sm w-full text-center border border-purple-700/50 relative overflow-hidden"
      >
        {/* Animated purple glow */}
        <motion.div
          className="absolute inset-0 bg-purple-700/10 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {currentStep === 1 && (
          <>
            <h2 className="text-xl font-bold text-purple-300 mb-4">
              Join Our Community
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Stay connected and receive the latest updates and rewards.
            </p>

            {showError && (
              <p className="text-red-500 text-xs mb-3 font-medium">
                ⚠️ Please join the channel first before proceeding.
              </p>
            )}

            <div className="space-y-4">
              <button
                onClick={handleJoin}
                className={`w-full py-3 rounded-full font-semibold transition ${
                  hasJoined
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gradient-to-r from-purple-700 to-purple-500 text-white hover:opacity-90"
                }`}
              >
                {hasJoined ? "✅ Proceed" : "💬 Join Community Channel"}
              </button>

              {!hasJoined && (
                <button
                  onClick={handleProceed}
                  className="w-full bg-gray-800 text-gray-200 hover:bg-gray-700 py-3 rounded-full font-semibold"
                >
                  Proceed
                </button>
              )}
            </div>
          </>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-purple-300 mb-2">
              🔒 Secure & Safe Transactions
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Enjoy a seamless experience with our verified and trusted system.
            </p>
            <button
              onClick={handleProceed}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full"
            >
              Proceed
            </button>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.h2
              className="text-2xl font-extrabold text-purple-300 mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              🎉 Welcome to Lumexzz Win!
            </motion.h2>
            <p className="text-gray-400 text-sm">
              Get ready to earn and grow with our amazing community!
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
