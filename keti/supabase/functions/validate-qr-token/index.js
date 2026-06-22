import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://YOUR-APP.vercel.app", // <-- replace with your real Vercel domain
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const WINDOW_MS = 30000;
const GRACE_MS = 10000; // re-scan of an already-validated token within 10s = still valid

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ valid: false, reason: "invalid" }), { status: 405, headers });
  if (!(req.headers.get("content-type") || "").includes("application/json"))
    return new Response(JSON.stringify({ valid: false, reason: "invalid" }), { status: 415, headers });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ valid: false, reason: "invalid" }), { status: 400, headers });
  }

  const { token } = body || {};
  if (!token)
    return new Response(JSON.stringify({ valid: false, reason: "invalid" }), { status: 400, headers });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  );

  const { data: row } = await supabase
    .from("qr_tokens")
    .select("id, ticket_id, window_start, used, validated_at")
    .eq("token", token)
    .maybeSingle();

  // Generic failure for every reject path (don't leak which check failed)
  const reject = () =>
    new Response(JSON.stringify({ valid: false, reason: "invalid" }), { headers });

  if (!row) return reject();

  // Server-side staleness check — never trust a client timestamp.
  // Recompute against THIS server's clock.
  const now = Date.now();
  const stale = now - row.window_start > WINDOW_MS;
  if (stale) return reject();

  // Gate-grace: if already validated but very recently, accept again
  // (handles lost-response re-scan / brief re-entry without false reject).
  if (row.used) {
    const validatedAt = row.validated_at ? new Date(row.validated_at).getTime() : 0;
    if (now - validatedAt > GRACE_MS) return reject();
    // within grace — fall through and return valid without re-marking
  } else {
    // First validation: mark used. Conditional update guards against a
    // double-spend race (two gates scanning simultaneously).
    const { data: updated } = await supabase
      .from("qr_tokens")
      .update({ used: true, validated_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("used", false)
      .select("id");
    if (!updated || updated.length === 0) {
      // Someone marked it used between our read and write. Re-check grace.
      const { data: recheck } = await supabase
        .from("qr_tokens")
        .select("validated_at")
        .eq("id", row.id)
        .maybeSingle();
      const vAt = recheck?.validated_at ? new Date(recheck.validated_at).getTime() : 0;
      if (now - vAt > GRACE_MS) return reject();
    }
  }

  const { data: ticket } = await supabase
    .from("tickets")
    .select("ticket_ref, seat, zone, holder_phone")
    .eq("id", row.ticket_id)
    .single();

  if (!ticket) return reject();

  return new Response(
    JSON.stringify({
      valid: true,
      ticket_ref: ticket.ticket_ref,
      seat: ticket.seat,
      zone: ticket.zone,
      holder_phone: ticket.holder_phone,
    }),
    { headers },
  );
});