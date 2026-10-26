import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Truck, Clock, ShieldCheck, MapPin, CheckCircle2, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Doorstep Pickup Policy | CashALL (Aarna Enterprise)",
  description:
    "CashALL's official doorstep pickup policy: 100% free home pickup, 2-hour express dispatch, inspection procedure, and service zones.",
  alternates: {
    canonical: "https://www.cashall.in/pickup-policy",
  },
  openGraph: {
    title: "Doorstep Pickup Policy | CashALL (Aarna Enterprise)",
    description:
      "CashALL's official doorstep pickup policy: 100% free home pickup, 2-hour express dispatch, inspection procedure, and service zones.",
    url: "https://www.cashall.in/pickup-policy",
  },
};

export default function PickupPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-black">
      <Header />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-border shadow-premium space-y-8 text-xs sm:text-sm text-brand-muted leading-relaxed">
            
            {/* HEADER */}
            <div className="border-b border-gray-100 pb-6 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-black tracking-tight">
                CashALL Doorstep Pickup Policy
              </h1>
              <p className="text-xs text-brand-muted">
                Effective Date: January 1, 2026 • Operated by Aarna Enterprise
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">1. ₹0 Doorstep Convenience Fee (Always Free)</h2>
              <p>
                Unlike other recommerce aggregators who deduct ₹100 – ₹199 doorstep convenience fees or pickup charges from your payout, <strong>CashALL provides 100% free doorstep pickup across all serviceable zones</strong>. What we agree to pay you is the exact amount credited to your bank account or UPI handle—with zero deduction for travel, evaluation, or logistics.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">2. Express Scheduling &amp; 2-Hour Dispatch Slots</h2>
              <p>
                We offer flexible pickup scheduling to accommodate your personal calendar:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Same-Day Express Service:</strong> Available across primary urban zones (Salt Lake, New Town, South Kolkata, Howrah, Bally, Liluah) for orders booked prior to 3:00 PM IST.</li>
                <li><strong>Scheduled Morning &amp; Afternoon Slots:</strong> 10:00 AM – 1:00 PM, 1:00 PM – 4:00 PM, and 4:00 PM – 8:00 PM slots are available Monday through Sunday.</li>
                <li><strong>Pre-Arrival Agent Call:</strong> Our certified pickup technician will call you 30 to 45 minutes prior to arrival to confirm your availability.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">3. What to Prepare Prior to Pickup</h2>
              <p>
                To ensure a fast, seamless 10-minute doorstep transaction, please have the following items ready:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Charged Device:</strong> Ensure your phone, laptop, or tablet has at least 30% battery charge so our technician can verify touch, camera, Wi-Fi, and screen health.</li>
                <li><strong>Original Accessories (If Quoted):</strong> Box, original charger, and purchase invoice (if you indicated having them in your quote for extra value).</li>
                <li><strong>Govt Photo ID:</strong> Keep your Aadhaar Card, Voter ID, Driving License, or Passport ready for statutory seller identification.</li>
                <li><strong>Account Credentials:</strong> Ensure you know your Apple ID / Google Account password to log out and initiate factory data reset.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-black text-brand-black">4. Rescheduling a Pickup</h2>
              <p>
                Need to change your pickup time or location? You can reschedule your appointment at any time with <strong>zero penalty</strong>. Simply call our logistics desk at <a href="tel:+917604092333" className="text-brand-black font-semibold hover:underline">+91 7604092333</a> or message our WhatsApp team.
              </p>
            </section>

            <section className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-yellow" />
                <h2 className="text-base sm:text-lg font-black text-brand-black">
                  Serviceable Hubs &amp; Direct Field Coverage
                </h2>
              </div>
              <p className="text-xs text-neutral-600">
                Doorstep pickup is actively deployed by verified technicians across our primary urban centers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
                  <img
                    src="/images/locations/howrah.jpg"
                    alt="Howrah Central Headquarters - Howrah Bridge"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-brand-black">Howrah Hub (HQ)</h3>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                        Central Hub • Active
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Shibpur, Salkia, Bally, Liluah, Nabanna, Howrah Station Corridor &amp; GT Road.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
                  <img
                    src="/images/locations/kolkata.jpg"
                    alt="Kolkata Serviceable Hub - Victoria Memorial"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-brand-black">Kolkata Hub</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Same-Day Active
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Salt Lake, New Town, Park Street, Ballygunge, Gariahat, Jadavpur, Behala, Dum Dum.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
                  <img
                    src="/images/locations/hooghly.jpg"
                    alt="Hooghly & Barrackpore Hub - Hooghly Riverside"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-brand-black">Hooghly &amp; Barrackpore</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Doorstep Active
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Serampore, Rishra, Konnagar, Uttarpara, Barrackpore Cantonment, Titagarh.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
                  <img
                    src="/images/locations/ranchi.jpg"
                    alt="Ranchi Serviceable Hub - Jagannath Temple Ranchi"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-brand-black">Ranchi Hub</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Doorstep Active
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Lalpur, Doranda, Kanke Road, Hinoo, Ratu Road, Bariatu, Morabadi, Harmu.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
                  <img
                    src="/images/locations/patna.jpg"
                    alt="Patna Serviceable Hub - Golghar Patna"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-brand-black">Patna Hub</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Doorstep Active
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Boring Road, Kankarbagh, Bailey Road, Fraser Road, Danapur, Rajendra Nagar, Patliputra.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs flex flex-col">
                  <img
                    src="/images/locations/gorakhpur.jpg"
                    alt="Gorakhpur Hub - Gorakhpur"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-1.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-brand-black">Gorakhpur Hub</h3>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Doorstep Active
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted">
                      Golghar, Medical College Road, Rapti Nagar, Rustampur, Civil Lines.
                    </p>
                  </div>
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
