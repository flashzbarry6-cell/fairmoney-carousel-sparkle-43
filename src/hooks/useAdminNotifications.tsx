import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from './useAdmin';

export interface AdminNotification {
  id: string;
  type: 'pending_payment' | 'new_user' | 'withdrawal_request';
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  amount: number | null;
  reference_id: string | null;
  message: string;
  is_read: boolean;
  is_resolved: boolean;
  priority: 'normal' | 'high';
  created_at: string;
}

export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAdmin, userId } = useAdmin();

  const fetchNotifications = useCallback(async () => {
    if (!isAdmin) return;

    try {
      const { data, error } = await supabase
        .from('admin_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      setNotifications((data as AdminNotification[]) || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (err) {
      console.error('Error in fetchNotifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    }
  };

  const markAsResolved = async (notificationId: string) => {
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_resolved: true, is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_resolved: true, is_read: true } : n)
      );
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchNotifications();
    }
  }, [isAdmin, fetchNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'admin_notifications'
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as AdminNotification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Play sound for high priority notifications
          if (newNotification.priority === 'high') {
            try {
              // Create a simple beep sound
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);
              oscillator.frequency.value = 800;
              gainNode.gain.value = 0.3;
              oscillator.start();
              setTimeout(() => oscillator.stop(), 200);
            } catch (e) {
              console.log('Could not play notification sound');
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    markAsResolved,
    refetch: fetchNotifications
  };
};
