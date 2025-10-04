import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Validate account number format (10 digits)
    if (!/^\d{10}$/.test(account_number)) {
      return new Response(
        JSON.stringify({ error: 'Invalid account number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
    
    if (!flutterwaveSecretKey) {
      console.error('FLUTTERWAVE_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Bank verification service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Flutterwave account verification API
    const verifyResponse = await fetch('https://api.flutterwave.com/v3/accounts/resolve', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_number,
        account_bank: bank_code
      })
    });

    const verifyData = await verifyResponse.json();
    console.log('Flutterwave response:', verifyData);

    if (verifyData.status === 'success' && verifyData.data) {
      return new Response(
        JSON.stringify({
          success: true,
          account_name: verifyData.data.account_name,
          account_number: verifyData.data.account_number
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: verifyData.message || 'Could not verify account'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in verify-bank function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Could not verify account' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
