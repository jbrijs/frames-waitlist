import Link from "next/link";
import { StickyNav } from "@/components/StickyNav";

export default function ThankYouPage() {
  return (
    <>
      <StickyNav showCta={false} showHowItWorks={false} />
      <div className="min-h-screen flex flex-col bg-hero-gradient pt-[72px]">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="panel p-8" style={{ backgroundColor: "#F5F5F5" }}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold tracking-tight text-gray-900 font-sans">
                      frames
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#E86800" }}>.</span>
                  </div>
                  <h1 className="text-[1.75rem] leading-tight text-gray-900 font-display font-bold">
                    You&apos;re on the list.
                  </h1>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Your $1,000 deposit is confirmed. We&apos;ll be in touch soon with early access details and your preferred pricing.
                  </p>
                </div>

                <div className="rounded-lg px-4 py-4 flex flex-col gap-3" style={{ backgroundColor: "#E8EEF5", border: "1px solid rgba(30,58,95,0.15)" }}>
                  <p className="text-[10px] font-semibold tracking-[0.18em] uppercase font-mono" style={{ color: "#1E3A5F" }}>
                    What happens next
                  </p>
                  <ul className="flex flex-col gap-2">
                    {[
                      "You'll receive a confirmation email shortly",
                      "We'll reach out to schedule your onboarding",
                      "Your preferred pricing is locked in",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="mt-[3px] w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#E86800" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/"
                  className="self-start text-xs text-gray-600 hover:text-gray-900 transition-colors font-mono"
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
