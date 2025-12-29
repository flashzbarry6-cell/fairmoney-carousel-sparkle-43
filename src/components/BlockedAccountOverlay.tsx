import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Ban, LogOut } from 'lucide-react';

interface BlockedAccountOverlayProps {
  children: React.ReactNode;
}

export const BlockedAccountOverlay = ({ children }: BlockedAccountOverlayProps) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedReason, setBlockedReason] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkBlockedStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setChecking(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_blocked, blocked_reason')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking blocked status:', error);
          setChecking(false);
          return;
        }

        if (profile?.is_blocked) {
          setIsBlocked(true);
          setBlockedReason(profile.blocked_reason);
        }
      } catch (err) {
        console.error('Error in blocked check:', err);
      } finally {
        setChecking(false);
      }
    };

    checkBlockedStatus();

    // Subscribe to profile changes for real-time blocking
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('blocked-status')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new.is_blocked) {
              setIsBlocked(true);
              setBlockedReason(payload.new.blocked_reason);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtimeSubscription();
  }, []);

  // Countdown and logout effect
  useEffect(() => {
    if (!isBlocked) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Logout and redirect
      supabase.auth.signOut().then(() => {
        navigate('/login', { replace: true });
      });
    }
  }, [isBlocked, countdown, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black">
        <div className="w-8 h-8 border-4 border-luxury-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-black to-purple-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-md w-full mx-4 p-8 bg-gradient-to-br from-red-950/80 to-black/90 border border-red-500/40 rounded-3xl shadow-2xl animate-scale-in">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse">
              <Ban className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            🚫 Account Suspended
          </h1>
          <p className="text-center text-red-300 mb-6">
            Your account has been blocked by admin.
          </p>

          {/* Reason */}
          {blockedReason && (
            <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-300">
                <span className="text-red-400 font-semibold">Reason: </span>
                {blockedReason}
              </p>
            </div>
          )}

          {/* Countdown */}
          <div className="text-center mb-6">
            <p className="text-gray-400 mb-2">Logging out in</p>
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg shadow-red-500/40">
              <span className="text-4xl font-bold text-white font-mono">{countdown}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <LogOut className="w-4 h-4" />
            <span>You will be redirected to login</span>
          </div>

          {/* Contact Support */}
          <div className="mt-6 pt-6 border-t border-red-500/20">
            <p className="text-center text-gray-400 text-sm">
              Contact support if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BlockedAccountOverlay;
