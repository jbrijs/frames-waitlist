import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn(),
      },
    },
  },
}));

import { stripe } from "@/lib/stripe";
import { POST } from "@/app/api/checkout/route";

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_URL = "http://localhost:3000";
  });

  it("returns 400 when required fields are missing", async () => {
    const req = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      body: JSON.stringify({ name: "", email: "", trade: "", companyName: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("creates a stripe checkout session and returns url", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockResolvedValue({
      url: "https://checkout.stripe.com/test",
    } as any);

    const req = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        name: "Joe Smith",
        email: "joe@example.com",
        trade: "Electrician",
        companyName: "Smith Electric",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe("https://checkout.stripe.com/test");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: {
          name: "Joe Smith",
          email: "joe@example.com",
          trade: "Electrician",
          companyName: "Smith Electric",
        },
      }),
    );
  });

  it("returns 500 when stripe throws", async () => {
    vi.mocked(stripe.checkout.sessions.create).mockRejectedValue(new Error("Stripe error"));

    const req = new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        name: "Joe Smith",
        email: "joe@example.com",
        trade: "Electrician",
        companyName: "Smith Electric",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
