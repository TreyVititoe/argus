import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServer } from "@/lib/supabase/server";

const FEEDBACK_TO = process.env.FEEDBACK_TO_EMAIL || "support@argus.bz";
const FEEDBACK_FROM = process.env.FEEDBACK_FROM_EMAIL || "Argus Feedback <feedback@argus.bz>";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Feedback is not configured on this server" },
      { status: 503 }
    );
  }

  let body: { message?: string; subject?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  const subject = (body.subject || "").trim() || "Argus feedback";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 8000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data } = await supabase.auth.getUser();
  const fromEmail = data.user?.email || "anonymous@argus.bz";

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FEEDBACK_FROM,
    to: FEEDBACK_TO,
    replyTo: fromEmail,
    subject: `[Argus] ${subject}`,
    text: `From: ${fromEmail}\n\n${message}`,
  });

  if (error) {
    // Surface Resend's own message (e.g. "The argus.bz domain is not
    // verified") so we can fix configuration issues from the UI without
    // grepping Vercel logs.
    const detail = (error as { message?: string })?.message ?? String(error);
    console.error("Resend send failed:", error);
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

// GET /api/feedback acts as a config health check. Returns 200 with the
// current FROM/TO and Resend reachability, or 503 with the missing piece.
// Used to diagnose "Feedback is not configured" without running curl.
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, missing: ["RESEND_API_KEY"], from: FEEDBACK_FROM, to: FEEDBACK_TO },
      { status: 503 }
    );
  }
  return NextResponse.json({
    ok: true,
    from: FEEDBACK_FROM,
    to: FEEDBACK_TO,
  });
}
