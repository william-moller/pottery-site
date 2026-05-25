import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token." }, { status: 400 });
    }

    const { error } = await supabase
      .from("subscribers")
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", token)
      .is("unsubscribed_at", null); // only update if not already unsubscribed

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[unsubscribe]", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
