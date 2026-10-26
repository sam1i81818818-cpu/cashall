import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, FileText, Phone, Mail, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | CashALL (Aarna Enterprise)",
  description:
    "CashALL's official privacy policy under DPDP Act 2023 explaining personal data collection, device data erasure, customer rights, and security standards.",
  alternates: {
    canonical: "https://www.cashall.in/privacy",
  },
  openGraph: {
    title: "Privacy Policy | CashALL (Aarna Enterprise)",
    description:
      "CashALL's official privacy policy under DPDP Act 2023 explaining personal data collection, device data erasure, customer rights, and security standards.",
    url: "https://www.cashall.in/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-premium space-y-8 text-xs sm:text-sm text-brand-muted leading-relaxed">
            
            {/* HEADER */}
            <div className="border-b border-gray-100 pb-6 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                CashALL Privacy Policy
              </h1>
              <p className="text-xs text-brand-muted">
                Effective Date: January 1, 2026 • Last Reviewed: September 2026 • Operated by Aarna Enterprise
              </p>
            </div>

            {/* INTRODUCTION */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">1. Overview &amp; Data Fiduciary Identity</h2>
              <p>
                <strong>CashALL</strong> (accessible at <Link href="/" className="text-brand-black underline font-semibold">https://www.cashall.in</Link>) is a consumer electronic device buyback, recommerce, and gaming rental platform owned and operated by <strong>Aarna Enterprise</strong> (&ldquo;CashALL&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a registered enterprise headquartered in Howrah, West Bengal, India.
              </p>
              <p>
                This Privacy Policy articulates our obligations as a Data Fiduciary pursuant to the Digital Personal Data Protection (DPDP) Act 2023, the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
              </p>
            </section>

            {/* INFORMATION WE COLLECT */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">2. Personal Data We Collect</h2>
              <p>
                We collect only the minimum necessary personal data required to formulate device valuations, dispatch doorstep evaluation agents, verify legal device ownership, process payouts, and maintain statutory audit records:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Identity &amp; Contact Details:</strong> Full name, telephone/mobile number, email address.</li>
                <li><strong>Doorstep Logistics Details:</strong> House/flat number, street name, landmark, area, city, pincode, and preferred pickup appointment slots.</li>
                <li><strong>Statutory Seller Verification (KYC):</strong> Government-issued photo identification (such as Aadhaar card, PAN card, Voter ID, or Driving License) presented in person to our field agent solely for identity confirmation and anti-theft verification as required by Indian law.</li>
                <li><strong>Payout Information:</strong> Bank account numbers, IFSC codes, or Unified Payments Interface (UPI) VPA handles, utilized solely for immediate real-time payout execution upon device purchase.</li>
                <li><strong>Device Technical Telemetry:</strong> Device brand, model, storage capacity, physical/functional condition parameters, and International Mobile Station Equipment Identity (IMEI) / serial numbers to confirm authentic ownership.</li>
              </ul>
            </section>

            {/* DEVICE DATA SANITIZATION */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-yellow" />
                3. On-Site Device Data Erasure &amp; Privacy Protocol
              </h2>
              <p>
                Your personal digital privacy is our foremost operational priority. Prior to device handover and payout:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Our field agent assists and supervises a complete cryptographic factory data reset of your device in your physical presence.</li>
                <li>All cloud accounts (such as Apple ID, iCloud, Google Account, Samsung Account, Xiaomi Mi Account) must be signed out and unlinked by the seller.</li>
                <li>All SIM cards, eSIM profiles, and external microSD memory cards must be removed before completing the sale.</li>
                <li>CashALL adheres to a strict zero-retention policy for customer media, photos, messages, and files. Once a device is factory reset, previous device data cannot be recovered.</li>
              </ul>
            </section>

            {/* LEGAL BASIS AND USE */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">4. Purpose of Data Processing</h2>
              <p>
                We process your personal data exclusively for lawful purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Providing accurate instant device valuation quotes.</li>
                <li>Scheduling and fulfilling doorstep pickup and physical verification appointments.</li>
                <li>Executing instant payments via verified UPI or IMPS/NEFT bank channels.</li>
                <li>Transmitting transactional confirmations, order status updates, and digital purchase receipts via SMS, WhatsApp, and email.</li>
                <li>Fulfilling legal anti-theft and law enforcement compliance requirements under Indian criminal and recommerce regulations.</li>
              </ul>
            </section>

            {/* DATA SHARING */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">5. Data Sharing &amp; Third Parties</h2>
              <p>
                <strong>We never sell, rent, or trade customer personal data to third-party marketing companies.</strong> Data is shared strictly on a need-to-know basis with:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Authorized Field Logistics Personnel:</strong> Assigned agents receive only customer name, pickup address, and contact number to execute your booked pickup.</li>
                <li><strong>Banking &amp; Payment Processors:</strong> RBI-licensed banking and UPI partners to disburse device sale proceeds.</li>
                <li><strong>Law Enforcement Authorities:</strong> When formally requested under valid legal summons or statutory requirements to investigate stolen property or fraud.</li>
              </ul>
            </section>

            {/* YOUR RIGHTS */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">6. Your Rights Under DPDP Act 2023</h2>
              <p>
                As a Data Principal under the Digital Personal Data Protection Act 2023, you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Request a summary of personal data processed by CashALL.</li>
                <li>Request correction or updating of inaccurate personal data.</li>
                <li>Request erasure of personal data that is no longer required for legal compliance or transactional obligations.</li>
                <li>Nominate an individual to exercise rights on your behalf in the event of incapacity.</li>
              </ul>
            </section>

            {/* GRIEVANCE OFFICER */}
            <section className="space-y-3 p-5 rounded-2xl bg-gray-50 border border-brand-border">
              <h2 className="text-sm sm:text-base font-bold text-brand-black">7. Grievance Redressal &amp; Contact Details</h2>
              <p className="text-xs">
                In compliance with the DPDP Act 2023 and the Information Technology Rules, the name and contact details of the Grievance Officer are set forth below:
              </p>
              <div className="space-y-1.5 text-xs pt-1">
                <div className="font-bold text-brand-black">Grievance Officer: Ankit Gupta</div>
                <div>Entity: Aarna Enterprise (CashALL)</div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-brand-muted" />
                  Email: <a href="mailto:support@cashall.in" className="text-brand-black font-semibold hover:underline">support@cashall.in</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-brand-muted" />
                  Helpline: <a href="tel:+917604092333" className="text-brand-black font-semibold hover:underline">+91 7604092333</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-muted" />
                  Registered Address: Kolkata, West Bengal 711203, India
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
