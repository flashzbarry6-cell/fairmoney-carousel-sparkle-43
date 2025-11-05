import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifyWithPaystack(account_number: string, bank_code: string, secret: string) {
  const url = `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
  });
  const data = await res.json();
  console.log('Paystack response:', data);
  if (data.status === true && data.data?.account_name) {
    return {
      success: true,
      account_name: data.data.account_name as string,
      account_number: data.data.account_number as string,
    };
  }
  return { success: false, error: data.message || 'Could not verify account' };
}

async function verifyWithFlutterwave(account_number: string, bank_code: string, secret: string) {
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

  const data = await res.json();
  console.log('Flutterwave response:', data);

  if (data.status === 'success' && data.data) {
    return {
      success: true,
      account_name: data.data.account_name as string,
      account_number: data.data.account_number as string,
    };
  }
  return { success: false, error: data.message || 'Could not verify account' };
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

    // Try Paystack first (supports most Nigerian banks)
    if (paystackKey) {
      const paystackResult = await verifyWithPaystack(account_number, bank_code, paystackKey);
      if (paystackResult.success) {
        return new Response(JSON.stringify(paystackResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log('Paystack verification failed:', paystackResult);
    } else {
      console.warn('PAYSTACK_SECRET_KEY not configured');
    }

    // Fallback to Flutterwave for specific banks (e.g., Access - 044)
    if (flutterwaveKey && bank_code === '044') {
      const flwResult = await verifyWithFlutterwave(account_number, bank_code, flutterwaveKey);
      if (flwResult.success) {
        return new Response(JSON.stringify(flwResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.log('Flutterwave verification failed:', flwResult);
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Could not verify account' }),
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
