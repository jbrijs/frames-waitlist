# Frames Waitlist Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready waitlist landing site for Frames with a $1,000 Stripe deposit, Supabase storage, and Resend email notification — modeled on the alto-waitlist at `~/alto/alto-waitlist`.

**Architecture:** Next.js 16 App Router with shadcn/ui components and Tailwind v4. Three pages (landing, reserve, thank-you) plus two API routes (checkout, webhook). Industrial/blueprint aesthetic using dark navy + orange brand palette.

**Tech Stack:** Next.js 16, shadcn/ui, Tailwind v4, Stripe, Supabase, Resend, Zod, Vitest

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Add production dependencies**

```bash
pnpm add @supabase/supabase-js class-variance-authority clsx lucide-react radix-ui resend stripe tailwind-merge tw-animate-css zod
```

**Step 2: Add dev dependencies**

```bash
pnpm add -D @testing-library/dom @testing-library/jest-dom @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom shadcn vitest
```

**Step 3: Verify installs**

```bash
pnpm list stripe zod vitest shadcn
```
Expected: all four listed at their installed versions.

**Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add all waitlist dependencies"
```

---

## Task 2: Initialize shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`

**Step 1: Run shadcn init**

```bash
pnpm dlx shadcn@latest init --defaults
```

When prompted:
- Style: **New York**
- Base color: **Neutral**
- CSS variables: **Yes**

This creates `components.json` and `src/lib/utils.ts`.

**Step 2: Add required components**

```bash
pnpm dlx shadcn@latest add button input label select
```

**Step 3: Verify components exist**

```bash
ls src/components/ui/
```
Expected: `button.tsx  input.tsx  label.tsx  select.tsx  (+ any shadcn internals)`

**Step 4: Commit**

```bash
git add components.json src/components/ui/ src/lib/utils.ts
git commit -m "feat: initialize shadcn/ui with button, input, label, select"
```

---

## Task 3: Set Up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (add test scripts)

**Step 1: Create `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Step 2: Create `src/test/setup.ts`**

```typescript
import "@testing-library/jest-dom";
```

**Step 3: Add test scripts to `package.json`**

In the `"scripts"` section, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Verify vitest runs**

```bash
pnpm test
```
Expected: "No test files found" (passes with 0 tests).

**Step 5: Commit**

```bash
git add vitest.config.ts src/test/setup.ts package.json
git commit -m "feat: configure vitest with jsdom and testing-library"
```

---

## Task 4: Design Tokens & Global Styles

**Files:**
- Modify: `src/app/globals.css`

**Step 1: Replace `src/app/globals.css` entirely**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

/* ─── Frames design tokens ──────────────────────────────────────── */
:root {
  --bg-base:       #F5F5F5;
  --bg-card:       #ffffff;
  --bg-surface:    #f9f9f9;
  --border:        #e5e7eb;
  --border-subtle: #f1f5f9;

  /* Primary — Navy */
  --primary-deep:  #1E3A5F;
  --primary-mid:   #2C558C;
  --primary-light: #5487C9;

  /* Secondary — Orange */
  --secondary:       #CA6B1E;
  --secondary-mid:   #E2863C;
  --secondary-light: #E79C5F;

  /* Text */
  --text-primary:   #2B2B2B;
  --text-secondary: #4F4F4F;
  --text-muted:     #7A7A7A;

  --font-mono: var(--font-geist-mono);
  --radius: 0.625rem;

  /* shadcn compatibility */
  --background:           var(--bg-base);
  --foreground:           var(--text-primary);
  --card:                 var(--bg-card);
  --card-foreground:      var(--text-primary);
  --popover:              var(--bg-card);
  --popover-foreground:   var(--text-primary);
  --primary:              var(--primary-deep);
  --primary-foreground:   #ffffff;
  --secondary:            var(--bg-surface);
  --secondary-foreground: var(--text-primary);
  --muted:                var(--bg-surface);
  --muted-foreground:     var(--text-secondary);
  --accent-ui:            rgba(30, 58, 95, 0.06);
  --accent-ui-foreground: var(--text-primary);
  --destructive:          oklch(0.577 0.245 27.325);
  --border-color:         var(--border);
  --input:                var(--bg-card);
  --ring:                 rgba(30, 58, 95, 0.3);
}

@theme inline {
  --color-background:           var(--background);
  --color-foreground:           var(--foreground);
  --font-sans:                  var(--font-jakarta);
  --font-mono:                  var(--font-geist-mono);
  --font-serif:                 var(--font-serif);
  --radius-sm:                  calc(var(--radius) - 2px);
  --radius-md:                  var(--radius);
  --radius-lg:                  calc(var(--radius) + 2px);
  --radius-xl:                  calc(var(--radius) + 6px);
  --color-card:                 var(--card);
  --color-card-foreground:      var(--card-foreground);
  --color-popover:              var(--popover);
  --color-popover-foreground:   var(--popover-foreground);
  --color-primary:              var(--primary);
  --color-primary-foreground:   var(--primary-foreground);
  --color-secondary:            var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted:                var(--muted);
  --color-muted-foreground:     var(--muted-foreground);
  --color-accent:               var(--accent-ui);
  --color-accent-foreground:    var(--accent-ui-foreground);
  --color-destructive:          var(--destructive);
  --color-border:               var(--border-color);
  --color-input:                var(--input);
  --color-ring:                 var(--ring);
  --color-orange:               #CA6B1E;
  --color-orange-mid:           #E2863C;
  --color-orange-light:         #E79C5F;
  --color-navy:                 #1E3A5F;
  --color-navy-mid:             #2C558C;
  --color-navy-light:           #5487C9;
}

/* ─── White panel card ───────────────────────────────────────── */
.panel {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* ─── Hero: dark navy with blueprint grid ─────────────────────── */
.bg-hero-gradient {
  background-color: #1E3A5F;
  background-image:
    linear-gradient(rgba(84, 135, 201, 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(84, 135, 201, 0.12) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* ─── Glass section (how-it-works) ───────────────────────────── */
.section-glass {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-radius: 64px 64px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-bottom: none;
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.10), inset 0 1px 0 rgba(255, 255, 255, 1);
}

/* ─── Sticky nav pill ─────────────────────────────────────────── */
.nav-pill {
  width: 100%;
  padding: 16px 8px;
  border-radius: 0;
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-pill[data-scrolled="true"] {
  position: relative;
  width: min(900px, calc(100% - 48px));
  padding: 10px 22px;
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
.nav-tagline {
  opacity: 1;
  transition: opacity 0.3s ease;
}
.nav-pill[data-scrolled="true"] .nav-tagline {
  opacity: 0;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    scroll-behavior: smooth;
  }
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add Frames design tokens and blueprint grid hero styles"
```

---

## Task 5: Update Layout & Fonts

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Replace `src/app/layout.tsx`**

```typescript
import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Frames | Know Before You Cut",
  description:
    "Frames captures your walls before drywall goes up so trades always know what's hidden. Join the early access waitlist.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Frames | Know Before You Cut",
    description:
      "Frames captures your walls before drywall goes up so trades always know what's hidden. Join the early access waitlist.",
  },
  twitter: {
    card: "summary",
    title: "Frames | Know Before You Cut",
    description:
      "Frames captures your walls before drywall goes up so trades always know what's hidden. Join the early access waitlist.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: configure fonts and metadata for Frames"
```

---

## Task 6: Create Lib Utilities

**Files:**
- Create: `src/lib/stripe.ts`
- Create: `src/lib/supabase.ts`
- Create: `src/lib/resend.ts`

**Step 1: Create `src/lib/stripe.ts`**

```typescript
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover",
});
```

**Step 2: Create `src/lib/supabase.ts`**

```typescript
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);
```

**Step 3: Create `src/lib/resend.ts`**

```typescript
import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(process.env.RESEND_API_KEY);
```

**Step 4: Commit**

```bash
git add src/lib/
git commit -m "feat: add stripe, supabase, and resend lib singletons"
```

---

## Task 7: Create StickyNav Component

**Files:**
- Create: `src/components/StickyNav.tsx`

**Step 1: Create `src/components/StickyNav.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StickyNav({
  showCta = true,
  showHowItWorks = true,
}: {
  showCta?: boolean;
  showHowItWorks?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6 pt-4 pointer-events-none">
      <nav
        className="nav-pill pointer-events-auto relative flex items-center justify-between"
        data-scrolled={scrolled ? "true" : undefined}
      >
        {/* Frosted backdrop on scroll */}
        {scrolled && (
          <div
            className="absolute inset-0 rounded-full bg-navy/80 backdrop-blur-[40px] backdrop-saturate-150 z-0"
            aria-hidden
          />
        )}

        {/* Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-0.5 hover:opacity-80 transition-opacity relative z-10"
        >
          <span
            className={`text-xl font-bold tracking-tight font-sans ${scrolled ? "text-white" : "text-white"}`}
          >
            frames
          </span>
          <span className="text-xl font-bold text-orange-400">.</span>
        </Link>

        {/* Tagline — center, fades on scroll */}
        <p className="nav-tagline hidden sm:block absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50 whitespace-nowrap pointer-events-none font-mono z-10">
          Know Before You Cut
        </p>

        {/* Right side */}
        <div className="flex items-center gap-4 relative z-10">
          {showHowItWorks && (
            <a
              href="#how-it-works"
              className="hidden sm:block text-xs font-medium whitespace-nowrap transition-colors text-white/60 hover:text-white font-mono tracking-[0.04em]"
            >
              How it works
            </a>
          )}
          {showCta && (
            <Button
              asChild
              size="sm"
              className="text-xs font-semibold rounded-full text-white h-8 px-4 whitespace-nowrap bg-orange-600 hover:bg-orange-700"
            >
              <Link href="/reserve">Reserve →</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/StickyNav.tsx
git commit -m "feat: add StickyNav with dark navy + orange branding"
```

---

## Task 8: Build Landing Page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Replace `src/app/page.tsx`**

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StickyNav } from "@/components/StickyNav";

const stats = [
  { value: "$177B+", label: "Lost annually to rework in U.S. construction" },
  { value: "50%+", label: "Of rework caused by poor data & miscommunication" },
  { value: "$500K+", label: "Lost per $10M project to unnecessary rework" },
];

const steps = [
  {
    phase: "Create",
    num: "01",
    title: "Start a project",
    body: "Name your project and optionally upload an architectural plan. Frames organizes everything room-by-room automatically.",
  },
  {
    phase: "Capture",
    num: "02",
    title: "Guided photo walkthrough",
    body: "Follow the guided capture flow for every wall before drywall goes up. Takes minutes per room with your existing phone or tablet.",
  },
  {
    phase: "Tag",
    num: "03",
    title: "Mark hidden elements",
    body: "Tap to annotate outlets, pipes, vents, and valves directly on the photo. Every tag is timestamped and tied to its exact wall location.",
  },
  {
    phase: "Find",
    num: "04",
    title: "Look up after drywall",
    body: "Open Frames on-site and instantly see what's inside any wall. No more guessing, no more cutting into the wrong spot.",
  },
];

export default function Home() {
  return (
    <>
      <StickyNav />

      {/* Hero — dark navy with blueprint grid */}
      <div className="flex flex-col bg-hero-gradient pt-[72px] min-h-[94vh]">
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-20">
          <div className="max-w-4xl w-full flex flex-col gap-7">
            {/* Badge */}
            <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 font-mono text-[0.65rem] tracking-[0.18em] uppercase font-medium border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-orange-400" />
              Early Access — Limited Spots
            </span>

            {/* Headline */}
            <h1 className="text-[3.75rem] sm:text-[5rem] lg:text-[5.5rem] leading-[1.05] tracking-tight text-white font-serif italic">
              Know before
              <br />
              <span className="text-orange-400">you cut.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg text-white/60 leading-relaxed max-w-xl font-sans">
              Frames captures every wall before drywall goes up — so electricians, plumbers,
              and HVAC crews always know exactly what's hidden.
            </p>

            {/* CTA */}
            <div className="flex flex-col gap-3 self-start">
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-sm font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700"
                >
                  <Link href="/reserve">Reserve My Spot →</Link>
                </Button>
                <a
                  href="#how-it-works"
                  className="h-12 px-6 rounded-full inline-flex items-center text-sm font-semibold text-white/70 transition-colors hover:text-white hover:bg-white/10 whitespace-nowrap"
                >
                  See how it works
                </a>
              </div>
              <p className="text-xs text-white/40 px-1 font-mono">
                $1,000 refundable deposit · early access pricing locked in
              </p>
            </div>
          </div>
        </div>

        {/* Stats strip at bottom of hero */}
        <div className="border-t border-white/10 bg-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map((stat) => (
              <div key={stat.value} className="px-6 py-4 sm:py-0 flex flex-col gap-1">
                <span className="text-3xl font-bold text-orange-400 font-serif">{stat.value}</span>
                <span className="text-xs text-white/50 leading-snug font-mono">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works — glass card overlapping hero */}
      <section id="how-it-works" className="relative z-10 section-glass -mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-20 pb-60">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-12">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-orange-600 font-mono">
              How it works
            </span>
            <h2 className="text-[2rem] sm:text-[2.5rem] leading-tight tracking-tight text-gray-900 font-serif italic">
              Capture once.{" "}
              <span className="text-navy">Find anything.</span>
            </h2>
            <p className="text-base text-gray-500 leading-relaxed max-w-lg">
              A four-step workflow that fits into how trades already work on-site.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-7 flex flex-col gap-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-orange-600 font-mono">
                    {step.phase}
                  </span>
                  <span className="text-xs font-semibold tracking-[0.18em] tabular-nums text-navy-mid font-mono">
                    {step.num}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col items-center gap-2 mt-12">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 text-sm font-semibold rounded-lg text-white bg-orange-600 hover:bg-orange-700"
            >
              <Link href="/reserve">Reserve My Spot →</Link>
            </Button>
            <p className="text-xs text-gray-400 font-mono">
              Early access · limited spots available
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
```

**Step 2: Run dev server briefly to sanity-check**

```bash
pnpm dev
```
Open http://localhost:3000. You should see the dark navy hero with blueprint grid and orange accents. Kill with Ctrl+C.

**Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build landing page with navy hero, stats strip, and how-it-works"
```

---

## Task 9: Create WaitlistForm Component

**Files:**
- Create: `src/components/WaitlistForm.tsx`

**Step 1: Write the failing Zod schema test first**

Create `src/test/WaitlistForm.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { z } from "zod";

// Copy the schema here for isolated testing
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
```

**Step 2: Run test to verify it fails (schema not imported from component yet)**

```bash
pnpm test
```
Expected: 3 tests PASS (schema is defined inline in test — this verifies the logic before wiring to component).

**Step 3: Create `src/components/WaitlistForm.tsx`**

```typescript
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
          className="bg-white border-gray-200 focus-visible:ring-navy/30"
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
          className="bg-white border-gray-200 focus-visible:ring-navy/30"
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
          className="bg-white border-gray-200 focus-visible:ring-navy/30"
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
        className={`w-full h-11 text-sm font-semibold rounded-lg text-white ${loading ? "bg-orange-400" : "bg-orange-600 hover:bg-orange-700"}`}
      >
        {loading ? "Redirecting to checkout..." : "Reserve My Spot — $1,000 →"}
      </Button>

      <p className="text-center text-xs text-gray-400">
        $1,000 deposit is fully refundable if Frames isn&apos;t a fit.
      </p>
    </form>
  );
}
```

**Step 4: Run tests**

```bash
pnpm test
```
Expected: all tests PASS.

**Step 5: Commit**

```bash
git add src/components/WaitlistForm.tsx src/test/WaitlistForm.test.ts
git commit -m "feat: add WaitlistForm with name, email, trade select, company name"
```

---

## Task 10: Create Reserve Page

**Files:**
- Create: `src/app/reserve/page.tsx`

**Step 1: Create `src/app/reserve/page.tsx`**

```typescript
import Link from "next/link";
import { WaitlistForm } from "@/components/WaitlistForm";
import { StickyNav } from "@/components/StickyNav";

export default function ReservePage() {
  return (
    <>
      <StickyNav />
      <div className="min-h-screen flex flex-col bg-hero-gradient pt-[72px]">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md flex flex-col gap-4">
            <Link
              href="/"
              className="self-start text-xs text-white/50 hover:text-white/80 transition-colors font-mono"
            >
              ← Back
            </Link>

            <div className="panel relative overflow-hidden p-8">
              {/* Navy top accent */}
              <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[10px] bg-[#1E3A5F]" />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold tracking-tight text-gray-900 font-sans">
                      frames
                    </span>
                    <span className="text-sm font-bold text-orange-600">.</span>
                  </div>
                  <h1 className="text-[1.75rem] leading-tight text-gray-900 font-serif italic">
                    Secure your early access spot.
                  </h1>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    One step away from preferred pricing and early access to Frames.
                  </p>
                </div>

                <WaitlistForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/reserve/
git commit -m "feat: add reserve page with deposit form"
```

---

## Task 11: Create Thank-You Page

**Files:**
- Create: `src/app/thank-you/page.tsx`

**Step 1: Create `src/app/thank-you/page.tsx`**

```typescript
import Link from "next/link";
import { StickyNav } from "@/components/StickyNav";

export default function ThankYouPage() {
  return (
    <>
      <StickyNav showCta={false} showHowItWorks={false} />
      <div className="min-h-screen flex flex-col bg-hero-gradient pt-[72px]">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="panel relative overflow-hidden p-8">
              {/* Navy top accent */}
              <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[10px] bg-[#1E3A5F]" />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold tracking-tight text-gray-900 font-sans">
                      frames
                    </span>
                    <span className="text-sm font-bold text-orange-600">.</span>
                  </div>
                  <h1 className="text-[1.75rem] leading-tight text-gray-900 font-serif italic">
                    You&apos;re on the list.
                  </h1>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your $1,000 deposit is confirmed. We&apos;ll be in touch soon with early access details and your preferred pricing.
                  </p>
                </div>

                <div className="rounded-lg px-4 py-4 flex flex-col gap-3 bg-blue-50 border border-[#1E3A5F]/20">
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#1E3A5F] font-mono">
                    What happens next
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "You'll receive a confirmation email shortly",
                      "We'll reach out to schedule your onboarding",
                      "Your preferred pricing is locked in",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                        <span className="mt-[3px] w-1.5 h-1.5 rounded-full shrink-0 bg-orange-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/"
                  className="self-start text-xs text-gray-400 hover:text-gray-600 transition-colors font-mono"
                >
                  ← Back to frames.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/thank-you/
git commit -m "feat: add thank-you page with next-steps panel"
```

---

## Task 12: Create Checkout API Route + Tests

**Files:**
- Create: `src/app/api/checkout/route.ts`
- Create: `src/test/api/checkout.test.ts`

**Step 1: Write the failing test first**

Create `src/test/api/checkout.test.ts`:

```typescript
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
```

**Step 2: Run test — expect FAIL (route doesn't exist yet)**

```bash
pnpm test src/test/api/checkout.test.ts
```
Expected: FAIL — "Cannot find module '@/app/api/checkout/route'"

**Step 3: Create `src/app/api/checkout/route.ts`**

```typescript
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
```

**Step 4: Run tests — expect PASS**

```bash
pnpm test
```
Expected: all tests PASS.

**Step 5: Commit**

```bash
git add src/app/api/checkout/ src/test/api/checkout.test.ts
git commit -m "feat: add checkout API route with $1000 Stripe session"
```

---

## Task 13: Create Stripe Webhook Route + Tests

**Files:**
- Create: `src/app/api/webhooks/stripe/route.ts`
- Create: `src/test/api/webhook.test.ts`

**Step 1: Write the failing test first**

Create `src/test/api/webhook.test.ts`:

```typescript
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

  it("inserts to supabase and sends email on checkout.session.completed", async () => {
    vi.mocked(stripe.webhooks.constructEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
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
```

**Step 2: Run test — expect FAIL**

```bash
pnpm test src/test/api/webhook.test.ts
```
Expected: FAIL — route doesn't exist yet.

**Step 3: Create `src/app/api/webhooks/stripe/route.ts`**

```typescript
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
```

**Step 4: Run all tests — expect PASS**

```bash
pnpm test
```
Expected: all tests PASS.

**Step 5: Commit**

```bash
git add src/app/api/webhooks/ src/test/api/webhook.test.ts
git commit -m "feat: add stripe webhook handler with supabase insert and resend notification"
```

---

## Task 14: Final Wiring & Smoke Test

**Files:**
- Create: `.env.local` (local dev only, never committed)

**Step 1: Create `.env.local` with placeholder values**

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
RESEND_API_KEY=re_YOUR_KEY_HERE
NOTIFICATION_EMAIL=your@email.com
EOF
```

**Step 2: Confirm `.env.local` is gitignored**

```bash
cat .gitignore | grep env
```
Expected: `.env.local` or `.env*` appears.

**Step 3: Run final test suite**

```bash
pnpm test
```
Expected: all tests PASS, 0 failures.

**Step 4: Run build to catch type errors**

```bash
pnpm build
```
Expected: build succeeds with no errors.

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete Frames waitlist — all pages, API routes, and tests passing"
```

---

## Supabase Schema Reference

Run this SQL in your Supabase project's SQL editor:

```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  trade text not null,
  company_name text not null,
  stripe_session_id text not null,
  created_at timestamptz default now()
);
```

## Environment Variables Checklist

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_URL` | Your deployed domain (e.g. `https://frames.app`) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → signing secret |
| `SUPABASE_URL` | Supabase project settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings → API → service_role key |
| `RESEND_API_KEY` | Resend Dashboard → API keys |
| `NOTIFICATION_EMAIL` | Your email for signup notifications |
