import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, AlertCircle, FileCheck, Banknote, ShieldAlert, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | CashALL (Aarna Enterprise)",
  description:
    "Official terms and conditions for selling used mobile phones, laptops, tablets, and PlayStation 5 rentals on CashALL.",
  alternates: {
    canonical: "https://www.cashall.in/terms",
  },
  openGraph: {
    title: "Terms & Conditions | CashALL (Aarna Enterprise)",
    description:
      "Official terms and conditions for selling used mobile phones, laptops, tablets, and PlayStation 5 rentals on CashALL.",
    url: "https://www.cashall.in/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-premium space-y-8 text-xs sm:text-sm text-brand-muted leading-relaxed">
            
            {/* HEADER */}
            <div className="border-b border-gray-100 pb-6 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                CashALL Terms &amp; Conditions
              </h1>
              <p className="text-xs text-brand-muted">
                Effective Date: January 1, 2026 • Last Updated: September 2026 • Operated under Aarna Enterprise
              </p>
            </div>

            {/* SECTION 1 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">1. Acceptance of Terms &amp; Operating Entity</h2>
              <p>
                These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of <strong>CashALL</strong> (accessible at <Link href="/" className="text-brand-black underline font-semibold">https://www.cashall.in</Link>), operated by <strong>Aarna Enterprise</strong> (&ldquo;CashALL&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By booking a device pickup, submitting an online quote, or engaging with our service personnel, you enter into a legally binding contract with Aarna Enterprise.
              </p>
            </section>

            {/* SECTION 2 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">2. Online Valuation vs. Doorstep Physical Verification</h2>
              <p>
                Quotes generated on cashall.in are non-binding preliminary valuations based entirely on the diagnostic self-assessment provided by the customer.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Upon arrival at your doorstep, an authorized CashALL technician conducts an objective 15-minute diagnostic inspection covering screen touch responsiveness, dead pixels/lines, camera lenses, battery health, casing scratches, and functional hardware.</li>
                <li>If the device condition corresponds accurately to your initial online selection, the full original quoted amount is disbursed immediately.</li>
                <li>If physical or internal defects are identified that were omitted during online diagnostic selection, the agent will present an objective re-quote accompanied by explicit diagnostic findings.</li>
                <li><strong>Zero-Obligation Guarantee:</strong> You remain under zero obligation to accept a revised quotation. If you choose not to accept the re-quote, the pickup is cancelled immediately with <strong>₹0 cancellation fee</strong> and zero doorstep visit charge.</li>
              </ul>
            </section>

            {/* SECTION 3 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-brand-yellow" />
                3. Seller Declarations, Legal Ownership &amp; Anti-Theft Policy
              </h2>
              <p>
                By tendering any device for sale on CashALL, the seller unconditionally declares, warrants, and confirms:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>The seller is the sole, lawful, and absolute owner of the device, possessing full legal capacity to transfer unrestricted title.</li>
                <li>The device is not stolen, lost, subject to any financial lien, EMI lock, or blacklisted on national carrier/telecom registries (such as CEIR / DoT).</li>
                <li>The seller must provide a valid government-issued photo identity proof (Aadhaar, Voter ID, Passport, or Driving License) for identity verification during doorstep handover.</li>
                <li>CashALL maintains a strict zero-tolerance policy against stolen electronics. Any attempt to tender stolen or fraudulent goods will be immediately reported to local law enforcement authorities along with digital telemetry and CCTV/GPS records.</li>
              </ul>
            </section>

            {/* SECTION 4 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black flex items-center gap-2">
                <Banknote className="w-4 h-4 text-brand-yellow" />
                4. Payment Disbursement Protocol
              </h2>
              <p>
                Following diagnostic agreement and physical verification:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Payment is executed on-the-spot via real-time Unified Payments Interface (UPI) or Immediate Payment Service (IMPS) bank transfer.</li>
                <li>The seller is required to verify SMS / bank app credit confirmation on their personal phone before the device is taken into custody by our agent.</li>
                <li>A digital sale receipt and bill of purchase documenting order number, IMEI number, agreed price, and payment reference (UTR) is issued upon transaction completion.</li>
              </ul>
            </section>

            {/* SECTION 5 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">5. Finality of Transaction</h2>
              <p>
                Once payment has been disbursed, ownership transfer is completed, and the device has been sanitized and handed over, <strong>the sale is final and irrevocable</strong>. Devices are transferred into our refurbishment and logistics pipeline immediately and cannot be returned or bought back at original pricing.
              </p>
            </section>

            {/* SECTION 6 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">6. PlayStation 5 (PS5) Rental Terms</h2>
              <p>
                For customers utilizing CashALL PS5 console rentals:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Consoles remain the exclusive property of Aarna Enterprise throughout the rental tenure.</li>
                <li>Renters must provide identity verification, residential proof, and a refundable security deposit prior to dispatch.</li>
                <li>Consoles must be returned in the original working condition. Any physical damage, water ingress, or loss of controllers will be deducted from the security deposit at replacement cost.</li>
              </ul>
            </section>

            {/* SECTION 7 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">7. Governing Law &amp; Jurisdiction</h2>
              <p>
                These Terms and any contractual disputes arising out of services provided by CashALL shall be governed by and construed in accordance with the substantive laws of India. The courts of competent jurisdiction located in <strong>Kolkata, West Bengal</strong> shall possess exclusive jurisdiction over any legal proceedings.
              </p>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
