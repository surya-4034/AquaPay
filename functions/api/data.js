// Cloudflare Pages Function: /api/data
// Handles GET, POST, and OPTIONS requests for AquaPay
// Uses Cloudflare KV binding named AQUAPAY_KV or AQUAPAY_DB

export async function onRequestGet(context) {
  const { env } = context;
  const kv = env.AQUAPAY_KV || env.AQUAPAY_DB;
  
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store, no-cache, must-revalidate"
  };

  if (!kv) {
    // If KV is not yet bound in Cloudflare dashboard, return a helpful notice
    return new Response(JSON.stringify({
      error: "Cloudflare KV binding not found. Please bind 'AQUAPAY_KV' in Cloudflare Pages Settings -> Functions -> KV namespace bindings.",
      offline: true,
      houses: []
    }), { status: 200, headers });
  }

  try {
    const data = await kv.get("database", "json");
    if (!data) {
      const initialDb = {
        settings: {
          systemTitle: "AquaPay",
          societyName: "AquaPay",
          collectorName: "Manager",
          defaultMonthlyBill: 250,
          currency: "₹"
        },
        houses: [],
        collections: []
      };
      await kv.put("database", JSON.stringify(initialDb));
      return new Response(JSON.stringify(initialDb), { status: 200, headers });
    }
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, houses: [] }), { status: 500, headers });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const kv = env.AQUAPAY_KV || env.AQUAPAY_DB;
  
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  if (!kv) {
    return new Response(JSON.stringify({
      error: "Cloudflare KV binding not found. Please bind 'AQUAPAY_KV' in Cloudflare Pages Settings -> Functions -> KV namespace bindings."
    }), { status: 503, headers });
  }

  try {
    const payload = await request.json();
    if (!payload || !Array.isArray(payload.houses)) {
      return new Response(JSON.stringify({ error: "Invalid payload: 'houses' array is required." }), { status: 400, headers });
    }

    // Save active database to Cloudflare KV
    await kv.put("database", JSON.stringify(payload));
    
    // Save rolling backup with 30-day expiration
    const backupKey = `backup_${Date.now()}`;
    await kv.put(backupKey, JSON.stringify(payload), { expirationTtl: 86400 * 30 });

    return new Response(JSON.stringify({
      success: true,
      message: "Data successfully synced and saved in Cloudflare KV",
      housesCount: payload.houses.length,
      savedAt: new Date().toISOString()
    }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
