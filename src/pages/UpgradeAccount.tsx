import { ArrowLeft, Crown, Zap, Gift, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";

const UpgradeAccount = () => {
  const plans = [
    {
      name: "Bronze",
      price: 5000,
      icon: Crown,
      color: "from-amber-700 to-amber-900",
      features: [
        "Daily check-in rewards",
        "Basic referral bonuses",
        "Auto bonus every 5 minutes",
        "Standard withdrawal speed"
      ]
    },
    {
      name: "Silver",
      price: 15000,
      icon: Zap,
      color: "from-gray-400 to-gray-600",
      features: [
        "All Bronze features",
        "2x Daily check-in rewards",
        "Enhanced referral bonuses",
        "Priority customer support"
      ]
    },
    {
      name: "Gold",
      price: 25000,
      icon: Gift,
      color: "from-yellow-400 to-yellow-600",
      features: [
        "All Silver features",
        "3x Daily check-in rewards",
        "VIP referral bonuses",
        "Instant withdrawal processing",
        "Exclusive investment opportunities"
      ]
    },
    {
      name: "Platinum",
      price: 45000,
      icon: TrendingUp,
      color: "from-purple-400 to-purple-600",
      features: [
        "All Gold features",
        "5x Daily check-in rewards",
        "Premium referral bonuses",
        "Dedicated account manager",
        "Early access to new features",
        "Bonus investment returns"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Upgrade Account</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-6 mb-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Unlock More Earnings</h2>
        </div>
        <p className="text-purple-100 text-sm leading-relaxed">
          Upgrade your account to access premium features, higher rewards, and exclusive benefits. 
          Choose the plan that fits your earning goals.
        </p>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className="bg-gradient-to-br from-purple-900/50 to-black rounded-2xl p-5 border border-purple-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                    <p className="text-purple-300 text-sm">₦{plan.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-semibold">
                  POPULAR
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span className="text-purple-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link to={`/upgrade-processing?plan=${plan.name}&amount=${plan.price}`}>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 rounded-full border border-purple-500/30">
                  Upgrade to {plan.name}
                </Button>
              </Link>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default UpgradeAccount;
