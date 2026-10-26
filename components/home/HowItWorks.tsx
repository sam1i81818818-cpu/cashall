import React from "react";
import { Smartphone, Calculator, CalendarCheck, Wallet } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Tell Us About Your Phone",
      description: "Select your exact model and answer a few simple condition questions.",
      icon: Smartphone,
    },
    {
      step: "02",
      title: "Get Your CashALL Value",
      description: "See your instant transparent estimated selling price with itemized breakdown.",
      icon: Calculator,
    },
    {
      step: "03",
      title: "Schedule Fast & Free Pickup",
      description: "Pick a convenient doorstep pickup date and time slot at your home or office.",
      icon: CalendarCheck,
    },
    {
      step: "04",
      title: "Get Paid Instantly",
      description: "After physical verification, approve the final offer and receive instant UPI/Bank payment.",
      icon: Wallet,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-brand-black text-white relative border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CashALL Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-normal leading-relaxed">
            Selling your used smartphone shouldn&apos;t be complicated. Here is how we make it effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-neutral-900/60 backdrop-blur-md rounded-2xl p-6 border border-neutral-800/80 hover:border-brand-yellow/50 transition-all duration-300 relative group flex flex-col justify-between hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow flex items-center justify-center font-extrabold group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <span className="text-xl font-black text-neutral-700 group-hover:text-brand-yellow/50 transition-colors font-mono">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
