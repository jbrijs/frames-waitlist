import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { name, email, trade, companyName } = await req.json();

  if (!name?.trim() || !email?.trim() || !trade?.trim() || !companyName?.trim()) {
    return NextResponse.json(
      { error: "Name, email, trade, and company name are required." },
      { status: 400 },
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Frames Early Access — Refundable Deposit",
              description:
                "Secures your spot for Frames early access and preferred pricing. Fully refundable if Frames isn't a fit.",
            },
            unit_amount: 100000, // $1,000.00
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: { name, email, trade, companyName },
      success_url: `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout session. Please try again." },
      { status: 500 },
    );
  }

  if (!session.url) {
    return NextResponse.json(
      { error: "No checkout URL returned from Stripe." },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url });
}
