import { ArrowLeft, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const PlayGames = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Play Games</h1>
      </div>

      {/* Coming Soon Content */}
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-purple-600 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-purple-600 to-yellow-400 rounded-full flex items-center justify-center animate-bounce">
            <Gamepad2 className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Coming Soon Text */}
        <div className="text-center space-y-4 px-4">
          <h2 className="text-4xl font-bold text-white animate-fade-in">
            Coming Soon
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-yellow-400 mx-auto animate-scale-in"></div>
          <p className="text-purple-200 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Exciting games are on their way!
          </p>
          <p className="text-gray-400 text-sm max-w-sm mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Get ready to play, compete, and earn rewards. We're working hard to bring you the best gaming experience.
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2 mt-8">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default PlayGames;
