import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeductionResult {
  success: boolean;
  message: string;
  balance_before?: number;
  balance_after?: number;
  amount_deducted?: number;
  transaction_hash?: string;
  should_deduct?: boolean;
}

export const useBalanceDeduction = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [animatingBalance, setAnimatingBalance] = useState(false);
  const { toast } = useToast();

  // Check if auto-deduct is enabled
  const checkAutoDeductEnabled = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'auto_deduct_on_withdraw')
        .single();

      if (error) {
        console.error('Error checking auto-deduct setting:', error);
        return false;
      }

      return (data?.setting_value as any)?.enabled || false;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  }, []);

  // Process withdrawal deduction
  const processWithdrawalDeduction = useCallback(async (amount: number): Promise<DeductionResult> => {
    setIsProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, message: 'Not authenticated' };
      }

      const { data, error } = await supabase.rpc('process_withdrawal_deduction', {
        _user_id: session.user.id,
        _amount: amount
      });

      if (error) {
        console.error('Deduction error:', error);
        return { success: false, message: error.message };
      }

      const result = data as unknown as DeductionResult;
      
      if (result.success) {
        // Trigger balance animation
        setAnimatingBalance(true);
        setTimeout(() => setAnimatingBalance(false), 2000);

        // Dispatch event for dashboard to update
        window.dispatchEvent(new CustomEvent('balanceUpdated', { 
          detail: result.balance_after 
        }));

        toast({
          title: "Amount Reserved",
          description: `₦${amount.toLocaleString()} reserved for withdrawal processing`,
        });
      }

      return result;
    } catch (error: any) {
      console.error('Deduction error:', error);
      return { success: false, message: error.message || 'Deduction failed' };
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  // Animate balance change (for UI effects)
  const animateBalanceChange = useCallback((
    fromBalance: number, 
    toBalance: number, 
    duration: number = 1500,
    onUpdate: (value: number) => void
  ) => {
    const startTime = Date.now();
    const difference = toBalance - fromBalance;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(fromBalance + (difference * easeOutCubic));
      
      onUpdate(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Generate unique session key for preventing double-clicks
  const generateSessionKey = useCallback((amount: number): string => {
    return `wd_${amount}_${Date.now()}`;
  }, []);

  // Check if action was already performed in this session
  const checkSessionLock = useCallback((key: string): boolean => {
    const locks = JSON.parse(sessionStorage.getItem('deduction_locks') || '{}');
    return locks[key] === true;
  }, []);

  // Set session lock
  const setSessionLock = useCallback((key: string): void => {
    const locks = JSON.parse(sessionStorage.getItem('deduction_locks') || '{}');
    locks[key] = true;
    sessionStorage.setItem('deduction_locks', JSON.stringify(locks));
  }, []);

  return {
    isProcessing,
    animatingBalance,
    checkAutoDeductEnabled,
    processWithdrawalDeduction,
    animateBalanceChange,
    generateSessionKey,
    checkSessionLock,
    setSessionLock
  };
};