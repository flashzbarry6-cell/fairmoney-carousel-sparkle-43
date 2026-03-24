import { useState, useRef, useEffect } from "react";
import { Gift, Sparkles, Zap } from "lucide-react";

interface SpinWheelProps {
  onSpinComplete: (result: "win" | "lose", prizeAmount: number) => void;
  isSpinning: boolean;
  onSpin: () => void;
  stakeAmount: number;
  balance: number;
}

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

const WIN_PROBABILITY = 0.35;

const SpinWheel = ({ onSpinComplete, isSpinning, onSpin, stakeAmount, balance }: SpinWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [animating, setAnimating] = useState(false);
  const pendingResultRef = useRef<{ result: "win" | "lose"; prize: number } | null>(null);
  const segmentAngle = 360 / SEGMENTS.length;

  useEffect(() => {
    if (isSpinning && !animating) {
      setAnimating(true);

      const isWin = Math.random() < WIN_PROBABILITY;

      const targetSegments = SEGMENTS.map((seg, i) => ({ ...seg, index: i }))
        .filter(seg => seg.isWin === isWin);

      const targetSegment = targetSegments[Math.floor(Math.random() * targetSegments.length)];

      const spins = 5 + Math.random() * 3;
      const targetAngle = targetSegment.index * segmentAngle + segmentAngle / 2;
      const finalRotation = rotation + spins * 360 + (360 - targetAngle);

      const prizeAmount = isWin ? Math.floor(stakeAmount * targetSegment.multiplier) : 0;
      pendingResultRef.current = { result: isWin ? "win" : "lose", prize: prizeAmount };

      // Use requestAnimationFrame to ensure the browser paints the initial state first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRotation(finalRotation);
        });
      });

      setTimeout(() => {
        setAnimating(false);
        if (pendingResultRef.current) {
          onSpinComplete(pendingResultRef.current.result, pendingResultRef.current.prize);
          pendingResultRef.current = null;
        }
      }, 5200);
    }
  }, [isSpinning]);

  const handleSpinClick = () => {
    if (isSpinning || animating || balance < stakeAmount) return;
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
          className="relative w-72 h-72 rounded-full border-4 border-purple-500/50 shadow-[0_0_30px_rgba(123,63,228,0.5)] overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: animating ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
          }}
        >
          {/* SVG wheel for clean segments */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
            {SEGMENTS.map((segment, index) => {
              const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);
              const x1 = 100 + 100 * Math.cos(startAngle);
              const y1 = 100 + 100 * Math.sin(startAngle);
              const x2 = 100 + 100 * Math.cos(endAngle);
              const y2 = 100 + 100 * Math.sin(endAngle);
              const largeArc = segmentAngle > 180 ? 1 : 0;

              const midAngle = ((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);
              const textX = 100 + 60 * Math.cos(midAngle);
              const textY = 100 + 60 * Math.sin(midAngle);
              const textRotation = (index + 0.5) * segmentAngle;

              return (
                <g key={index}>
                  <path
                    d={`M100,100 L${x1},${y1} A100,100 0 ${largeArc},1 ${x2},${y2} Z`}
                    fill={segment.color}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    className={segment.isWin ? "fill-yellow-400" : "fill-gray-400"}
                    fontSize="8"
                    fontWeight="bold"
                  >
                    {segment.label}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center circle */}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 border-2 border-purple-400/50 flex items-center justify-center shadow-lg z-10">
            <Gift className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        {/* Decorative lights around wheel */}
        <div className="absolute inset-0 -m-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-3 h-3 rounded-full ${animating ? "animate-pulse" : ""}`}
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
        disabled={isSpinning || animating || balance < stakeAmount}
        className={`mt-8 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
          isSpinning || animating || balance < stakeAmount
            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-500 hover:to-purple-700 shadow-[0_0_20px_rgba(123,63,228,0.5)] hover:shadow-[0_0_30px_rgba(123,63,228,0.7)]"
        }`}
      >
        {isSpinning || animating ? (
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
