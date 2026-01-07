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
    <div className="min-h-screen phoenix-bg-animated flex items-center justify-center p-4 relative overflow-hidden">
      {/* Phoenix Flame Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float" 
          style={{ top: '-20%', left: '-10%' }} 
        />
        <div className="absolute w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] animate-float" 
          style={{ bottom: '-15%', right: '-10%', animationDelay: '3s' }} 
        />
        <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] animate-float" 
          style={{ top: '40%', right: '5%', animationDelay: '5s' }} 
        />
        
        {/* Phoenix flame lines */}
        <div className="phoenix-glow-line top-1/4 opacity-30" />
        <div className="phoenix-glow-line top-1/2 opacity-20" style={{ animationDelay: '1s' }} />
        <div className="phoenix-glow-line top-3/4 opacity-25" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center animate-fade-up">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white glow-text">
              LUMEXZZ WIN
            </h1>
            <p className="text-muted-foreground text-sm mt-3 tracking-wide">
              Your winning edge in financial freedom
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="phoenix-card-glow animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <CardContent className="p-0">
            {/* Tab Switcher */}
            <div className="flex border-b border-border/50">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
                  !isSignUp
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                LOGIN
                {!isSignUp && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-light" />
                )}
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
                  isSignUp
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                CREATE ACCOUNT
                {isSignUp && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary-light" />
                )}
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
                        className="h-14"
                      />
                    </div>
                    <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                      <Input
                        id="referralCode"
                        type="text"
                        placeholder="Referral Code (Optional)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        className="h-14"
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
                    className="h-14"
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
                    className="h-14"
                  />
                </div>

                {isSignUp && (
                  <div className="flex items-start space-x-3 animate-fade-up" style={{ animationDelay: '0.35s' }}>
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                      className="mt-1 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:text-primary-light underline transition-colors">
                        terms of service
                      </a>
                      {" "}and{" "}
                      <a href="#" className="text-primary hover:text-primary-light underline transition-colors">
                        privacy policy
                      </a>
                    </label>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="phoenix"
                  size="xl"
                  className="w-full animate-fade-up"
                  style={{ animationDelay: isSignUp ? '0.4s' : '0.25s' }}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="phoenix-loader !w-5 !h-5" />
                  ) : isSignUp ? (
                    "CREATE ACCOUNT"
                  ) : (
                    "LOGIN"
                  )}
                </Button>
              </form>

              {!isSignUp && (
                <div className="text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
                  <button className="text-primary hover:text-primary-light text-sm font-medium transition-colors duration-300">
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Phoenix Flame Motif */}
        <div className="mt-8 flex justify-center animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <div className="phoenix-divider w-32" />
        </div>
      </div>
    </div>
  );
};

export default Login;
