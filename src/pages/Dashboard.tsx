import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Smartphone,
  Wifi,
  Zap,
  CreditCard,
  TrendingUp,
  Gift,
  Send,
  CheckCircle2,
  Clock,
  Gamepad2,
  Home,
  Activity as ActivityIcon,
  User,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PromoCarousel } from "@/components/PromoCarousel";
import { BottomCarousel } from "@/components/BottomCarousel";
import { supabase } from "@/integrations/supabase/client";
import { ProfileUpload } from "@/components/ProfileUpload";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState(5000);
  const [timeLeft, setTimeLeft] = useState(300);
  const [lastCheckin, setLastCheckin] = useState<Date | null>(null);
  const [canCheckin, setCanCheckin] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Fetch balance from Supabase
  useEffect(() => {
    const fetchBalance = async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const { data, error } = await supabase
          .from("profiles")
          .select("balance")
          .eq("user_id", user.id)
          .single();

        if (data && !error) {
          setBalance(data.balance || 5000);
        }
      }
    };

    fetchBalance();

    // Add 5000 to balance every 5 minutes
    const balanceInterval = setInterval(async () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        const { data } = await supabase
          .from("profiles")
          .select("balance")
          .eq("user_id", user.id)
          .single();

        if (data) {
          const newBalance = (data.balance || 0) + 5000;
          await supabase
            .from("profiles")
            .update({ balance: newBalance })
            .eq("user_id", user.id);
          
          setBalance(newBalance);
          
          // Log to activity
          const checkinHistory = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
          checkinHistory.push({
            type: "Auto Bonus",
            amount: 5000,
            timestamp: new Date().toISOString(),
          });
          localStorage.setItem("checkinHistory", JSON.stringify(checkinHistory));
          
          toast({
            title: "Auto Bonus!",
            description: "₦5,000 has been added to your balance",
          });
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(balanceInterval);
  }, [toast]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check last check-in
  useEffect(() => {
    const lastCheckinTime = localStorage.getItem("lastCheckin");
    if (lastCheckinTime) {
      const lastTime = new Date(lastCheckinTime);
      setLastCheckin(lastTime);
      const now = new Date();
      const diff = now.getTime() - lastTime.getTime();
      setCanCheckin(diff >= 24 * 60 * 60 * 1000);
    }
  }, []);

  const handleBonusClaim = async () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const newBalance = balance + 5300;
      
      await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("user_id", user.id);
      
      setBalance(newBalance);
      
      // Log to activity
      const checkinHistory = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      checkinHistory.push({
        type: "Bonus Claim",
        amount: 5300,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("checkinHistory", JSON.stringify(checkinHistory));
      
      toast({
        title: "Bonus claimed!",
        description: "₦5,300 has been added to your balance",
      });
    }
  };

  const handleCheckin = async () => {
    if (!canCheckin) {
      toast({
        title: "Already checked in",
        description: "You can check in again in 24 hours",
        variant: "destructive",
      });
      return;
    }

    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      const newBalance = balance + 1500;
      
      await supabase
        .from("profiles")
        .update({ balance: newBalance })
        .eq("user_id", user.id);
      
      setBalance(newBalance);
      
      const now = new Date();
      setLastCheckin(now);
      setCanCheckin(false);
      localStorage.setItem("lastCheckin", now.toISOString());
      
      // Store in checkin history
      const checkinHistory = JSON.parse(localStorage.getItem("checkinHistory") || "[]");
      checkinHistory.push({
        type: "Check-in Reward",
        amount: 1500,
        timestamp: now.toISOString(),
      });
      localStorage.setItem("checkinHistory", JSON.stringify(checkinHistory));
      
      toast({
        title: "Check-in successful!",
        description: "₦1,500 has been added to your balance",
      });
    }
  };

  const services = [
    { icon: Smartphone, label: "Buy Airtime", path: "/buy-airtime", color: "from-blue-500 to-blue-600" },
    { icon: Wifi, label: "Buy Data", path: "/buy-data", color: "from-green-500 to-green-600" },
    { icon: Zap, label: "Electricity", path: "/buy-faircode", color: "from-yellow-500 to-yellow-600" },
    { icon: CreditCard, label: "Betting", path: "/betting", color: "from-red-500 to-red-600" },
    { icon: TrendingUp, label: "Investment", path: "/investment", color: "from-purple-500 to-purple-600" },
    { icon: Gift, label: "Loans", path: "/loan-application", color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm opacity-90">Welcome back</p>
            <h1 className="text-2xl font-bold">
              {JSON.parse(localStorage.getItem("user") || "{}").fullName || "User"}
            </h1>
          </div>
          <ProfileUpload />
        </div>

        {/* Balance Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm opacity-90">Total Balance</p>
              <h2 className="text-3xl font-bold">₦{balance.toLocaleString()}</h2>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </p>
              </div>
              <Button
                onClick={() => navigate("/withdraw")}
                size="sm"
                className="bg-white/20 hover:bg-white/30 border border-white/40"
              >
                <ArrowDownCircle className="w-4 h-4 mr-1" />
                Withdraw
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleBonusClaim} 
              className="flex-1 bg-white text-purple-600 hover:bg-gray-100"
            >
              <Gift className="w-4 h-4 mr-2" />
              Claim Bonus
            </Button>
            <Button
              onClick={() => navigate("/upgrade-account")}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700"
            >
              <ArrowUpCircle className="w-4 h-4 mr-2" />
              Upgrade
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <Button
            onClick={() => navigate("/transfer")}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow min-w-[80px]"
            variant="ghost"
          >
            <Send className="w-6 h-6 text-purple-600" />
            <span className="text-xs">Transfer</span>
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Services</h3>
        <div className="grid grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(service.path)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-center font-medium">{service.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Promo Carousel */}
      <div className="px-6 mb-6">
        <PromoCarousel />
      </div>

      {/* Bottom Carousel */}
      <div className="px-6 mb-3">
        <BottomCarousel />
      </div>

      {/* Task and Check-in Buttons */}
      <div className="px-6 mb-3 flex gap-4">
        <Button
          onClick={() => navigate("/activity")}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6"
        >
          Task
        </Button>
        <Button
          onClick={handleCheckin}
          disabled={!canCheckin}
          className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-6 disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Check In
        </Button>
      </div>

      {/* Why Lumexzz Section */}
      <div className="px-6 mb-6">
        <Card className="bg-gradient-to-br from-black to-purple-900 text-white p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Why Lumexzz?</h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <p className="text-sm">
                <span className="font-semibold">Secure & Encrypted:</span> Your data and transactions are protected with bank-level security
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <p className="text-sm">
                <span className="font-semibold">Lightning Fast:</span> Complete transactions in seconds, not minutes
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <p className="text-sm">
                <span className="font-semibold">24/7 Support:</span> Our dedicated team is always here to help you
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
              <p className="text-sm">
                <span className="font-semibold">Reliable Service:</span> 99.9% uptime guarantee for uninterrupted service
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/invite-earn")}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6 text-lg font-semibold"
          >
            Earn Now
          </Button>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <Button
            onClick={() => {
              setCurrentPage("dashboard");
              navigate("/dashboard");
            }}
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${currentPage === "dashboard" ? "text-purple-600" : "text-gray-600"}`}
          >
            <Home className={`w-6 h-6 ${currentPage === "dashboard" ? "text-purple-600" : "text-gray-400"}`} />
            <span className="text-xs">Dashboard</span>
          </Button>
          <Button
            onClick={() => {
              setCurrentPage("activity");
              navigate("/activity");
            }}
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${currentPage === "activity" ? "text-purple-600" : "text-gray-600"}`}
          >
            <ActivityIcon className={`w-6 h-6 ${currentPage === "activity" ? "text-purple-600" : "text-gray-400"}`} />
            <span className="text-xs">Activity</span>
          </Button>
          <Button
            onClick={() => {
              setCurrentPage("support");
              navigate("/support");
            }}
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${currentPage === "support" ? "text-purple-600" : "text-gray-600"}`}
          >
            <Gift className={`w-6 h-6 ${currentPage === "support" ? "text-purple-600" : "text-gray-400"}`} />
            <span className="text-xs">Support</span>
          </Button>
          <Button
            onClick={() => {
              setCurrentPage("profile");
              navigate("/profile");
            }}
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${currentPage === "profile" ? "text-purple-600" : "text-gray-600"}`}
          >
            <User className={`w-6 h-6 ${currentPage === "profile" ? "text-purple-600" : "text-gray-400"}`} />
            <span className="text-xs">Profile</span>
          </Button>
          <Button
            onClick={() => {
              setCurrentPage("games");
              navigate("/play-games");
            }}
            variant="ghost"
            className={`flex flex-col items-center gap-1 ${currentPage === "games" ? "text-purple-600" : "text-gray-600"}`}
          >
            <Gamepad2 className={`w-6 h-6 ${currentPage === "games" ? "text-purple-600" : "text-gray-400"}`} />
            <span className="text-xs">Play Games</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
