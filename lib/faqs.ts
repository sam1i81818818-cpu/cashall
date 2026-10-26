// CashALL Master Knowledge Base & FAQ Engine (SEO, GEO & AEO)
// Comprehensive answers for every possible user question across recommerce, valuation, condition, privacy, and competitors.

export interface MasterFAQ {
  id: string;
  question: string;
  answer: string;
  category:
    | "BASICS"
    | "VALUATION"
    | "CONDITIONS"
    | "DEAD_DEVICES"
    | "LAPTOPS"
    | "TABLETS"
    | "DATA_PRIVACY"
    | "SAFETY_SCAMS"
    | "COMPETITORS"
    | "UPGRADE_TIMING"
    | "LOCAL_CITIES"
    | "GAMING";
  tags: string[];
}

export const MASTER_FAQS: MasterFAQ[] = [
  // ==========================================
  // 1. BASICS & PHONE BUYBACK ("WHAT IS")
  // ==========================================
  {
    id: "faq-what-is-buyback",
    question: "What is phone buyback and how does it work?",
    answer: "Phone buyback is a service where recommerce companies purchase your pre-owned, used, or broken smartphones directly for cash. Instead of finding a private buyer on a classifieds site, you select your device model online, answer a few diagnostic questions, receive an upfront guaranteed price, and get paid instantly upon doorstep verification.",
    category: "BASICS",
    tags: ["buyback", "what is", "how it works", "process", "resale"],
  },
  {
    id: "faq-what-is-cashall",
    question: "What is CashALL and what devices does CashALL buy?",
    answer: "CashALL (operated by Aarna Enterprise) is India's premier recommerce platform. CashALL buys old, used, broken, and non-working smartphones, laptops, and tablets across all major brands (Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Dell, HP, Lenovo, Asus, etc.) with free doorstep evaluation, certified data wiping, and instant UPI payouts. CashALL also offers PlayStation 5 console rentals.",
    category: "BASICS",
    tags: ["cashall", "about cashall", "devices", "services", "company"],
  },
  {
    id: "faq-buyback-vs-exchange",
    question: "What is the difference between phone buyback and phone exchange?",
    answer: "In a phone exchange (such as Amazon or Flipkart trade-ins), your old phone's value can only be applied as a discount toward purchasing a brand new device on their platform. In contrast, phone buyback on CashALL gives you 100% liquid cash transferred instantly via UPI or bank transfer, giving you complete freedom to spend or save the money however you choose.",
    category: "BASICS",
    tags: ["exchange vs buyback", "trade in", "cash vs exchange", "flipkart exchange", "amazon exchange"],
  },
  {
    id: "faq-refurbished-vs-used",
    question: "What is the difference between a used phone and a refurbished phone?",
    answer: "A used phone is a device sold in its current pre-owned condition without professional repairs or warranty. A refurbished phone is a used device that has undergone technical inspection, hardware repairs (e.g. new battery or display), sanitization, software re-imaging, and repackaging with a warranty before resale.",
    category: "BASICS",
    tags: ["refurbished", "used", "difference", "pre-owned"],
  },
  {
    id: "faq-what-is-ewaste",
    question: "What is electronic waste (e-waste) and how does CashALL help the environment?",
    answer: "E-waste refers to discarded electronic devices like phones, laptops, and chargers containing heavy metals (lead, mercury) and precious materials (gold, copper, lithium). When phones are left in landfills, toxic chemicals pollute groundwater. CashALL champions green recommerce by refurbishing working devices to extend their lifecycle and recycling non-repairable units through certified pollution-free e-waste recyclers in India.",
    category: "BASICS",
    tags: ["e-waste", "recycling", "environment", "green", "sustainability"],
  },

  // ==========================================
  // 2. PHONE VALUATION & DEPRECIATION ("HOW MUCH / WHY")
  // ==========================================
  {
    id: "faq-how-is-valuation-calculated",
    question: "How is my old phone's resale value calculated?",
    answer: "Phone resale value is determined by: 1) Device Brand & Model market demand, 2) Storage capacity & RAM variant, 3) Age & release year, 4) Physical screen condition (flawless, scratched, or cracked), 5) Body aesthetics (scratches, dents, bent chassis), 6) Hardware functionality (battery health, cameras, Face ID/fingerprint, speakers), and 7) Presence of original invoice, box, and charger.",
    category: "VALUATION",
    tags: ["valuation", "calculator", "price calculation", "worth", "market value"],
  },
  {
    id: "faq-why-phones-lose-value",
    question: "Why do phones lose value so fast (phone depreciation explained)?",
    answer: "Smartphones depreciate rapidly due to: 1) Annual release cycles from manufacturers launching newer processors and cameras, 2) Lithium-ion battery chemical degradation over time, 3) Software end-of-life when brands stop issuing OS updates, and 4) Cosmetic wear and tear. Android flagships typically lose 40–60% of their retail value within the first year, whereas Apple iPhones retain resale value better due to extended iOS update support and brand prestige.",
    category: "VALUATION",
    tags: ["depreciation", "why value drops", "value loss", "android vs iphone depreciation"],
  },
  {
    id: "faq-why-iphone-resale-high",
    question: "Why do Apple iPhones retain higher resale value than Android phones?",
    answer: "iPhones retain 15–25% higher resale value than Android competitors because Apple provides 5 to 7 years of iOS software and security updates, maintains a global supply chain for genuine replacement components, has slower product release fragmentation, and commands sustained secondary market customer demand worldwide.",
    category: "VALUATION",
    tags: ["iphone resale value", "apple value", "iphone depreciation", "android vs iphone"],
  },
  {
    id: "faq-how-much-is-my-phone-worth",
    question: "How much can I sell my old phone for on CashALL?",
    answer: "Your phone's value can range from ₹1,000 for older budget smartphones up to ₹1,00,000+ for recent flagship devices like the iPhone 15/16 Pro Max or Samsung Galaxy S24 Ultra. Enter your brand, model, and condition on cashall.in/sell to get an instant, transparent quote within 60 seconds with an extra 5% price bonus.",
    category: "VALUATION",
    tags: ["how much is phone worth", "phone price", "selling price", "instant quote"],
  },
  {
    id: "faq-battery-health-impact",
    question: "How does battery health affect my phone's resale price?",
    answer: "Batteries with 80% to 100% capacity receive the maximum valuation. If an iPhone battery has degraded below 80% or shows a 'Service' warning, or an Android battery drains rapidly, a modest deduction is applied to cover the cost of a certified replacement battery during refurbishment.",
    category: "VALUATION",
    tags: ["battery health", "battery deduction", "iphone battery health", "battery cycle"],
  },

  // ==========================================
  // 3. DEVICE CONDITIONS & DAMAGE ("CAN I")
  // ==========================================
  {
    id: "faq-can-i-sell-broken-screen",
    question: "Can I sell a phone with a cracked or broken screen?",
    answer: "Yes! CashALL buys phones with cracked outer glass, damaged touch digitizers, broken LCDs, and black ink blotches. During online valuation, simply select 'Cracked Screen' or 'Display Damaged' to get an upfront, honest quote without any surprises.",
    category: "CONDITIONS",
    tags: ["broken screen", "cracked display", "touch not working", "damaged glass"],
  },
  {
    id: "faq-green-line-amoled",
    question: "Can I sell a phone with green or pink lines on the AMOLED display?",
    answer: "Yes. AMOLED vertical green or pink lines are common hardware display faults across Samsung, OnePlus, and other brands. CashALL buys devices with screen line issues under our display damaged condition tier.",
    category: "CONDITIONS",
    tags: ["green line", "pink line", "amoled lines", "display line problem"],
  },
  {
    id: "faq-without-bill-box",
    question: "Can I sell a phone without the original bill, box, or charger?",
    answer: "Yes! An original bill, box, or charging brick is completely optional. While having original accessories grants a price bonus, you can still sell your device without them by presenting one valid Government ID proof (Aadhaar, Voter ID, or Driving License) for statutory ownership verification.",
    category: "CONDITIONS",
    tags: ["without bill", "without box", "without charger", "no invoice", "missing accessories"],
  },
  {
    id: "faq-dead-water-damaged",
    question: "Can I sell a dead phone that doesn't turn on or has water damage?",
    answer: "Yes. CashALL accepts dead, non-booting, and liquid-damaged smartphones and laptops. During valuation, select 'Device does not turn on' to receive a competitive salvage quote for spare parts and certified component recycling.",
    category: "DEAD_DEVICES",
    tags: ["dead phone", "water damaged", "wont turn on", "not switching on", "salvage"],
  },
  {
    id: "faq-faulty-components",
    question: "Can I sell a phone with camera, speaker, or charging port issues?",
    answer: "Yes. CashALL accepts phones with hardware defects including blurry/shaking cameras, broken Face ID/fingerprint sensors, distorted speakers, faulty microphones, or loose charging ports. Simply declare the defect during the diagnostic checklist.",
    category: "CONDITIONS",
    tags: ["camera problem", "speaker issue", "charging problem", "microphone faulty", "face id"],
  },
  {
    id: "faq-locked-financed-phones",
    question: "Can I sell a locked, blacklisted, or EMI-financed phone on CashALL?",
    answer: "No. CashALL strictly adheres to anti-theft and statutory compliance laws. We do not purchase stolen, blacklisted, iCloud activation locked, or Google FRP locked phones. Devices under active retail financing (e.g. Bajaj Finserv, TVS Credit) must have their loans fully paid and NOC cleared before sale.",
    category: "CONDITIONS",
    tags: ["locked phone", "emi pending", "financed phone", "icloud locked", "stolen phone"],
  },

  // ==========================================
  // 4. DATA PRIVACY & PREPARATION CHECKLIST
  // ==========================================
  {
    id: "faq-what-to-do-before-selling",
    question: "What is the checklist of things to do before selling my phone?",
    answer: "Before handing over your phone: 1) Backup all photos, chats, and files to cloud or PC, 2) Remove SIM card and MicroSD memory card, 3) Log out of all Google, Apple, and Samsung accounts, 4) Turn off 'Find My iPhone' or 'Find My Device', 5) Charge the battery to at least 50% for inspection, and 6) Have your Government ID ready.",
    category: "DATA_PRIVACY",
    tags: ["checklist", "prepare phone", "before selling", "backup", "remove sim"],
  },
  {
    id: "faq-how-to-wipe-data",
    question: "How do I securely erase my data before selling my phone?",
    answer: "To securely wipe an iPhone: Go to Settings > General > Transfer or Reset iPhone > Erase All Content and Settings. To securely wipe an Android: Remove your Google account under Settings > Accounts, then navigate to Settings > System > Reset Options > Erase All Data (Factory Reset). Our field executive will assist you with this directly at your doorstep.",
    category: "DATA_PRIVACY",
    tags: ["factory reset", "wipe data", "erase phone", "how to reset"],
  },
  {
    id: "faq-is-factory-reset-enough",
    question: "Is a factory data reset enough to protect my private photos and data?",
    answer: "Yes. Modern smartphones running iOS and modern Android (Android 10+) use hardware-backed disk encryption by default. When you perform a factory reset, the cryptographic master key is destroyed, rendering any residual raw flash memory completely unrecoverable, even with forensic data recovery software.",
    category: "DATA_PRIVACY",
    tags: ["is factory reset safe", "data recovery risk", "encryption", "privacy"],
  },
  {
    id: "faq-remove-google-apple-account",
    question: "Why must I remove my Google Account or Apple ID before selling?",
    answer: "Both Google (Factory Reset Protection / FRP) and Apple (iCloud Activation Lock) have anti-theft security systems that lock a device to the original owner's credentials even after a wipe. If accounts are not removed, the phone becomes an unusable brick for any future buyer.",
    category: "DATA_PRIVACY",
    tags: ["remove google account", "remove apple id", "activation lock", "frp lock"],
  },

  // ==========================================
  // 5. SCAMS & SAFETY (CLASSIFIEDS VS DIRECT BUYBACK)
  // ==========================================
  {
    id: "faq-avoid-phone-scams",
    question: "What are common online phone selling scams and how do I avoid them?",
    answer: "Common scams on unverified peer-to-peer marketplaces and classified apps include: 1) Fake payment screenshots showing bogus transfer receipts, 2) Reverse UPI QR code scams where the buyer asks you to scan a QR code to 'receive' money (which actually debits your account), 3) Meeting strangers in unsafe areas, and 4) Bounced cheques. With CashALL, you deal directly with a verified corporate company with instant on-the-spot UPI credit before handover.",
    category: "SAFETY_SCAMS",
    tags: ["scams", "classified scam", "fake upi screenshot", "qr code scam", "safety"],
  },
  {
    id: "faq-imei-verification",
    question: "What is an IMEI check and why does CashALL verify it?",
    answer: "An IMEI (International Mobile Equipment Identity) is a unique 15-digit identifier assigned to every cellular device. CashALL checks the IMEI to confirm the exact model, storage capacity, warranty status, and ensure the device is not reported stolen or blacklisted on national police registers (CEIR). You can find your IMEI by dialing *#06#.",
    category: "SAFETY_SCAMS",
    tags: ["imei check", "imei verification", "ceir", "stolen check", "authenticity"],
  },

  // ==========================================
  // 6. SELLING & PLATFORM COMPARISONS
  // ==========================================
  {
    id: "faq-cashall-vs-competitors",
    question: "Why choose CashALL over other online buyback portals?",
    answer: "CashALL offers 4 distinct advantages: 1) Up to 5% higher valuation payouts, 2) Zero doorstep pickup fees (other portals often deduct ₹100–₹199 convenience charges), 3) Transparent diagnostics without aggressive last-minute reductions for micro-scratches, and 4) Direct human phone & WhatsApp customer support (+91 7604092333) instead of automated bots.",
    category: "COMPETITORS",
    tags: ["platform comparison", "why choose cashall", "best buyback portal", "higher price"],
  },
  {
    id: "faq-cashall-vs-regional",
    question: "How does CashALL compare to other regional buyback services?",
    answer: "Unlike other regional aggregators that operate with limited logistics, CashALL provides rapid doorstep execution (2 to 4 hours in Kolkata), broader catalog coverage (1,000+ smartphones, laptops, and tablets), certified on-site data wiping assistance, and instant UPI settlement before the technician leaves your doorstep.",
    category: "COMPETITORS",
    tags: ["regional buyback", "fast doorstep pickup", "kolkata recommerce"],
  },
  {
    id: "faq-cashall-vs-affiliates",
    question: "What is the difference between direct buyback and affiliate coupon sites?",
    answer: "Affiliate websites redirect users to third parties rather than conducting evaluations directly. CashALL is a direct recommerce platform operating its own fleet of verified evaluation executives, ensuring guaranteed pricing, instant on-the-spot UPI payment, and zero middleman delays.",
    category: "COMPETITORS",
    tags: ["direct buyback", "affiliate vs direct", "verified executives"],
  },
  {
    id: "faq-cashall-vs-offline-shops",
    question: "Why choose CashALL over selling at local mobile shops or Chandni Chowk in Kolkata?",
    answer: "Selling at offline markets like Chandni Chowk (E-Mall, Princep Street) involves traveling through traffic, aggressive haggling, risk of unverified cash notes, and zero data wiping security. CashALL provides higher transparent valuations, free doorstep pickup at your home or office, and instant UPI payment.",
    category: "COMPETITORS",
    tags: ["offline vs online", "chandni chowk kolkata", "local shop", "e mall"],
  },

  // ==========================================
  // 7. LAPTOPS, MACBOOKS & TABLETS
  // ==========================================
  {
    id: "faq-sell-old-laptop",
    question: "Can I sell my old Windows laptop or Apple MacBook on CashALL?",
    answer: "Yes! CashALL buys laptops from Apple (MacBook Air, MacBook Pro, Intel, M1, M2, M3, M4), Dell (XPS, Inspiron, Alienware), HP (Pavilion, Envy, Spectre, Omen), Lenovo (ThinkPad, IdeaPad, Legion), Asus (ROG, TUF, ZenBook), Acer, and MSI. We evaluate processor generation, RAM, SSD, dedicated GPU, battery health, and body condition.",
    category: "LAPTOPS",
    tags: ["sell laptop", "sell macbook", "sell dell laptop", "sell hp laptop", "laptop buyback"],
  },
  {
    id: "faq-broken-dead-laptop",
    question: "Can I sell a broken, dead, or water-damaged laptop?",
    answer: "Yes. CashALL accepts laptops with broken screens, non-working keyboards, damaged hinges, dead batteries, motherboard short-circuits, or water damage for parts recovery and certified recycling.",
    category: "LAPTOPS",
    tags: ["broken laptop", "dead laptop", "laptop screen broken", "water damaged laptop"],
  },
  {
    id: "faq-how-to-wipe-laptop",
    question: "How do I erase and factory reset a laptop before selling?",
    answer: "On Windows 10/11: Go to Settings > System > Recovery > Reset this PC > Remove Everything > Clean the drive. On macOS: System Settings > General > Transfer or Reset > Erase All Content and Settings (Apple Silicon / T2 chip) or restart into Recovery Mode and use Disk Utility.",
    category: "LAPTOPS",
    tags: ["factory reset laptop", "wipe laptop", "format laptop", "macbook reset"],
  },
  {
    id: "faq-sell-tablets-ipads",
    question: "Can I sell old Apple iPads and Android tablets on CashALL?",
    answer: "Yes! CashALL purchases all iPad generations (iPad base, Mini, Air, Pro with M-series chips) and Android tablets from Samsung (Galaxy Tab S & A series), Lenovo, and Xiaomi. Instant valuation and free doorstep pickup are provided.",
    category: "TABLETS",
    tags: ["sell ipad", "sell tablet", "ipad resale value", "samsung tablet"],
  },

  // ==========================================
  // 8. DOORSTEP PICKUP, FEES & PAYMENT
  // ==========================================
  {
    id: "faq-pickup-fees-charges",
    question: "Does CashALL charge any doorstep inspection or convenience fee?",
    answer: "No. Doorstep evaluation, device pickup, and order cancellation are 100% free with zero convenience charges. Unlike competitors that deduct ₹100–₹199 convenience fees, you receive the full quoted amount directly in your bank account.",
    category: "VALUATION",
    tags: ["pickup fee", "convenience fee", "hidden charges", "free pickup"],
  },
  {
    id: "faq-pickup-time-speed",
    question: "How fast is doorstep pickup and inspection?",
    answer: "In central Kolkata, Salt Lake, and New Town, our verified executives arrive within 2 to 4 hours of quote confirmation. You can also pick any specific date and time slot that fits your schedule.",
    category: "VALUATION",
    tags: ["pickup speed", "how fast", "same day pickup", "2 hour pickup"],
  },
  {
    id: "faq-doorstep-rejection-cancellation",
    question: "What happens if I don't like the technician's revised price at my doorstep?",
    answer: "You are under zero obligation to sell. If any physical discrepancy is found and you do not agree with the revised quote, you can cancel immediately with ₹0 penalty, zero cancellation fee, and zero pressure.",
    category: "VALUATION",
    tags: ["cancellation", "reject quote", "free cancellation", "refusal"],
  },
  {
    id: "faq-payment-modes",
    question: "What payment methods are supported by CashALL?",
    answer: "CashALL transfers payment instantly on the spot via UPI (Google Pay, PhonePe, Paytm, BHIM) or direct IMPS bank transfer. Payment is verified and credited before the technician takes custody of your device.",
    category: "VALUATION",
    tags: ["payment methods", "upi", "google pay", "phonepe", "bank transfer", "cash"],
  },

  // ==========================================
  // 9. LOCAL CITIES & GEOGRAPHY
  // ==========================================
  {
    id: "faq-kolkata-howrah-coverage",
    question: "Which areas in Kolkata and Howrah are serviced by CashALL?",
    answer: "CashALL provides express same-day doorstep pickup across all major Kolkata hubs: Salt Lake (Sector 1–5), New Town, Rajarhat, Park Street, Ballygunge, Gariahat, Jadavpur, Garia, Behala, Taratala, Alipore, Shyambazar, Dum Dum, Ultadanga, Howrah (Shibpur, Salkia, Bally, Liluah), Barrackpore, and Hooghly across 100+ PIN codes (700001–700108).",
    category: "LOCAL_CITIES",
    tags: ["kolkata", "howrah", "salt lake", "new town", "behala", "jadavpur", "dum dum"],
  },
  {
    id: "faq-other-cities-serviceability",
    question: "Does CashALL service cities outside Kolkata like Ranchi, Patna, Gorakhpur, and Ballia?",
    answer: "Yes! CashALL is actively expanding across Eastern and Northern India with dedicated service centers and logistics partners operating in Ranchi (Jharkhand), Patna (Bihar), Gorakhpur (Uttar Pradesh), Ballia (Uttar Pradesh), and West Bengal urban districts.",
    category: "LOCAL_CITIES",
    tags: ["ranchi", "jharkhand", "patna", "gorakhpur", "ballia", "serviceable cities", "cities"],
  },

  // ==========================================
  // 10. UPGRADE & TIMING ("WHEN / SHOULD I")
  // ==========================================
  {
    id: "faq-best-time-to-sell",
    question: "When is the best time to sell my old phone for the highest price?",
    answer: "The optimal time to sell is 2 to 4 weeks BEFORE the official launch of the next generation model (e.g. sell your iPhone in August before the September Apple Keynote, or your Galaxy in December before the January Unpacked event). Selling before festive sales like Diwali and Durga Puja also yields peak resale value before market saturation.",
    category: "UPGRADE_TIMING",
    tags: ["best time to sell", "when to sell", "upgrade timing", "diwali", "durga puja"],
  },
  {
    id: "faq-sell-or-keep-drawer",
    question: "Should I keep my old phone as a backup or sell it?",
    answer: "Unless you have an immediate secondary need, keeping an old phone sitting in a drawer causes it to lose 5% to 10% of its value every month while its lithium battery gradually chemically degrades. Selling it immediately on CashALL turns idle electronics into ready cash and prevents toxic e-waste.",
    category: "UPGRADE_TIMING",
    tags: ["sell or keep", "unused phone", "sitting in drawer", "declutter", "backup phone"],
  },

  // ==========================================
  // 11. GAMING CONSOLES (PS5)
  // ==========================================
  {
    id: "faq-ps5-rentals-buyback",
    question: "Can I rent or sell a PlayStation 5 (PS5) on CashALL?",
    answer: "Yes! CashALL provides PlayStation 5 (PS5) console rentals across Kolkata with 2 DualSense wireless controllers, top 4K games (GTA V, Spider-Man 2, FC 24, God of War Ragnarok), and free doorstep delivery and setup. We also purchase used PS4, PS5, and Xbox consoles for instant cash.",
    category: "GAMING",
    tags: ["ps5 rent", "rent playstation 5", "sell ps5", "console rental kolkata", "gaming"],
  },
];
