import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Insert subscriber — ignore if email already exists (idempotent)
    const { data, error } = await supabase
      .from("subscribers")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true })
      .select("unsubscribe_token")
      .single();

    if (error) throw error;

    // Send welcome email with unsubscribe link
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${data?.unsubscribe_token}`;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: "You're on the list!",
      html: `
        <p>Thanks for signing up! You'll be the first to know when new pieces drop.</p>
        <p style="margin-top:32px;font-size:12px;color:#999;">
          Don't want these emails?
          <a href="${unsubscribeUrl}">Unsubscribe here</a>.
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
