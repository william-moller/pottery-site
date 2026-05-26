import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminClient } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const RESERVATION_MINUTES = 10;

export async function POST(req: NextRequest) {
  const supabase = getAdminClient();
  try {
    const { items } = await req.json();
    // items: Array<{ sanityId: string; name: string; priceCents: number; image: string }>

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const reservedUntil = new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000).toISOString();
    const sessionId = crypto.randomUUID();

    // Attempt to reserve each item — fails if any are already reserved or sold
    for (const item of items) {
      const { data: product, error } = await supabase
        .from("products")
        .select("status, reserved_until")
        .eq("sanity_id", item.sanityId)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
      }

      const isAvailable =
        product.status === "available" ||
        (product.status === "reserved" &&
          product.reserved_until &&
          new Date(product.reserved_until) < new Date());

      if (!isAvailable) {
        return NextResponse.json(
          { error: `"${item.name}" was just claimed by someone else. Try again shortly.` },
          { status: 409 }
        );
      }

      // Reserve the item
      await supabase
        .from("products")
        .update({ status: "reserved", reserved_until: reservedUntil, session_id: sessionId })
        .eq("sanity_id", item.sanityId);
    }

    // Build Stripe line items
    const lineItems = items.map((item: { name: string; priceCents: number; image: string }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.priceCents,
      },
      quantity: 1,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1200, currency: "usd" }, // $12 flat rate
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 10 },
            },
          },
        },
      ],
      automatic_tax: { enabled: true }, // Stripe Tax
      metadata: {
        session_id: sessionId,
        item_ids: items.map((i: { sanityId: string }) => i.sanityId).join(","),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
