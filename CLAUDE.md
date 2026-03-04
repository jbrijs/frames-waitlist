# Frames Waitlist — Claude Instructions

## Project

Waitlist landing site for **Frames** — a pre-drywall spatial capture app for residential construction trades.

**Tagline:** "Know before you cut."

**Target users:** Electricians, plumbers, HVAC subcontractors, superintendents, and small/medium homebuilders in North American residential construction.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Components:** shadcn/ui
- **Styling:** Tailwind CSS v4
- **Package manager:** pnpm
- **Payments:** Stripe ($1,000 refundable deposit)
- **Database:** Supabase
- **Email:** Resend
- **Validation:** Zod
- **Fonts:** DM Serif Display, Plus Jakarta Sans, Geist Mono (Google Fonts)

## Brand Colors

### Primary (Navy)
- `#1E3A5F` — primary (hero background, top accent bars)
- `#2C558C` — primary mid
- `#5487C9` — primary light

### Secondary (Orange)
- `#E86800` — secondary (CTA buttons, accents, dots)
- `#FF841F` — secondary mid
- `#FF9A47` — secondary light

### Typography & Neutral
- `#2B2B2B` — text primary
- `#4F4F4F` — text secondary
- `#7A7A7A` — text muted
- `#F5F5F5` — background base

## Typography

- **Headlines:** DM Serif Display italic — large, bold serif for hero/section headlines
- **Body:** Plus Jakarta Sans — all body text and UI
- **Labels/badges/code:** Geist Mono — tracking labels, badges, monospace elements

## Design Aesthetic

Industrial/Blueprint — dark navy hero with subtle blueprint grid, orange CTAs. Built *for* trades, not generic SaaS. Key patterns:

- Sticky pill nav with frosted glass on scroll
- Dark navy hero with CSS blueprint grid overlay
- Light glass card section overlapping the hero (`-mt-10`)
- White panel cards with navy top accent bar (3px)
- Stats row with orange dividers

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing: hero + stats + how-it-works + CTA |
| `/reserve` | Form (name, email, trade, company) → Stripe $1,000 checkout |
| `/thank-you` | Post-payment confirmation |
| `/api/checkout` | Creates Stripe session |
| `/api/webhooks/stripe` | Saves to Supabase, sends Resend notification |

## Reference

The alto-waitlist (`~/alto/alto-waitlist`) is the structural reference for this project — same routing pattern, component names, and API architecture adapted for Frames branding and content.

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
