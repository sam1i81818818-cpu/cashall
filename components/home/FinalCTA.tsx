import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
      {/* GLOW DECORATION */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Your Old Phone <br className="hidden sm:inline" />
          <span className="text-brand-yellow">Still Has Real Value.</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed font-normal">
          Find out what it&apos;s worth in 60 seconds. Free doorstep pickup, verified on-site inspection, and instant UPI cash payout.
        </p>

        <div className="pt-3 flex justify-center">
          <Link href="/sell-old-mobile-phone">
            <Button variant="primary" size="lg" className="text-sm font-extrabold px-8 py-3.5 gap-2 bg-brand-yellow hover:bg-yellow-400 text-slate-950 border-transparent rounded-xl shadow-yellowGlow cursor-pointer">
              <span>Check Phone Value Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
