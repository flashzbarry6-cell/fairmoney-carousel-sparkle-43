import { useState, useRef, useEffect } from "react";
import { Gift, Sparkles, Zap } from "lucide-react";

interface SpinWheelProps {
  onSpinComplete: (result: "win" | "lose", prizeAmount: number) => void;
  isSpinning: boolean;
  onSpin: () => void;
  stakeAmount: number;
  balance: number;
}

// Wheel segments configuration - easily adjustable
const SEGMENTS = [
  { label: "WIN 2X", multiplier: 2, isWin: true, color: "#7B3FE4" },
  { label: "LOSE", multiplier: 0, isWin: false, color: "#1A1A1A" },
  { label: "WIN 1.5X", multiplier: 1.5, isWin: true, color: "#5B2DBD" },
  { label: "LOSE", multiplier: 0, isWin: false, color: "#222222" },
  { label: "WIN 3X", multiplier: 3, isWin: true, color: "#9A6BFF" },
  { label: "LOSE", multiplier: 0, isWin: false, color: "#1A1A1A" },
  { label: "WIN 1.5X", multiplier: 1.5, isWin: true, color: "#7B3FE4" },
  { label: "LOSE", multiplier: 0, isWin: false, color: "#222222" },
];

// Win probability (35% win chance) - adjustable for fairness
const WIN_PROBABILITY = 0.35;

const SpinWheel = ({ onSpinComplete, isSpinning, onSpin, stakeAmount, balance }: SpinWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [hasStartedSpin, setHasStartedSpin] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const segmentAngle = 360 / SEGMENTS.length;

  // When isSpinning becomes true (from parent), start the wheel animation
  useEffect(() => {
    if (isSpinning && !hasStartedSpin) {
      setHasStartedSpin(true);
      
      // Determine win/lose based on probability
      const isWin = Math.random() < WIN_PROBABILITY;
      
      // Get winning or losing segments
      const targetSegments = SEGMENTS.map((seg, i) => ({ ...seg, index: i }))
        .filter(seg => seg.isWin === isWin);
      
      // Pick random target segment
      const targetSegment = targetSegments[Math.floor(Math.random() * targetSegments.length)];
      
      // Calculate target rotation (multiple full spins + landing position)
      const spins = 5 + Math.random() * 3; // 5-8 full rotations for 5 seconds
      const targetAngle = targetSegment.index * segmentAngle + segmentAngle / 2;
      const finalRotation = rotation + spins * 360 + (360 - targetAngle);
      
      setRotation(finalRotation);
      
      // Wait for 5 second animation to complete
      setTimeout(() => {
        const prizeAmount = isWin ? Math.floor(stakeAmount * targetSegment.multiplier) : 0;
        onSpinComplete(isWin ? "win" : "lose", prizeAmount);
        setHasStartedSpin(false);
      }, 5000);
    }
  }, [isSpinning]);

  const handleSpinClick = () => {
    if (isSpinning || balance < stakeAmount) return;
    onSpin();
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer glow ring */}
      <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-purple-600/30 via-purple-400/20 to-purple-600/30 blur-xl animate-pulse" />
      
      {/* Wheel container */}
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 drop-shadow-lg" />
        </div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className="relative w-72 h-72 rounded-full border-4 border-purple-500/50 shadow-[0_0_30px_rgba(123,63,228,0.5)] overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {/* Segments */}
          {SEGMENTS.map((segment, index) => {
            const angle = index * segmentAngle;
            return (
              <div
                key={index}
                className="absolute w-full h-full origin-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                }}
              >
                <div
                  className="absolute top-0 left-1/2 h-1/2 origin-bottom"
                  style={{
                    width: "100%",
                    marginLeft: "-50%",
                    clipPath: `polygon(50% 100%, ${50 - Math.tan((segmentAngle * Math.PI) / 360) * 50}% 0%, ${50 + Math.tan((segmentAngle * Math.PI) / 360) * 50}% 0%)`,
                    backgroundColor: segment.color,
                    borderRight: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div 
                    className="absolute top-4 left-1/2 -translate-x-1/2 text-center"
                    style={{ transform: "translateX(-50%) rotate(0deg)" }}
                  >
                    <span className={`text-xs font-bold ${segment.isWin ? "text-yellow-400" : "text-gray-400"}`}>
                      {segment.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Center circle */}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 border-2 border-purple-400/50 flex items-center justify-center shadow-lg">
            <Gift className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        {/* Decorative lights around wheel */}
        <div className="absolute inset-0 -m-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${isSpinning ? "animate-pulse" : ""}`}
              style={{
                top: `${50 - 48 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                left: `${50 + 48 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                backgroundColor: i % 2 === 0 ? "#9A6BFF" : "#FFD700",
                boxShadow: `0 0 10px ${i % 2 === 0 ? "#9A6BFF" : "#FFD700"}`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Spin button */}
      <button
        onClick={handleSpinClick}
        disabled={isSpinning || balance < stakeAmount}
        className={`mt-8 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
          isSpinning || balance < stakeAmount
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 shadow-[0_0_20px_rgba(123,63,228,0.5)] hover:shadow-[0_0_30px_rgba(123,63,228,0.7)]"
        }`}
      >
        {isSpinning ? (
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin" />
            Spinning...
          </span>
        ) : balance < stakeAmount ? (
          <span className="flex items-center gap-2">
            Insufficient Balance
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            SPIN NOW
          </span>
        )}
      </button>
    </div>
  );
};

export default SpinWheel;
