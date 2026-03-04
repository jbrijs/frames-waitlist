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
    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) {
      console.error("NOTIFICATION_EMAIL is not set");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const session = event.data.object as unknown as {
      id: string;
      metadata: { name: string; email: string; trade: string; companyName: string };
    };

    const { name, email, trade, companyName } = session.metadata;

    const { error: dbError } = await supabase.from("waitlist").insert({
      name,
      email,
      trade,
      company_name: companyName,
      stripe_session_id: session.id,
    });

    if (dbError) {
      console.error("Supabase insert failed:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    await resend.emails.send({
      from: "Frames <onboarding@resend.dev>",
      to: notificationEmail,
      subject: `New Frames waitlist signup: ${name} — ${companyName}`,
      html: `
        <h2>New Waitlist Signup</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Trade:</strong> ${trade}</p>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Stripe Session:</strong> ${session.id}</p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}
