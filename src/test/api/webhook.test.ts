import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

vi.mock("@/lib/resend", () => ({
  resend: {
    emails: {
      send: vi.fn().mockResolvedValue({ id: "email-id" }),
    },
  },
}));

import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { POST } from "@/app/api/webhooks/stripe/route";

const makeRequest = (body: string, signature = "valid-sig") =>
  new Request("http://localhost:3000/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": signature },
    body,
  });

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.NOTIFICATION_EMAIL = "admin@frames.app";
  });

  it("returns 400 when signature verification fails", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(400);
  });

  it("ignores unhandled event types and returns 200", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "payment_intent.created",
      data: { object: {} },
    } as any);
    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
  });

  it("skips insert for unpaid sessions and returns 200", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_unpaid",
          payment_status: "unpaid",
          metadata: {
            name: "Joe Smith",
            email: "joe@example.com",
            trade: "Electrician",
            companyName: "Smith Electric",
          },
        },
      },
    } as any);

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);
    expect(supabase.from).not.toHaveBeenCalled();
    expect(resend.emails.send).not.toHaveBeenCalled();
  });

  it("inserts to supabase and sends email on checkout.session.completed with paid status", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          payment_status: "paid",
          metadata: {
            name: "Joe Smith",
            email: "joe@example.com",
            trade: "Electrician",
            companyName: "Smith Electric",
          },
        },
      },
    } as any);

    const insertMock = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any);

    const res = await POST(makeRequest("{}"));
    expect(res.status).toBe(200);

    expect(supabase.from).toHaveBeenCalledWith("waitlist");
    expect(insertMock).toHaveBeenCalledWith({
      name: "Joe Smith",
      email: "joe@example.com",
      trade: "Electrician",
      company_name: "Smith Electric",
      stripe_session_id: "cs_test_123",
    });

    expect(resend.emails.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "admin@frames.app",
        subject: expect.stringContaining("Joe Smith"),
      }),
    );
  });
});
