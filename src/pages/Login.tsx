import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();

    const tab = searchParams.get('tab');
    const ref = searchParams.get('ref');
    if (tab === 'signup') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }

    if (ref) {
      setReferralCode(ref);
      setIsSignUp(true);
    }
  }, [navigate, searchParams]);

  const generateDeviceId = () => {
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;

    const deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
    return deviceId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms of service and privacy policy",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        if (referralCode && data.user) {
          const deviceId = generateDeviceId();

          setTimeout(async () => {
            try {
              const { data: referralResult, error: refError } = await supabase
                .rpc('process_referral', {
                  referral_code_input: referralCode,
                  device_id_input: deviceId
                });

              if (refError) {
                console.error('Referral processing error:', refError);
              } else if (referralResult && typeof referralResult === 'object' && 'success' in referralResult && referralResult.success) {
                toast({
                  title: "Referral Applied!",
                  description: "You've been successfully referred!"
                });
              }
            } catch (err) {
              console.error('Error processing referral:', err);
            }
          }, 2000);
        }

        toast({
          title: "Account created successfully",
          description: `Welcome to LUMEXZZ WIN! Please check your email to verify your account.`
        });

        navigate("/dashboard");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_blocked, blocked_reason')
          .eq('user_id', data.user.id)
          .single();

        if (profile?.is_blocked) {
          await supabase.auth.signOut();
          toast({
            title: "Account Restricted",
            description: "Your account has been restricted. Please contact support.",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Login successful",
          description: "Welcome back!"
        });

        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#0a0a0f]">
      {/* Animated Bubble Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating bubbles */}
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
        <div className="bubble bubble-7"></div>
        <div className="bubble bubble-8"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]"></div>
      </div>

      {/* Inline styles for bubbles */}
      <style>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, 
            rgba(139, 92, 246, 0.3) 0%, 
            rgba(124, 58, 237, 0.15) 50%,
            rgba(139, 92, 246, 0.05) 100%
          );
          backdrop-filter: blur(2px);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 
            0 0 40px rgba(139, 92, 246, 0.15),
            inset 0 0 30px rgba(139, 92, 246, 0.1);
          animation: float-bubble 20s ease-in-out infinite;
        }
        
        .bubble::before {
          content: '';
          position: absolute;
          top: 15%;
          left: 20%;
          width: 30%;
          height: 30%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          border-radius: 50%;
        }
        
        .bubble-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          left: -50px;
          animation-delay: 0s;
          animation-duration: 25s;
        }
        
        .bubble-2 {
          width: 200px;
          height: 200px;
          top: 20%;
          right: -50px;
          animation-delay: -5s;
          animation-duration: 20s;
        }
        
        .bubble-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 10%;
          animation-delay: -10s;
          animation-duration: 22s;
        }
        
        .bubble-4 {
          width: 250px;
          height: 250px;
          bottom: -80px;
          right: 15%;
          animation-delay: -3s;
          animation-duration: 28s;
        }
        
        .bubble-5 {
          width: 100px;
          height: 100px;
          top: 40%;
          left: 20%;
          animation-delay: -8s;
          animation-duration: 18s;
        }
        
        .bubble-6 {
          width: 180px;
          height: 180px;
          top: 10%;
          left: 50%;
          animation-delay: -12s;
          animation-duration: 24s;
        }
        
        .bubble-7 {
          width: 120px;
          height: 120px;
          bottom: 30%;
          right: 30%;
          animation-delay: -6s;
          animation-duration: 19s;
        }
        
        .bubble-8 {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 10%;
          animation-delay: -15s;
          animation-duration: 21s;
        }
        
        @keyframes float-bubble {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          25% {
            transform: translate(30px, -40px) rotate(5deg) scale(1.05);
          }
          50% {
            transform: translate(-20px, -80px) rotate(-5deg) scale(0.95);
          }
          75% {
            transform: translate(40px, -40px) rotate(3deg) scale(1.02);
          }
        }
        
        .sharp-card {
          background: linear-gradient(145deg, 
            rgba(20, 20, 30, 0.95) 0%, 
            rgba(15, 15, 25, 0.98) 100%
          );
          border: 1px solid rgba(139, 92, 246, 0.25);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.7),
            0 0 0 1px rgba(139, 92, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        
        .sharp-input {
          background: rgba(15, 15, 25, 0.8);
          border: 1px solid rgba(139, 92, 246, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sharp-input:focus {
          border-color: rgba(139, 92, 246, 0.6);
          box-shadow: 
            0 0 0 3px rgba(139, 92, 246, 0.15),
            0 0 20px rgba(139, 92, 246, 0.2);
          background: rgba(20, 20, 35, 0.9);
        }
        
        .sharp-input:hover:not(:focus) {
          border-color: rgba(139, 92, 246, 0.35);
        }
        
        .glow-button {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%);
          box-shadow: 
            0 4px 15px rgba(139, 92, 246, 0.4),
            0 0 30px rgba(139, 92, 246, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glow-button:hover {
          box-shadow: 
            0 6px 25px rgba(139, 92, 246, 0.5),
            0 0 50px rgba(139, 92, 246, 0.3);
          transform: translateY(-2px);
        }
        
        .glow-button:active {
          transform: translateY(0) scale(0.98);
        }
        
        .tab-active {
          position: relative;
        }
        
        .tab-active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #8b5cf6, #a78bfa, #8b5cf6);
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .logo-glow {
          text-shadow: 
            0 0 20px rgba(139, 92, 246, 0.5),
            0 0 40px rgba(139, 92, 246, 0.3),
            0 0 60px rgba(139, 92, 246, 0.2);
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        
        .animate-pulse-subtle {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center animate-fade-up">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white logo-glow">
              LUMEXZZ WIN
            </h1>
            <p className="text-gray-400 text-sm mt-3 tracking-wide">
              Your winning edge in financial freedom
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="sharp-card rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {/* Tab Switcher */}
          <div className="flex border-b border-purple-500/20">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 ${
                !isSignUp
                  ? 'text-white tab-active'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 ${
                isSignUp
                  ? 'text-white tab-active'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              CREATE ACCOUNT
            </button>
          </div>

          <div className="p-6 pt-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <>
                  <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.15s' }}>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-14 sharp-input rounded-xl text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                    <Input
                      id="referralCode"
                      type="text"
                      placeholder="Referral Code (Optional)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      className="h-14 sharp-input rounded-xl text-white placeholder:text-gray-500"
                    />
                  </div>
                </>
              )}
              <div className="space-y-2 animate-fade-up" style={{ animationDelay: isSignUp ? '0.25s' : '0.15s' }}>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 sharp-input rounded-xl text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2 animate-fade-up" style={{ animationDelay: isSignUp ? '0.3s' : '0.2s' }}>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 sharp-input rounded-xl text-white placeholder:text-gray-500"
                />
              </div>

              {isSignUp && (
                <div className="flex items-start space-x-3 animate-fade-up" style={{ animationDelay: '0.35s' }}>
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    className="mt-1 border-purple-500/50 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400 leading-relaxed">
                    I agree to the{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline transition-colors">
                      terms of service
                    </a>
                    {" "}and{" "}
                    <a href="#" className="text-purple-400 hover:text-purple-300 underline transition-colors">
                      privacy policy
                    </a>
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full h-14 glow-button rounded-xl text-white font-semibold text-base animate-fade-up disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ animationDelay: isSignUp ? '0.4s' : '0.25s' }}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : isSignUp ? (
                  "CREATE ACCOUNT"
                ) : (
                  "LOGIN"
                )}
              </button>
            </form>

            {!isSignUp && (
              <div className="text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300">
                  Forgot password?
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom accent */}
        <div className="mt-8 flex justify-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
