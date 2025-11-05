import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
      </div>
      <div className="w-full max-w-md">
        {/* Top Animated Title Section */}
        <div className="mb-6 flex justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
              <span className="inline-block typing">LUMEXZZ WIN</span>
            </h1>
            <p className="text-purple-300 text-sm mt-2">Your winning edge in financial freedom</p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="bg-black/90 backdrop-blur-sm shadow-2xl border border-purple-500/30 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="flex">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                  !isSignUp
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                  isSignUp
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/50'
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>

            <div className="p-6 pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <>
                    <div className="space-y-2">
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-14 text-base bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Input
                        id="referralCode"
                        type="text"
                        placeholder="Referral Code (Optional)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="h-14 text-base bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 text-base bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 text-base bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-300/50 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                {isSignUp && (
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                        terms of service
                      </a>
                      {" "}and{" "}
                      <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                        privacy policy
                      </a>
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-base font-medium rounded-xl transition-colors duration-200 shadow-lg"
                  disabled={loading}
                >
                  {loading ? "Processing..." : isSignUp ? "CREATE ACCOUNT" : "LOGIN"}
                </Button>
              </form>

              {!isSignUp && (
                <div className="text-center mt-6">
                  <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .typing {
          display: inline-block;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(168,85,247,0.8), 0 0 20px rgba(168,85,247,0.6);
          }
          50% { 
            text-shadow: 0 0 20px rgba(168,85,247,1), 0 0 30px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.6);
          }
        }

        .bubble {
          position: absolute;
          background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(168,85,247,0) 70%);
          border-radius: 50%;
          opacity: 0.6;
          animation: float-up 15s infinite ease-in-out;
        }

        .bubble-1 {
          width: 60px;
          height: 60px;
          bottom: -60px;
          left: 10%;
          animation-delay: 0s;
        }

        .bubble-2 {
          width: 80px;
          height: 80px;
          bottom: -80px;
          left: 25%;
          animation-delay: 2s;
        }

        .bubble-3 {
          width: 50px;
          height: 50px;
          bottom: -50px;
          right: 15%;
          animation-delay: 4s;
        }

        .bubble-4 {
          width: 70px;
          height: 70px;
          bottom: -70px;
          right: 30%;
          animation-delay: 1s;
        }

        .bubble-5 {
          width: 90px;
          height: 90px;
          bottom: -90px;
          left: 5%;
          animation-delay: 3s;
        }

        .bubble-6 {
          width: 65px;
          height: 65px;
          bottom: -65px;
          right: 8%;
          animation-delay: 5s;
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
