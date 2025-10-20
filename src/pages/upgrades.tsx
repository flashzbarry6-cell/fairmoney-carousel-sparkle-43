import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Upgrade = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-purple-950 to-purple-900 text-white p-6 relative">
      <Link to="/dashboard" className="absolute top-6 left-6">
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>

      <h1 className="text-2xl font-bold text-yellow-400 mb-3">
        Upgrade Your Lumexzz Account
      </h1>

      <p className="text-gray-300 text-center max-w-md mb-6">
        Kindly upgrade your Lumexzz account to unlock access to exclusive features
        like Airtime purchases, cash withdrawals, and referral bonuses.
      </p>

      <button
        className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-full shadow-lg hover:shadow-yellow-500/40 transition-shadow"
      >
        Proceed to Upgrade
      </button>
    </div>
  );
};

export default Upgrade;
