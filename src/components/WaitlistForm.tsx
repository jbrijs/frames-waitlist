"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(1, "Full name is required."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  trade: z.string().min(1, "Trade is required."),
  companyName: z.string().min(1, "Company name is required."),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const TRADE_OPTIONS = [
  "Electrician",
  "Plumber",
  "HVAC",
  "Superintendent",
  "General Contractor",
  "Other",
];

export function WaitlistForm() {
  const [form, setForm] = useState({ name: "", email: "", trade: "", companyName: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const result = schema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (!errors[field]) errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong.");
      }

      const { url } = await res.json();
      if (!url) {
        setServerError("No redirect URL received. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = url;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="bg-white border-gray-200"
          disabled={loading}
        />
        {fieldErrors.name && <p role="alert" className="text-xs text-red-600">{fieldErrors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="bg-white border-gray-200"
          disabled={loading}
        />
        {fieldErrors.email && <p role="alert" className="text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="trade" className="text-sm font-medium text-gray-700">Trade / Role</Label>
        <Select
          value={form.trade}
          onValueChange={(v) => setForm((f) => ({ ...f, trade: v }))}
          disabled={loading}
        >
          <SelectTrigger id="trade" className="bg-white border-gray-200">
            <SelectValue placeholder="Select your trade" />
          </SelectTrigger>
          <SelectContent>
            {TRADE_OPTIONS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.trade && <p role="alert" className="text-xs text-red-600">{fieldErrors.trade}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Company Name"
          value={form.companyName}
          onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
          className="bg-white border-gray-200"
          disabled={loading}
        />
        {fieldErrors.companyName && <p role="alert" className="text-xs text-red-600">{fieldErrors.companyName}</p>}
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-600 font-medium">{serverError}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-sm font-semibold rounded-lg text-white"
        style={{ backgroundColor: loading ? "#E79C5F" : "#CA6B1E" }}
      >
        {loading ? "Redirecting to checkout..." : "Reserve My Spot — $1,000 →"}
      </Button>

      <p className="text-center text-xs text-gray-400">
        $1,000 deposit is fully refundable if Frames isn&apos;t a fit.
      </p>
    </form>
  );
}
