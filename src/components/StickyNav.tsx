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
            className="absolute inset-0 rounded-full backdrop-blur-[40px] backdrop-saturate-150 z-0"
            style={{ backgroundColor: "rgba(30, 58, 95, 0.85)" }}
            aria-hidden
          />
        )}

        {/* Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-0.5 hover:opacity-80 transition-opacity relative z-10"
        >
          <span className="text-xl font-bold tracking-tight font-sans text-white">
            frames
          </span>
          <span className="text-xl font-bold" style={{ color: "#E2863C" }}>.</span>
        </Link>

        {/* Tagline — center, fades on scroll */}
        <p className="nav-tagline hidden sm:block absolute left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.18em] uppercase whitespace-nowrap pointer-events-none font-mono z-10" style={{ color: "rgba(255,255,255,0.5)" }}>
          Know Before You Cut
        </p>

        {/* Right side */}
        <div className="flex items-center gap-4 relative z-10">
          {showHowItWorks && (
            <a
              href="#how-it-works"
              className="hidden sm:block text-xs font-medium whitespace-nowrap transition-colors font-mono tracking-[0.04em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              How it works
            </a>
          )}
          {showCta && (
            <Button
              asChild
              size="sm"
              className="text-xs font-semibold rounded-full text-white h-8 px-4 whitespace-nowrap"
              style={{ backgroundColor: "#CA6B1E" }}
            >
              <Link href="/reserve">Reserve →</Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
