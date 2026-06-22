import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

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

async function hmacHex(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST")
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers });
  if (!(req.headers.get("content-type") || "").includes("application/json"))
    return new Response(JSON.stringify({ error: "bad_content_type" }), { status: 415, headers });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_json" }), { status: 400, headers });
  }

  const { ticket_ref, phone } = body || {};
  if (!ticket_ref || !phone)
    return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400, headers });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
  );
  const secret = Deno.env.get("QR_HMAC_SECRET");
  if (!secret)
    return new Response(JSON.stringify({ error: "server_misconfigured" }), { status: 500, headers });

  // Validate ticket: exists, active, phone matches
  const { data: ticket, error: tErr } = await supabase
    .from("tickets")
    .select("id, holder_phone, is_active, seat, zone")
    .eq("ticket_ref", ticket_ref)
    .single();

  if (tErr || !ticket || !ticket.is_active || ticket.holder_phone !== phone) {
    // Single generic failure — don't reveal which check failed
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 403, headers });
  }

  const now = Date.now();
  const window_start = Math.floor(now / WINDOW_MS) * WINDOW_MS;
  const expires_in_ms = window_start + WINDOW_MS - now;

  // Idempotent: return existing token for this ticket+window if present
  const { data: existing } = await supabase
    .from("qr_tokens")
    .select("token")
    .eq("ticket_id", ticket.id)
    .eq("window_start", window_start)
    .maybeSingle();

  if (existing) {
    return new Response(
      JSON.stringify({ token: existing.token, window_start, expires_in_ms }),
      { headers },
    );
  }

  const token = await hmacHex(`${ticket_ref}:${window_start}`, secret);

  const { error: insErr } = await supabase
    .from("qr_tokens")
    .insert({ ticket_id: ticket.id, token, window_start });

  // If a concurrent request inserted first, the unique index rejects us.
  // Re-read and return the winner's token instead of erroring.
  if (insErr) {
    const { data: raced } = await supabase
      .from("qr_tokens")
      .select("token")
      .eq("ticket_id", ticket.id)
      .eq("window_start", window_start)
      .maybeSingle();
    if (raced)
      return new Response(
        JSON.stringify({ token: raced.token, window_start, expires_in_ms }),
        { headers },
      );
    return new Response(JSON.stringify({ error: "insert_failed" }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ token, window_start, expires_in_ms }), { headers });
});