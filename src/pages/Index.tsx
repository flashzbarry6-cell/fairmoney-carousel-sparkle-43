import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-black flex items-center justify-center p-4">
      <div className="text-center max-w-xs mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-purple-400 rounded mr-2"></div>
          <div className="w-6 h-6 bg-purple-300/80 rounded mr-2"></div>
          <div className="w-4 h-4 bg-purple-200/60 rounded"></div>
        </div>
        <h1 className="text-5xl font-bold mb-3 text-white tracking-tight">LUMEXZZ WIN</h1>
        <p className="text-lg text-purple-200 mb-6">Your winning edge in financial freedom</p>
        
        <div className="space-y-3">
          <Link to="/login?tab=login">
            <button className="w-full text-base py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transition-all">Get Started</button>
          </Link>
          <Link to="/login?tab=signup">
            <button className="w-full text-base py-3 bg-white/10 text-white border-2 border-purple-400/50 hover:bg-white/20 font-semibold rounded-full transition-all">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
