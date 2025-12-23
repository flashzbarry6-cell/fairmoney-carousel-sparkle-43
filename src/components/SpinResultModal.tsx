import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PartyPopper, Frown, Sparkles } from "lucide-react";

interface SpinResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: "win" | "lose" | null;
  prizeAmount: number;
}

const SpinResultModal = ({ isOpen, onClose, result, prizeAmount }: SpinResultModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0B0B0B] border border-purple-700/50 max-w-sm mx-auto">
        {result === "win" ? (
          <div className="text-center py-8 space-y-4">
            {/* Celebration effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-purple-500/20 to-yellow-400/20 blur-3xl animate-pulse" />
              <PartyPopper className="w-20 h-20 text-yellow-400 mx-auto relative animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-300 text-lg">You won</p>
              <p className="text-4xl font-bold text-green-400 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                {formatCurrency(prizeAmount)}
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </p>
            </div>
            
            <p className="text-purple-300 text-sm">Your winnings have been credited to your wallet!</p>
            
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-full hover:from-purple-500 hover:to-purple-700 transition-all shadow-[0_0_20px_rgba(123,63,228,0.5)]"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <Frown className="w-20 h-20 text-gray-500 mx-auto" />
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-300">
                😔 Better Luck Next Time
              </h2>
              <p className="text-gray-400">You lost this spin</p>
            </div>
            
            <p className="text-purple-300 text-sm">Don't give up! Try again for a chance to win big!</p>
            
            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-bold rounded-full hover:from-purple-500 hover:to-purple-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SpinResultModal;
