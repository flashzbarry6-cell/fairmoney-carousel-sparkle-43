import { useState, useEffect } from "react";
import { Wallet, X, ShieldCheck } from "lucide-react";

interface WithdrawalData {
  name: string;
  amount: string;
  time: string;
}

export const WithdrawalNotification = () => {
  const [currentNotification, setCurrentNotification] = useState<WithdrawalData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const withdrawals: WithdrawalData[] = [
    { name: "John Adebayo", amount: "₦150,000", time: "2 mins ago" },
    { name: "Sarah Okafor", amount: "₦200,000", time: "5 mins ago" },
    { name: "David Emeka", amount: "₦100,000", time: "8 mins ago" },
    { name: "Grace Amina", amount: "₦250,000", time: "12 mins ago" },
    { name: "Michael Tunde", amount: "₦180,000", time: "15 mins ago" },
    { name: "Blessing Kemi", amount: "₦220,000", time: "18 mins ago" },
    { name: "Ibrahim Hassan", amount: "₦130,000", time: "22 mins ago" },
    { name: "Chioma Nkem", amount: "₦190,000", time: "25 mins ago" },
  ];

  const handleDismiss = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  useEffect(() => {
    let notificationIndex = 0;

    const showNotification = () => {
      setCurrentNotification(withdrawals[notificationIndex]);
      setIsVisible(true);
      setIsAnimatingOut(false);

      // Hide after 2 seconds
      setTimeout(() => {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          setIsAnimatingOut(false);
          
          // Show next notification after 2 seconds
          setTimeout(() => {
            notificationIndex = (notificationIndex + 1) % withdrawals.length;
            showNotification();
          }, 2000);
        }, 300);
      }, 2000);
    };

    // Start showing notifications after 3 seconds
    const initialTimer = setTimeout(() => {
      showNotification();
    }, 3000);

    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  if (!currentNotification || !isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isAnimatingOut 
          ? 'opacity-0 -translate-y-2' 
          : 'opacity-100 translate-y-0 animate-slide-down'
      }`}
    >
      {/* Main Container with Glassmorphism */}
      <div className="relative bg-phoenix-black/90 backdrop-blur-xl border border-phoenix-purple/40 rounded-2xl shadow-[0_8px_32px_rgba(107,44,245,0.25)] overflow-hidden min-w-[340px] max-w-[380px] group hover:border-phoenix-purple/60 transition-all duration-300">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-phoenix-purple/10 via-transparent to-phoenix-royal/10 pointer-events-none" />
        
        {/* Top Glow Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-phoenix-purple/60 to-transparent" />
        
        <div className="relative flex items-center gap-3 p-4">
          {/* Left Icon - Wallet with Glow */}
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-phoenix-purple to-phoenix-royal flex items-center justify-center shadow-[0_0_20px_rgba(107,44,245,0.4)] animate-glow-pulse">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            {/* Success Checkmark Badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-phoenix-black">
              <ShieldCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm tracking-wide">
              Withdrawal Successful
            </h4>
            <p className="text-phoenix-muted text-xs mt-0.5 truncate">
              <span className="text-white/90 font-medium">{currentNotification.name}</span> withdrew{" "}
              <span className="text-emerald-400 font-semibold">{currentNotification.amount}</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-phoenix-muted/70 text-[10px]">
                {currentNotification.time} • Processed securely via Lumexzz
              </span>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-phoenix-muted hover:text-white hover:bg-phoenix-purple/30 transition-all duration-200 group/close"
          >
            <X className="w-4 h-4 group-hover/close:scale-110 transition-transform" />
          </button>
        </div>
        
        {/* Bottom Progress Indicator (subtle) */}
        <div className="h-0.5 bg-phoenix-royal/20">
          <div className="h-full bg-gradient-to-r from-phoenix-purple to-emerald-500 animate-[shrink_2s_linear]" />
        </div>
      </div>
    </div>
  );
};
