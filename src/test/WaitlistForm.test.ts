import { describe, it, expect } from "vitest";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  trade: z.string().min(1, "Trade is required."),
  companyName: z.string().min(1, "Company name is required."),
});

describe("WaitlistForm schema", () => {
  it("rejects empty fields", () => {
    const result = schema.safeParse({ name: "", email: "", trade: "", companyName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = schema.safeParse({ name: "Joe", email: "notanemail", trade: "Electrician", companyName: "Acme" });
    expect(result.success).toBe(false);
    const issues = result.error!.issues;
    expect(issues[0].message).toBe("Please enter a valid email address.");
  });

  it("accepts valid input", () => {
    const result = schema.safeParse({
      name: "Joe Smith",
      email: "joe@example.com",
      trade: "Electrician",
      companyName: "Smith Electric",
    });
    expect(result.success).toBe(true);
  });
});
