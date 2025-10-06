import { useEffect, useState } from "react";
import { Gamepad2, Sparkles } from "lucide-react";

export default function PlayGames() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-6">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <Gamepad2 className="w-32 h-32 text-purple-400 mx-auto relative animate-bounce" />
          <Sparkles className="w-8 h-8 text-yellow-400 absolute top-0 right-1/4 animate-pulse" />
          <Sparkles className="w-6 h-6 text-purple-300 absolute bottom-4 left-1/4 animate-pulse delay-150" />
        </div>

        {/* Coming Soon Text */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-pulse">
            Coming Soon{dots}
          </h1>
          <p className="text-xl text-purple-300 font-medium">
            Get ready for amazing games and rewards!
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center gap-4 mt-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
