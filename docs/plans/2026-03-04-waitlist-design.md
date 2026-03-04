# Frames Waitlist — Design Document
_2026-03-04_

## Overview

A waitlist landing site for Frames — a pre-drywall spatial capture app for residential construction trades. Modeled after the alto-waitlist pattern: landing page → reserve form → Stripe checkout → thank-you.

## Product Context

**Tagline:** "Know before you cut."

**Target users:** Electricians, plumbers, HVAC subcontractors, superintendents, and small/medium homebuilders in North American residential construction.

**Value prop:** Capture photos of walls before drywall, tag outlets/pipes/vents, and look up hidden elements after drywall goes up — eliminating costly rework.

---

## Architecture & Pages

| Route | Purpose |
|---|---|
| `/` | Landing page: hero + problem stats + how-it-works + CTA |
| `/reserve` | Signup form → Stripe checkout ($1,000 deposit) |
| `/thank-you` | Confirmation page after payment |
| `/api/checkout` | POST: creates Stripe checkout session |
| `/api/webhooks/stripe` | POST: saves to Supabase, sends notification email |

**Tech stack:** Next.js 16, shadcn/ui, Tailwind v4, Stripe, Supabase, Resend, Zod

---

## Visual Design

### Aesthetic: Industrial / Blueprint

- Dark navy hero (`#1E3A5F`) with subtle CSS blueprint grid overlay
- Light glass card section overlapping the hero (same `-mt-10` pattern as alto)
- Orange (`#CA6B1E`) as the action/accent color
- Feels like a tool built *for* trades, not generic SaaS

### Color Palette

**Primary (Navy):**
- `#1E3A5F` — primary / hero background
- `#2C558C` — primary mid
- `#5487C9` — primary light

**Secondary (Orange):**
- `#CA6B1E` — secondary / CTA / accents
- `#E2863C` — secondary mid
- `#E79C5F` — secondary light

**Typography & Neutral:**
- `#2B2B2B` — text primary
- `#4F4F4F` — text secondary
- `#7A7A7A` — text muted
- `#F5F5F5` — background base

### Typography

- **Headlines:** DM Serif Display italic (large, bold)
- **Body:** Plus Jakarta Sans
- **Labels/badges/mono:** Geist Mono

### Key UI Patterns

- **Nav:** Sticky pill nav — logo `frames.` with orange dot, tagline "Know Before You Cut", "Reserve →" CTA
- **Hero badge:** `Early Access — Limited Spots` in Geist Mono, orange background
- **Hero headline:** `"Know before you cut."` — serif italic, white on navy
- **Stats row:** 3 punchy stats (`$177B`, `50%`, `$500K+`) with orange dividers, on lighter navy card
- **How it works:** 2×2 grid of steps on light glass card overlapping hero
- **Panel card:** White card with `#1E3A5F` top accent bar (3px), used on reserve + thank-you pages
- **CTA button:** Orange (`#CA6B1E`) background, white text

---

## Form & Data

### Fields (reserve form)

| Field | Type | Validation |
|---|---|---|
| Full Name | text | required |
| Email | email | required, valid email |
| Trade / Role | select | required |
| Company Name | text | required |

**Trade options:** Electrician, Plumber, HVAC, Superintendent, General Contractor, Other

### Stripe

- Amount: **$1,000 USD** (`unit_amount: 100000`)
- Product name: "Frames Early Access — Refundable Deposit"
- `success_url`: `/thank-you?session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `/?canceled=true`

### Supabase Table: `waitlist`

```sql
id              uuid primary key default gen_random_uuid()
name            text not null
email           text not null
trade           text not null
company_name    text not null
stripe_session_id text not null
created_at      timestamptz default now()
```

### Email notification (Resend)

Triggered on `checkout.session.completed` webhook. Sends to `NOTIFICATION_EMAIL` with name, email, trade, company, and Stripe session ID.

---

## Environment Variables

```
NEXT_PUBLIC_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NOTIFICATION_EMAIL
```

---

## How It Works — Steps

1. **Create a Project** — Upload an architectural plan (optional), name the project
2. **Photo Walkthrough** — Guided capture of every wall before drywall goes up
3. **Tag Elements** — Mark outlets, pipes, vents, valves with annotations
4. **Look Up After Drywall** — Find any hidden element instantly with phone/tablet on-site
