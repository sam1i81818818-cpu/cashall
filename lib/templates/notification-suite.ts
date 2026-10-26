/**
 * CashALL Complete Notification Suite
 * Contains ready-to-send templates for SMS, WhatsApp, Web Push, and Email
 * Includes Festive (Durga Puja) campaign formats tailored for Kolkata/Bengal market
 */

export interface NotificationPayload {
  title?: string;
  message: string;
  variables?: Record<string, string>;
  ctaUrl?: string;
  ctaText?: string;
}

export const NOTIFICATION_SUITE = {
  // =========================================================================
  // 1. SMS NOTIFICATIONS (Transactional & DLT-Aligned)
  // =========================================================================
  sms: {
    // Customer Login OTP
    otpVerification: {
      templateId: "39beb731-de09-4a1d-bbbf-3cc9a12936f9",
      body: "Your CashALL OTP is {{otp}}. Do not share this code with anyone. Powered by Start Messaging.",
      description: "Live StartMessaging verified DLT template",
    },

    // Order Confirmation SMS
    orderConfirmed: {
      body: "Dear {{customerName}}, your CashALL pickup for {{deviceName}} (Order #{{orderNumber}}) is scheduled on {{pickupDate}} ({{pickupSlot}}). Track live: {{trackingUrl}}",
      description: "Sent right after customer books pickup",
    },

    // Agent Assigned SMS
    agentAssigned: {
      body: "Hello {{customerName}}, your CashALL executive {{agentName}} (Phone: {{agentPhone}}) has been assigned for your pickup today. Please keep your device and ID ready.",
      description: "Sent on morning of pickup day or when agent is dispatched",
    },

    // Instant Payment / Sale Completed SMS
    paymentCompleted: {
      body: "Success! ₹{{amount}} has been transferred instantly to your account for {{deviceName}} (Order #{{orderNumber}}). Thank you for choosing CashALL! Invoice: {{invoiceUrl}}",
      description: "Sent immediately after inspection & UPI payment",
    },

    // DURGA PUJA FESTIVE SPECIAL SMS (Campaign)
    durgaPujaSpecialOffer: {
      body: "Subho Nababarsho & Durga Puja Offer! Sell your old phone on CashALL & get up to ₹1,000 extra festive cash + free doorstep pickup in Kolkata & Howrah. Claim: {{campaignUrl}}",
      description: "Festive Durga Puja promotion SMS for Kolkata/Howrah audience",
    },
  },

  // =========================================================================
  // 2. WHATSAPP NOTIFICATIONS (High-Conversion Formats)
  // =========================================================================
  whatsapp: {
    // Durga Puja Pujo Bonus Broadcast
    durgaPujaFestivalCampaign: {
      header: "🌸 শারদীয়ার শুভেচ্ছা! CashALL Durga Puja Mega Cash Bonus 🪔",
      body: `নমস্কার {{customerName}},

এই দুর্গাপূজায় নতুন ফোন কেনার প্ল্যান করছেন? আপনার পুরানো ফোন ঘরে ফেলে না রেখে আজই বদলে নিন ক্যাশে!

🎉 *CashALL Durga Puja Special Boost:*
• যেকোনো স্মার্টফোনে অতিরিক্ত ₹500 - ₹1,500 পর্যন্ত পুজো বোনাস!
• সম্পূর্ণ ফ্রি ডোরস্টেপ পিকআপ (কলকাতা, হাওড়া, হুগলি ও ব্যারাকপুর)
• স্পট ভেরিফিকেশন ও হাতে হাতে ইনস্ট্যান্ট UPI/Bank পেমেন্ট!

👉 আপনার পুরানো ফোনের সর্বোচ্চ ভ্যালু দেখুন:
{{quoteUrl}}

শারদীয়ার প্রীতি ও শুভেচ্ছা!
*টিম CashALL - বিক্রি করুন স্মার্টলি*`,
      ctaText: "Check Best Price Now",
      ctaUrl: "https://www.cashall.in/sell-used-phone",
    },

    // Order Confirmation on WhatsApp
    orderConfirmed: {
      header: "📦 Order Confirmed - CashALL Doorstep Pickup",
      body: `Hi {{customerName}},

Your buyback order for *{{deviceName}}* has been confirmed!

📋 *Order Details:*
• *Order Number:* #{{orderNumber}}
• *Pickup Date:* {{pickupDate}}
• *Time Slot:* {{pickupSlot}}
• *Estimated Value:* ₹{{estimatedPrice}}
• *Pickup Address:* {{pickupAddress}}

Our verified executive will contact you prior to arrival.

🔗 *View / Manage Order:*
{{trackingUrl}}

Need help? Reply directly to this WhatsApp message.`,
    },

    // Instant Payout Receipt
    paymentTransferred: {
      header: "✅ Payment Successful - CashALL",
      body: `Congratulations {{customerName}}!

₹{{amount}} has been credited directly to your bank account / UPI for Order *#{{orderNumber}}*.

📱 *Device:* {{deviceName}}
🧾 *Payment Mode:* Instant UPI / IMPS
📄 *Official Tax Invoice:* {{invoiceUrl}}

Thank you for trusting CashALL!`,
    },
  },

  // =========================================================================
  // 3. WEB PUSH & IN-APP NOTIFICATIONS (Browser / Mobile Alerts)
  // =========================================================================
  push: {
    durgaPujaFlashSale: {
      title: "🪔 Durga Puja Dhamaka: Extra ₹1,000 Cash!",
      body: "Upgrade your phone this festive season! Get instant doorstep cash in Kolkata & Howrah before Ashtami.",
      icon: "/favicon.png",
      url: "/sell-used-phone?ref=pujo_bonus",
    },

    abandonedQuoteReminder: {
      title: "⚡ Still looking to sell your {{deviceName}}?",
      body: "Your quote of ₹{{estimatedPrice}} is reserved for the next 24 hours. Book doorstep pickup now!",
      icon: "/favicon.png",
      url: "/account?ref=quote_reminder",
    },

    sameDayPickupAvailable: {
      title: "🚀 Same-Day Pickup Available in your Pincode!",
      body: "CashALL executives are nearby. Sell your old phone & get paid within 2 hours.",
      icon: "/favicon.png",
      url: "/sell-used-phone",
    },
  },

  // =========================================================================
  // 4. FESTIVE EMAIL CAMPAIGNS (Durga Puja Special)
  // =========================================================================
  email: {
    durgaPujaSpecial: {
      subject: "🌸 Subho Sharadiya! Get up to ₹1,500 Extra on your Old Phone this Durga Puja",
      previewText: "Celebrate Durga Puja with extra cash! Free doorstep pickup across Kolkata.",
      headline: "Celebrate Pujo with CashALL Festive Upgrade",
      subheadline: "Turn your old devices into instant festive shopping cash at your doorstep.",
      benefits: [
        "Extra ₹500 - ₹1,500 Festive Bonus over market price",
        "Free 30-minute Doorstep Inspection in Kolkata, Howrah & Hooghly",
        "Zero-Hassle Instant UPI transfer before our agent leaves",
        "100% Data Destruction Undertaking Certificate included",
      ],
      ctaText: "Check Your Phone's Pujo Value",
      ctaUrl: "https://www.cashall.in/sell-used-phone?utm_source=pujo_email",
    },
  },
};
