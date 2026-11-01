// Cloudflare Pages Function: /api/health
export async function onRequestGet(context) {
  const kv = context.env.AQUAPAY_KV || context.env.AQUAPAY_DB;
  return new Response(JSON.stringify({
    status: "ok",
    app: "AquaPay",
    platform: "Cloudflare Pages",
    kvConfigured: !!kv,
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
