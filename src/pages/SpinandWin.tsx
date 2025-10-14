import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SpinWin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      
      {/* 🔙 Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link to="/dashboard" className="text-purple-300 hover:text-purple-400 flex items-center space-x-1 text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* 💜 Animated Glowing Orbs */}
      <motion.div
        className="absolute w-80 h-80 bg-purple-600/20 rounded-full blur-3xl top-10 left-10"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-900/30 rounded-full blur-3xl bottom-0 right-0"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✨ Page Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4"
        >
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto drop-shadow-lg" />
        </motion.div>

        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 mb-3 tracking-wide">
          Spin & Win
        </h1>

        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-gray-400 text-sm max-w-sm mx-auto mb-8"
        >
          Get ready for exciting rewards and daily spins.  
          The wheel of fortune is almost here!
        </motion.p>

        {/* 💎 Shimmering Coming Soon Button */}
        <div className="relative overflow-hidden inline-block rounded-full">
          <motion.div
            className="px-10 py-3 rounded-full bg-gradient-to-r from-purple-700 to-purple-500 text-white font-semibold shadow-lg shadow-purple-700/40 border border-purple-500/50 backdrop-blur-sm relative"
            animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎯 Coming Soon...
            {/* ✨ Shimmer overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
export default function SpinAndWin() {

