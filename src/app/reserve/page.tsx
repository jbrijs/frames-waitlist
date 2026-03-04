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
              className="self-start text-xs font-mono transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              ← Back
            </Link>

            <div className="panel relative overflow-hidden p-8">
              {/* Navy top accent bar */}
              <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[10px]" style={{ backgroundColor: "#1E3A5F" }} />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm font-bold tracking-tight text-gray-900 font-sans">
                      frames
                    </span>
                    <span className="text-sm font-bold" style={{ color: "#E86800" }}>.</span>
                  </div>
                  <h1 className="text-[1.75rem] leading-tight text-gray-900 font-display font-bold">
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
