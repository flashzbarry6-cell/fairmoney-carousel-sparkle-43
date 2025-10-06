import { ArrowLeft, TrendingUp, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Investment = () => {
  const plans = [
    {
      id: 1,
      amount: 20,
      roi: "30%",
      duration: "7 days",
      returns: 26,
      accountNumber: "8102562883",
      bank: "Opay",
      accountName: "Veronica Chisom Benjamin",
      naira: 32000,
    },
    {
      id: 2,
      amount: 50,
      roi: "40%",
      duration: "14 days",
      returns: 70,
      accountNumber: "8102562883",
      bank: "Opay",
      accountName: "Veronica Chisom Benjamin",
      naira: 80000,
    },
    {
      id: 3,
      amount: 200,
      roi: "50%",
      duration: "30 days",
      returns: 300,
      accountNumber: "8102562883",
      bank: "Opay",
      accountName: "Veronica Chisom Benjamin",
      naira: 320000,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6 pt-2">
        <Link to="/dashboard" className="mr-3">
          <ArrowLeft className="w-6 h-6 text-white" />
        </Link>
        <h1 className="text-xl font-semibold text-white">Investment Plans</h1>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-900 rounded-2xl p-6 mb-6 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-8 h-8 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Grow Your Wealth</h2>
        </div>
        <p className="text-purple-100 text-sm leading-relaxed">
          Join thousands of smart investors earning passive income through our secure and transparent investment platform. 
          Get guaranteed returns on your investment with 24/7 support and instant withdrawals.
        </p>
      </div>

      {/* Testimonials */}
      <div className="mb-6 space-y-3">
        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
              JD
            </div>
            <div className="flex-1">
              <p className="text-white text-sm mb-1">
                "I started with $20 and earned $30 in just 30 days. Amazing returns!"
              </p>
              <p className="text-purple-300 text-xs">- John D., Lagos</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
              SA
            </div>
            <div className="flex-1">
              <p className="text-white text-sm mb-1">
                "Best investment platform I've used. Fast, secure, and profitable!"
              </p>
              <p className="text-purple-300 text-xs">- Sarah A., Abuja</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Plans */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg mb-3">Choose Your Plan</h3>
        
        {plans.map((plan) => (
          <div
            key={plan.amount}
            className="bg-gradient-to-br from-purple-900/50 to-black rounded-2xl p-5 border border-purple-500/30 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-yellow-400">${plan.amount}</span>
                  <span className="text-purple-300 text-sm">USD</span>
                </div>
                <p className="text-purple-300 text-sm mt-1">₦{plan.naira.toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                {plan.roi} ROI
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-purple-200 text-sm">
                <Clock className="w-4 h-4" />
                <span>Duration: {plan.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-purple-200 text-sm">
                <Shield className="w-4 h-4" />
                <span>100% Secured</span>
              </div>
            </div>

            <Link to={`/investment-payment?plan=${plan.amount}`}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 rounded-full border border-purple-500/30">
                Invest Now
              </Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="mt-6 bg-purple-900/20 backdrop-blur-sm rounded-xl p-5 border border-purple-500/20">
        <h3 className="text-white font-semibold mb-3">Why Lumexzz Investment?</h3>
        <ul className="space-y-2 text-purple-200 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">✓</span>
            <span>Guaranteed returns on every investment</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">✓</span>
            <span>Instant withdrawal to your bank account</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">✓</span>
            <span>24/7 customer support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-400">✓</span>
            <span>Secure and transparent platform</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Investment;
