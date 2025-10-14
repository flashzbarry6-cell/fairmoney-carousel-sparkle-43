import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SpinWin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link to="/dashboard" className="text-white flex items-center space-x-1 text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Animated Glow Background */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-bold text-purple-400 mb-2">🎯 Spin & Win</h1>
        <p className="text-gray-300 text-sm mb-6">
          Exciting rewards are coming soon! Stay tuned for our Spin & Win feature.
        </p>

        <motion.div
          className="px-6 py-3 rounded-full bg-purple-700/40 text-white border border-purple-500 shadow-lg backdrop-blur-sm"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Coming Soon ✨
        </motion.div>
      </motion.div>
    </div>
  );
}
