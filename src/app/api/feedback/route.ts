import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseServer } from "@/lib/supabase/server";

const FEEDBACK_TO = process.env.FEEDBACK_TO_EMAIL || "me@treyvititoe.com";
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
    return NextResponse.json({ error: "Email failed to send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
