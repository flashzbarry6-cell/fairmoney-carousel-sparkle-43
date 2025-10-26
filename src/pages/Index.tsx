import { Link } from "react-router-dom";
import goldAbstractBg from "@/assets/gold-abstract-bg.jpeg";

const Index = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${goldAbstractBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="text-center max-w-xs mx-auto relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-gold rounded mr-2"></div>
          <div className="w-6 h-6 bg-gold/80 rounded mr-2"></div>
          <div className="w-4 h-4 bg-gold/60 rounded"></div>
        </div>
        <h1 className="text-5xl font-bold mb-3 text-white tracking-tight drop-shadow-lg">LUMEXZZ WIN</h1>
        <p className="text-lg text-gold mb-8 drop-shadow-lg">Your winning edge in financial freedom</p>
        
        <div className="space-y-3">
          <Link to="/login?tab=login">
            <button className="w-full text-base py-3 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-black font-bold rounded-full shadow-lg hover:shadow-gold/50 transition-all">Get Started</button>
          </Link>
          <Link to="/login?tab=signup">
            <button className="w-full text-base py-3 bg-white/10 text-white border-2 border-gold hover:bg-gold/20 font-semibold rounded-full transition-all backdrop-blur-sm">Create Account</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
