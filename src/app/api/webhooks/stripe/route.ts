import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as unknown as {
      id: string;
      payment_status: string;
      metadata: { name: string; email: string; trade: string; companyName: string };
    };

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      console.error("NOTIFICATION_EMAIL is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const { name, email, trade, companyName } = session.metadata;

    const { error: dbError } = await supabase.from("waitlist").insert({
      name,
      email,
      trade,
      company_name: companyName,
      stripe_session_id: session.id,
    });

    if (dbError) {
      // If it's a duplicate (idempotency), treat as success
      if (dbError.code === "23505") {
        return NextResponse.json({ received: true });
      }
      console.error("Supabase insert failed:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const safeName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeEmail = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeTrade = trade.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeCompany = companyName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    try {
      await resend.emails.send({
        from: "Frames <onboarding@resend.dev>",
        to: notificationEmail,
        subject: `New Frames waitlist signup: ${safeName} — ${safeCompany}`,
        html: `
          <h2>New Waitlist Signup</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Trade:</strong> ${safeTrade}</p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Stripe Session:</strong> ${session.id}</p>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send notification email:", emailErr);
      // Don't return 500 — Stripe would retry and re-insert
    }
  }

  return NextResponse.json({ received: true });
}
