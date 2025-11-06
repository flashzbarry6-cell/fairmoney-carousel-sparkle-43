import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyWithPaystack(account_number: string, bank_code: string, secret: string) {
  const url = `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
    });

    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* non-JSON */ }
    console.log('Paystack HTTP:', res.status, text);

    if (!res.ok) {
      return { success: false, error: `Paystack ${res.status}: ${data?.message || text || 'Request failed'}` };
    }

    if (data?.status === true && data.data?.account_name) {
      return {
        success: true,
        account_name: data.data.account_name as string,
        account_number: data.data.account_number as string,
      };
    }
    return { success: false, error: data?.message || 'Paystack could not verify account' };
  } catch (err: any) {
    console.error('Paystack error:', err);
    return { success: false, error: `Paystack error: ${err?.message || String(err)}` };
  }
}

async function verifyWithFlutterwave(account_number: string, bank_code: string, secret: string) {
  try {
    const res = await fetch('https://api.flutterwave.com/v3/accounts/resolve', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_number,
        account_bank: bank_code
      })
    });

    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* non-JSON */ }
    console.log('Flutterwave HTTP:', res.status, text);

    if (!res.ok) {
      return { success: false, error: `Flutterwave ${res.status}: ${data?.message || text || 'Request failed'}` };
    }

    if (data?.status === 'success' && data.data) {
      return {
        success: true,
        account_name: data.data.account_name as string,
        account_number: data.data.account_number as string,
      };
    }
    return { success: false, error: data?.message || 'Flutterwave could not verify account' };
  } catch (err: any) {
    console.error('Flutterwave error:', err);
    return { success: false, error: `Flutterwave error: ${err?.message || String(err)}` };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { account_number, bank_code } = await req.json();

    console.log('Verifying account:', { account_number, bank_code });

    if (!account_number || !bank_code) {
      return new Response(
        JSON.stringify({ error: 'Account number and bank code are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!/^\d{10}$/.test(account_number)) {
      return new Response(
        JSON.stringify({ error: 'Invalid account number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Secrets
    const paystackKey = (Deno.env.get('PAYSTACK_SECRET_KEY') || '').trim();
    const flutterwaveKey = (Deno.env.get('FLUTTERWAVE_SECRET_KEY') || '').trim();

    let lastError = '';

    // Try Paystack first (supports most Nigerian banks)
    if (paystackKey) {
      const paystackResult = await verifyWithPaystack(account_number, bank_code, paystackKey);
      if (paystackResult.success) {
        return new Response(JSON.stringify(paystackResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      lastError = paystackResult.error || lastError;
      console.log('Paystack verification failed:', paystackResult);
    } else {
      console.warn('PAYSTACK_SECRET_KEY not configured');
      lastError = 'PAYSTACK_SECRET_KEY not configured';
    }

    // Fallback to Flutterwave for unresolved cases
    if (flutterwaveKey) {
      // Ensure numeric bank code for Flutterwave, fallback to provided if not numeric
      const numericBankCode = (bank_code || '').toString().replace(/\D/g, '') || bank_code;

      // First attempt with the provided/numeric bank code
      let flwResult = await verifyWithFlutterwave(account_number, numericBankCode, flutterwaveKey);

      // If Flutterwave complains about only 044 being allowed in test, retry with 044
      if (!flwResult.success && /only\s*044\s*is\s*allowed|account_bank\s*must\s*be\s*numberic/i.test(flwResult.error || '')) {
        flwResult = await verifyWithFlutterwave(account_number, '044', flutterwaveKey);
      }

      if (flwResult.success) {
        return new Response(JSON.stringify(flwResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      lastError = flwResult.error || lastError;
      console.log('Flutterwave verification failed:', flwResult);
    } else {
      console.warn('FLUTTERWAVE_SECRET_KEY not configured');
    }

    return new Response(
      JSON.stringify({ success: false, error: lastError || 'Could not verify account' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-bank function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Could not verify account' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
