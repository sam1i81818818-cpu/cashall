"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  X,
  Send,
  Sparkles,
  PhoneCall,
  ArrowRight,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  relatedQuestions?: string[];
  showContactActions?: boolean;
}

// Custom artistic drawing illustration of Aarna (Warm, friendly Indian tech concierge)
export function AarnaAvatar({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-50 shadow-md ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-cover"
      >
        {/* Soft Background Circle */}
        <circle cx="60" cy="60" r="60" fill="#0A0A0A" />
        <circle cx="60" cy="60" r="54" fill="#1C1917" />
        
        {/* Soft Gold Ambient Glow */}
        <circle cx="60" cy="50" r="42" fill="#FFD400" fillOpacity="0.18" />

        {/* Headset Band */}
        <path
          d="M32 50 C32 30 88 30 88 50"
          stroke="#FFD400"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Hair - Dark rich flowing silhouette */}
        <path
          d="M36 62 C34 40 45 28 60 28 C75 28 86 40 84 62 C82 72 82 82 85 92 C77 96 43 96 35 92 C38 82 38 72 36 62 Z"
          fill="#1A1817"
        />

        {/* Face Silhouette */}
        <ellipse cx="60" cy="58" rx="20" ry="24" fill="#FAD4B2" />

        {/* Bangs / Front Hair */}
        <path
          d="M40 46 C48 38 72 38 80 46 C75 42 67 40 60 40 C53 40 45 42 40 46 Z"
          fill="#1A1817"
        />
        <path
          d="M40 46 C45 52 50 54 53 52 C49 48 45 46 40 46 Z"
          fill="#292524"
        />

        {/* Eyebrows */}
        <path d="M48 50 Q53 48 56 50" stroke="#44403C" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M64 50 Q67 48 72 50" stroke="#44403C" strokeWidth="1.5" strokeLinecap="round" />

        {/* Friendly Expressive Eyes */}
        <circle cx="52" cy="55" r="2.5" fill="#1C1917" />
        <circle cx="68" cy="55" r="2.5" fill="#1C1917" />
        <circle cx="53" cy="54" r="0.8" fill="#FFFFFF" />
        <circle cx="69" cy="54" r="0.8" fill="#FFFFFF" />

        {/* Bindi (Subtle cultural identity) */}
        <circle cx="60" cy="49" r="1.2" fill="#DC2626" />

        {/* Soft Cheek Blush */}
        <ellipse cx="47" cy="62" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.4" />
        <ellipse cx="73" cy="62" rx="3.5" ry="2" fill="#F472B6" fillOpacity="0.4" />

        {/* Warm Gentle Smile */}
        <path
          d="M54 65 Q60 71 66 65"
          stroke="#B91C1C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Headset Earpiece & Boom Mic */}
        <rect x="29" y="48" width="6" height="14" rx="3" fill="#FFD400" />
        <rect x="85" y="48" width="6" height="14" rx="3" fill="#FFD400" />
        <path
          d="M87 56 C87 72 74 74 66 74"
          stroke="#FFD400"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="65" cy="74" r="3" fill="#10B981" />

        {/* Neck & Yellow/Black Uniform Collar */}
        <path d="M54 80 L54 88 L66 88 L66 80 Z" fill="#E8BD9B" />
        <path
          d="M34 100 C34 90 46 86 60 86 C74 86 86 90 86 100 Z"
          fill="#FFD400"
        />
        {/* Collar Accent */}
        <path
          d="M52 86 L60 96 L68 86 Z"
          fill="#0A0A0A"
        />
      </svg>
    </div>
  );
}

// Comprehensive QA Knowledge Base for Aarna
const KNOWLEDGE_BASE: Array<{
  keywords: string[];
  response: string;
  related: string[];
}> = [
  {
    keywords: ["document", "documents", "id", "proof", "aadhaar", "pan", "voter", "passport", "paper", "papers"],
    response:
      "For a smooth doorstep pickup, please keep the following ready:\n\n1. 🪪 **1 Valid Government ID Proof (Mandatory)**: Aadhaar Card, Voter ID, Driving License, or Passport for KYC verification & digital bill of sale.\n2. 📄 **Original Invoice / Bill (Optional)**: Brings you bonus valuation if available.\n3. 📦 **Original Box & Charger (Optional)**: Adds extra cash value to your quote.\n4. 💳 **UPI ID or Bank Details**: To receive instant payment right at your doorstep before device handover!",
    related: [
      "How is my payout transferred?",
      "Can I sell a broken or dead phone?",
      "How is my phone's price calculated?",
    ],
  },
  {
    keywords: ["price", "calculate", "valuation", "worth", "rates", "how much", "rate", "quote"],
    response:
      "CashALL uses a transparent real-time recommerce engine that tracks live Indian market rates to guarantee the highest payout across platforms. The valuation you get is 100% locked at booking with ₹0 convenience fee and zero last-minute haggling!",
    related: [
      "What documents do I need during pickup?",
      "Do you pay cash or UPI on spot?",
      "Can I sell a broken or dead phone?",
    ],
  },
  {
    keywords: ["payment", "upi", "cash", "spot", "transfer", "bank", "pay", "money", "immediate"],
    response:
      "Payment is 100% instant and happens on the spot! Our verified field technician inspects your device at your doorstep, initiates certified factory reset, and immediately transfers payment via UPI (GPay, PhonePe, Paytm) or IMPS bank transfer before device handover.",
    related: [
      "What documents do I need during pickup?",
      "How is my phone's price calculated?",
      "Can I reschedule or cancel pickup?",
    ],
  },
  {
    keywords: ["broken", "damage", "damaged", "crack", "cracked", "dead", "switch on", "screen", "dent", "scratches", "faulty"],
    response:
      "Yes, absolutely! We buy phones in every physical condition—whether it has a cracked screen, deep body dents, broken camera, lines on display, or even completely dead/non-bootable. You will still receive an instant guaranteed valuation.",
    related: [
      "What documents do I need during pickup?",
      "How is my payout transferred?",
      "Do you buy laptops and tablets?",
    ],
  },
  {
    keywords: ["pickup", "doorstep", "area", "kolkata", "howrah", "gorakhpur", "city", "where", "slot", "time"],
    response:
      "We offer 100% free doorstep pickup across Kolkata, Howrah, Hooghly, North/South 24 Parganas, and Gorakhpur. You can select your preferred date and convenient 2-hour time slot during checkout. An agent will visit your home or office on schedule!",
    related: [
      "What documents do I need during pickup?",
      "Do you pay cash or UPI on spot?",
      "Can I reschedule or cancel pickup?",
    ],
  },
  {
    keywords: ["data", "privacy", "reset", "safe", "dpdp", "wipe", "photos", "delete", "security"],
    response:
      "Your privacy is our highest priority! Under the DPDP Act 2023, our agent supervises a complete cryptographic factory data reset right in front of you. All photos, accounts, and private data are erased permanently before device handover.",
    related: [
      "What documents do I need during pickup?",
      "Do you pay cash or UPI on spot?",
      "How is my phone's price calculated?",
    ],
  },
  {
    keywords: ["laptop", "tablet", "ipad", "macbook", "sell laptop", "dell", "hp", "lenovo"],
    response:
      "Yes! You can sell laptops (MacBook, Dell, HP, Lenovo, Asus, Acer) and tablets/iPads on CashALL. Enjoy the same instant algorithmic valuation, free doorstep pickup, and spot UPI payment.",
    related: [
      "How is my phone's price calculated?",
      "What documents do I need during pickup?",
      "Do you rent PS5 console?",
    ],
  },
  {
    keywords: ["ps5", "rent", "playstation", "console", "game", "rental"],
    response:
      "Yes! CashALL offers PS5 console rentals across Kolkata & West Bengal starting at just ₹500/day. Includes doorstep delivery, pre-tested video proof, top game discs (GTA V, Spider-Man 2, FC 24), and pay-on-arrival!",
    related: [
      "How is my payout transferred?",
      "What documents do I need during pickup?",
      "Can I reschedule or cancel pickup?",
    ],
  },
  {
    keywords: ["reschedule", "cancel", "delay", "change time", "decline"],
    response:
      "You can reschedule or cancel your pickup anytime with ₹0 cancellation fee! You can manage this from your account or reach out directly to our team via WhatsApp or call.",
    related: [
      "What documents do I need during pickup?",
      "How is my payout transferred?",
      "Pickup service areas & timing",
    ],
  },
];

const DEFAULT_PRESET_QUESTIONS = [
  "What documents do I need during pickup?",
  "How is my phone's price calculated?",
  "Do you pay cash or UPI on spot?",
  "Can I sell a broken or dead phone?",
];

export function AIChatAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-welcome",
      sender: "bot",
      text: "How can I help you?",
      timestamp: "Just now",
      relatedQuestions: DEFAULT_PRESET_QUESTIONS,
      showContactActions: true,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Strict: The bot agent should ONLY be on customer pages, never on admin, agent, or partner portal pages
  const isCustomerPage =
    Boolean(pathname) &&
    !pathname?.startsWith("/admin") &&
    !pathname?.startsWith("/agent") &&
    !pathname?.startsWith("/partner");

  if (!isCustomerPage) {
    return null;
  }

  const findBestResponse = (query: string) => {
    const clean = query.toLowerCase().trim();

    // Specific high-priority check for documents / ID proof
    if (
      clean.includes("document") ||
      clean.includes("documents") ||
      clean.includes("id proof") ||
      clean.includes("aadhaar") ||
      clean.includes("voter") ||
      clean.includes("pan card") ||
      clean.includes("passport") ||
      (clean.includes("need") && clean.includes("pickup") && clean.includes("bring"))
    ) {
      return KNOWLEDGE_BASE[0];
    }

    let bestMatch = KNOWLEDGE_BASE[0];
    let maxScore = -1;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (clean.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (maxScore > 0) {
      return bestMatch;
    }

    return {
      response:
        "CashALL provides guaranteed top device valuations with 100% free doorstep pickup across Kolkata, Howrah, and Gorakhpur. You get instant UPI payment on the spot before handover! If you have any specific query, feel free to give us a direct call or chat with us on WhatsApp.",
      related: DEFAULT_PRESET_QUESTIONS,
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const match = findBestResponse(text);

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: match.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        relatedQuestions: match.related,
        showContactActions: true,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 font-sans flex flex-col items-end">
      
      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div className="mb-3 bg-white rounded-3xl border border-neutral-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.22)] w-[calc(100vw-2rem)] sm:w-[410px] max-h-[calc(100dvh-95px)] h-[520px] overflow-hidden flex flex-col animate-fadeIn">
          
          {/* HEADER */}
          <div className="bg-brand-black text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full border-2 border-brand-yellow p-0.5">
                <AarnaAvatar className="w-full h-full" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-brand-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white">Aarna</h4>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-brand-yellow text-black uppercase tracking-wider">
                    CashALL AI Support
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">Instant answers, valuation &amp; pickup help</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* MESSAGE LOG */}
          <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-4 bg-[#FAFAF9] text-xs">
            {messages.map((m) => (
              <div key={m.id} className="space-y-2.5">
                <div className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {m.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full shrink-0 mr-2 border border-brand-yellow/60 overflow-hidden">
                      <AarnaAvatar className="w-full h-full" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      m.sender === "user"
                        ? "bg-brand-black text-white rounded-br-none shadow-xs"
                        : "bg-white text-neutral-800 border border-neutral-200/80 shadow-xs rounded-bl-none whitespace-pre-line"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className={`block text-[9px] mt-1.5 ${m.sender === "user" ? "text-neutral-400" : "text-neutral-400"}`}>
                      {m.timestamp}
                    </span>
                  </div>
                </div>

                {/* POST-ANSWER ACTIONS (Related questions + Make Call & Chat on WhatsApp buttons) */}
                {m.sender === "bot" && (
                  <div className="pl-9 space-y-2">
                    
                    {/* RELATED QUESTIONS */}
                    {m.relatedQuestions && m.relatedQuestions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Related questions:
                        </span>
                        <div className="flex flex-col gap-1">
                          {m.relatedQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(q)}
                              className="text-left text-[11px] font-semibold py-1.5 px-2.5 rounded-xl bg-white hover:bg-amber-50 hover:border-amber-200 text-neutral-700 hover:text-black border border-neutral-200/70 transition-all flex items-center justify-between group"
                            >
                              <span>{q}</span>
                              <ArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-black shrink-0 ml-1" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CONTACT ACTIONS (Make a Call & WhatsApp) */}
                    {m.showContactActions && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href="tel:+917604092333"
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-[11px] font-bold transition-all shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>Make a Call</span>
                        </a>

                        <a
                          href="https://wa.me/917604092333?text=Hi%20Aarna,%20I%20have%20a%20question%20about%20selling%20my%20device%20on%20CashALL."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-white" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    )}

                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-7 h-7 rounded-full shrink-0 border border-brand-yellow/60 overflow-hidden">
                  <AarnaAvatar className="w-full h-full" />
                </div>
                <div className="bg-white border border-neutral-200/80 rounded-2xl rounded-bl-none px-3.5 py-2 text-neutral-400 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
          </div>

          {/* INPUT FORM */}
          <div className="p-3 bg-white border-t border-neutral-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Aarna anything..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-neutral-100 border border-neutral-200/80 focus:outline-none focus:border-brand-yellow focus:bg-white transition-all text-neutral-900"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2 rounded-xl bg-brand-yellow text-brand-black hover:bg-amber-400 transition-colors disabled:opacity-40 cursor-pointer"
                aria-label="Send query"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* FLOATING TRIGGER AVATAR BUTTON (Aarna - CashALL AI Support) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Aarna CashALL Support"
        className="group relative flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white text-neutral-900 border-2 border-brand-yellow shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_15px_35px_rgba(255,212,0,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer"
      >
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-brand-black flex items-center justify-center p-0.5 shrink-0">
          <AarnaAvatar className="w-full h-full" />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-400 animate-pulse" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[11px] font-black text-brand-black leading-tight flex items-center gap-1">
            <span>Aarna</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-[10px] text-neutral-500 font-medium">CashALL AI Support</div>
        </div>
      </button>

    </div>
  );
}
