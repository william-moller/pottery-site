import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { getAdminClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const supabase = getAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const itemIds = (session.metadata?.item_ids ?? "").split(",").filter(Boolean);
    const sessionId = session.metadata?.session_id;

    // 1. Mark items as sold
    if (itemIds.length) {
      await supabase
        .from("products")
        .update({ status: "sold", reserved_until: null, session_id: null })
        .in("sanity_id", itemIds);
    }

    // 2. Save order record
    await supabase.from("orders").insert({
      stripe_session: session.id,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      items: itemIds,
      total_cents: session.amount_total,
      status: "paid",
      shipping_addr: session.shipping_details,
    });

    // 3. Send buyer confirmation email
    if (session.customer_details?.email) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: session.customer_details.email,
        subject: "Order confirmed — thank you!",
        html: `
          <p>Hi ${session.customer_details.name ?? "there"},</p>
          <p>Your order has been confirmed. We'll send another email when it ships.</p>
          <p>Thank you for supporting handmade pottery.</p>
        `,
      });
    }

    // 4. Notify seller
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.RESEND_SELLER_EMAIL!,
      subject: `New order — $${((session.amount_total ?? 0) / 100).toFixed(2)}`,
      html: `
        <h2>New order received</h2>
        <p><strong>Customer:</strong> ${session.customer_details?.name} (${session.customer_details?.email})</p>
        <p><strong>Total:</strong> $${((session.amount_total ?? 0) / 100).toFixed(2)}</p>
        <p><strong>Ship to:</strong><br/>
          ${session.shipping_details?.address?.line1}<br/>
          ${session.shipping_details?.address?.city}, ${session.shipping_details?.address?.state} ${session.shipping_details?.address?.postal_code}
        </p>
        <p><strong>Items (Sanity IDs):</strong> ${itemIds.join(", ")}</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders">View orders dashboard</a></p>
      `,
    });

    void sessionId; // reserved for future use
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.metadata?.session_id;

    if (sessionId) {
      await supabase
        .from("products")
        .update({ status: "available", reserved_until: null, session_id: null })
        .eq("session_id", sessionId)
        .eq("status", "reserved");
    }
  }

  return NextResponse.json({ received: true });
}
