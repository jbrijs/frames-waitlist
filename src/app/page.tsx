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
            <span className="self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[0.65rem] tracking-[0.18em] uppercase font-medium border" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)", borderColor: "rgba(255,255,255,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#FF841F" }} />
              Early Access — Limited Spots
            </span>

            {/* Headline */}
            <h1 className="text-[3.25rem] sm:text-[4.5rem] lg:text-[5rem] leading-none tracking-tight text-white font-display font-bold">
              Know before
              <br />
              <span style={{ color: "#FF841F" }}>you cut.</span>
            </h1>

            {/* Subhead */}
            <p className="text-lg leading-relaxed max-w-xl font-sans" style={{ color: "rgba(255,255,255,0.82)" }}>
              Frames captures every wall before drywall goes up — so electricians, plumbers,
              and HVAC crews always know exactly what&apos;s hidden.
            </p>

            {/* CTA */}
            <div className="flex flex-col gap-3 self-start">
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-12 px-8 text-sm font-semibold rounded-lg text-white"
                  style={{ backgroundColor: "#E86800" }}
                >
                  <Link href="/reserve">Reserve My Spot →</Link>
                </Button>
                <a
                  href="#how-it-works"
                  className="h-12 px-6 rounded-full inline-flex items-center text-sm font-semibold transition-colors whitespace-nowrap"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  See how it works
                </a>
              </div>
              <p className="text-xs px-1 font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
                $1,000 refundable deposit · early access pricing locked in
              </p>
            </div>
          </div>
        </div>

        {/* Stats strip at bottom of hero */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", backgroundColor: "#162D4A" }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x" style={{ "--tw-divide-opacity": 1 } as React.CSSProperties}>
            {stats.map((stat) => (
              <div key={stat.value} className="px-6 py-4 sm:py-0 flex flex-col gap-1" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <span className="text-3xl font-bold font-display" style={{ color: "#FF841F" }}>{stat.value}</span>
                <span className="text-xs leading-snug font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 section-rounded">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-20 pb-60">
          {/* Section header */}
          <div className="flex flex-col gap-3 mb-12">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase font-mono" style={{ color: "#E86800" }}>
              How it works
            </span>
            <h2 className="text-[2rem] sm:text-[2.5rem] leading-tight tracking-tight text-gray-900 font-display font-bold">
              Capture once.{" "}
              <span style={{ color: "#1E3A5F" }}>Find anything.</span>
            </h2>
            <p className="text-base text-gray-500 leading-relaxed max-w-lg">
              A four-step workflow that fits into how trades already work on-site.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 rounded-xl overflow-hidden border-2 border-gray-200">
            {steps.map((step) => (
              <div key={step.num} className="bg-white p-7 flex flex-col gap-6 border-b-2 border-r-2 border-gray-200 last:border-b-0 [&:nth-child(2)]:border-r-0 [&:nth-child(4)]:border-r-0 [&:nth-child(3)]:border-b-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase font-mono" style={{ color: "#E86800" }}>
                    {step.phase}
                  </span>
                  <span className="text-xs font-semibold tracking-[0.18em] tabular-nums font-mono" style={{ color: "#2C558C" }}>
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
              className="h-12 px-8 text-sm font-semibold rounded-lg text-white"
              style={{ backgroundColor: "#E86800" }}
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
