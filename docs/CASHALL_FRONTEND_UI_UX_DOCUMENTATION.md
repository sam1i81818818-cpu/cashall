# CashALL — Frontend & UI/UX Master Documentation & System Inventory

> **Document Type:** Frontend Architecture, UI/UX Specification & Visual Asset Inventory  
> **Platform Version:** CashALL Recommerce Web & Hybrid System v1.0.0 (Production)  
> **Tech Stack:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3.4, Framer Motion 11, Lucide React  
> **Target Audience:** Frontend Engineers, UI/UX Designers, Product Managers, QA & Operations  

---

## 1. Executive Summary & Frontend Architecture

CashALL is India’s enterprise-grade electronics recommerce and gaming rental platform operating in West Bengal and Eastern India (Kolkata, Howrah, Hooghly, Barrackpore, Gorakhpur, Patna, Ranchi). The platform enables instantaneous doorstep buyback evaluation, algorithmic valuation deduction, paperless KYC, and direct UPI/IMPS spot payouts, alongside a dedicated PlayStation 5 console and game CD rental service.

### 1.1 Technology Stack Inventory
* **Core Framework:** Next.js 14.2.15 (App Router with Server & Client Component separation).
* **Language:** TypeScript 5.6.3 with strict type checking.
* **Styling & Design System:** Tailwind CSS 3.4.14 with tailored theme tokens (`tailwind.config.ts`, `globals.css`).
* **Animation & Micro-Interactions:** `framer-motion` (v11.11.9) for spring transitions, sticky bottom sheets, modal backdrops, and interactive accordions.
* **Iconography:** `lucide-react` (v0.453.0) — over 50 semantic SVG icons used across navigation, diagnostics, and badges.
* **PDF & Bill of Sale Generation:** `@react-pdf/renderer` (v4.6.1) for on-the-fly client/server rendering of legal sale receipts and rental undertakings.
* **Client-Side Optical Character Recognition (OCR):** `tesseract.js` (v7.0.0) for field agent instant UTR/Amount extraction from UPI payout transaction screenshots.
* **Audio & Audio Alerts:** Web Audio API & HTML5 Audio synthesis for melodious chime confirmations, bell rings, and looping siren buzzer alarms for real-time leads.
* **Image Delivery:** Next/Image with WebP modern compression, dynamic catalog fallback resolvers, and SVG vectors.

---

## 2. Global Theme, Design System & Shared Component Tokens

### 2.1 Color Palette
CashALL utilizes a vibrant, high-trust visual palette designed to inspire security, transparency, and urgency:
* **Primary Brand Accent (Yellow/Amber):**
  * `brand-yellow`: `#FBBF24` (Amber 400)
  * `brand-yellowDark`: `#F59E0B` (Amber 500)
  * `brand-yellowLight`: `#FEF3C7` (Amber 100)
  * `shadow-yellowGlow`: `0 10px 25px -3px rgba(245, 158, 11, 0.35)`
* **Neutral Dark & Text:**
  * `brand-black`: `#0F172A` (Slate 900)
  * `brand-surface`: `#1E293B` (Slate 800)
  * `brand-muted`: `#64748B` (Slate 500)
  * `brand-border`: `#E2E8F0` (Slate 200)
  * `brand-bg`: `#F8FAFC` (Slate 50)
* **Status & Feedback Accents:**
  * **Success/Trust:** `#10B981` (Emerald 500) / `#ECFDF5` (Emerald 50)
  * **Warning/Alert:** `#F59E0B` (Amber 500) / `#FFFBEB` (Amber 50)
  * **Destructive/Error:** `#EF4444` (Red 500) / `#FEF2F2` (Red 50)
  * **Info/Identity:** `#3B82F6` (Blue 500) / `#EFF6FF` (Blue 50)
  * **Gaming/PS5 Rental:** `#6366F1` (Indigo 500) / `#4F46E5` (Indigo 600)

### 2.2 Global Layout & Navigation Elements

#### `Header.tsx` (`components/layout/Header.tsx`)
* **Desktop Sticky Topbar:**
  * Brand Logo with transparent WebP rendering and tagline *"Instant Cash at Doorstep"*.
  * **Interactive Location Badge:** Shows current selected city/state (e.g., *"Kolkata, West Bengal"*). Clicking launches `LocationModal.tsx` for fast city/region switching.
  * **Global Search Trigger:** Instant access to `DeviceSearch.tsx`.
  * **Navigation Links:** Sell Phone, Sell Laptop, Sell Tablet, PS5 Rental, Reviews, FAQ, Track Order.
  * **Multi-Device Cart Indicator:** Floating cart button showing real-time badge counter of devices added to buyback basket.
  * **Help & Support Icon:** Opens `NeedHelpModal.tsx` with instant WhatsApp, Direct Call, and FAQ shortcuts.
  * **Customer Profile Button:** Displays customer initials or *"Login / My Account"*, opening `CustomerAuthModal.tsx`.
* **Mobile View:**
  * Sticky compact bar with hamburger menu toggle.
  * Slide-in mobile drawer containing all navigation links, state selection, active order tracking, and call-support CTA.

#### `Footer.tsx` (`components/layout/Footer.tsx`)
* Multi-column comprehensive recommerce directory:
  * **Column 1:** Brand overview, ISO 27001 / NIST 800-88 compliance assurance, corporate address in Kolkata.
  * **Column 2 (Sell Categories):** Quick links to Sell iPhone, Sell Samsung, Sell MacBook, Sell iPad, Sell Dell Laptop, Sell HP Laptop, PS5 Rental.
  * **Column 3 (Serviceable Locations):** Kolkata, Howrah, Hooghly, Barrackpore, Salt Lake, New Town, Gorakhpur, Patna, Ranchi.
  * **Column 4 (Company & Legal):** About Us, Contact, Privacy Policy, Terms of Service, Cancellation Policy, Doorstep Evaluation Policy, Cookie Policy, Verified Legal Documents.
  * **Column 5 (Download Apps):** Direct APK links for CashALL Admin, CashALL Field Agent, and CashALL Telecaller apps.
  * **Bottom Bar:** Copyright, payment method badges (UPI, IMPS, Visa, Mastercard), and SSL Encryption assurance badge.

### 2.3 Shared UI Component Library
* `Button.tsx`: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`), sizes (`sm`, `md`, `lg`), loading spinner states, fullWidth prop.
* `Badge.tsx`: Pill badges with semantic variants (`success`, `warning`, `danger`, `info`, `neutral`, `yellow`).
* `Modal.tsx`: Framer-motion animated backdrop and dialog container with escape key listener and focus-trap.
* `SoundControlBadge.tsx`: Floating sound toggle enabling or muting app-wide chimes and siren alarms.
* `LiveUpdateToast.tsx`: Non-intrusive floating snackbar alerting field agents/admins of new incoming leads.
* `CookieConsentBanner.tsx`: GDPR & DPDP Act compliant cookie notification with Accept/Decline actions.
* `SupportWidget.tsx`: Persistent floating bottom-right support bubble with pulsing presence indicator.

---

## 3. Customer Portal — Complete UI/UX Specification

### 3.1 Homepage (`/` — `app/page.tsx`)
1. **Hero Section (`Hero.tsx` & `HeroLocationBar.tsx`):**
   * Prominent headline: *"Sell Your Old Phone & Laptop for Instant Cash at Doorstep"*.
   * Animated value badges: *"Highest Valuation"*, *"100% Data Destruction"*, *"Instant UPI Payout"*.
   * **Hero Location Bar:** Immediate visual confirmation of serviceable pincode / city with one-click change trigger.
   * High-definition 3D product render banner (`hero-banner.webp`).
2. **Device Instant Search Bar (`DeviceSearch.tsx`):**
   * Real-time debounced fuzzy search input across 1,000+ smartphones, laptops, and tablets.
   * Dropdown results group matching items with brand logo, model thumbnail, category badge, and base price estimate.
3. **Core Category Grid (`CategoryCards.tsx`):**
   * 4 Interactive 3D glassmorphic cards:
     * **Sell Old Mobile:** Highlighting iPhones, Samsung Galaxies, OnePlus, Xiaomi.
     * **Sell Old Laptop:** Highlighting MacBooks, Dell XPS, HP Pavilion, Lenovo ThinkPad.
     * **Sell Old Tablet:** Highlighting Apple iPads, Samsung Galaxy Tabs.
     * **Rent PS5 Console:** Highlighting PlayStation 5 4K Console + DualSense controllers + Game CDs.
4. **Promotional Banner Carousel (`AdCarousel.tsx`):**
   * Auto-sliding promotional banners showcasing festive exchange bonuses, corporate buyback rates, and zero-cancellation fee guarantees.
5. **Popular Brands Section (`PopularBrands.tsx`):**
   * Interactive grid with SVG vector logos: Apple, Samsung, OnePlus, Xiaomi, Vivo, Oppo, Realme, Google Pixel, Motorola, Dell, HP, Lenovo, Asus, Acer.
6. **How It Works — 3 Simple Steps (`HowItWorks.tsx`):**
   * Step 1: Check Price (Select brand, model, and condition to get instant valuation).
   * Step 2: Free Doorstep Pickup (Pick a convenient date and time slot).
   * Step 3: Spot Payment (Executive inspects device and transfers cash/UPI on the spot).
7. **Why CashALL Grid (`WhyCashALL.tsx`):**
   * 6 Pillars of trust: Maximum Value Algorithm, Free Doorstep Service, Instant Spot Payout, NIST 800-88 Data Sanitization, Legal Bill of Sale, Zero Bargaining Guarantee.
8. **"Be Smart, Sell Smart" Section (`BeSmartSellSmartSection.tsx`):**
   * Visual comparison highlighting risks of unorganized offline shops (data leakage, price dropping, fake UPI) vs. CashALL Certified Recommerce.
9. **Recommerce SEO & Educational Block (`RecommerceSeoBlock.tsx`):**
   * Deep technical and market text optimized for Google crawlers, Answer Engines (AEO), and LLM knowledge graphs.
10. **Customer Reviews & Video Reel Section (`CustomerReviewsSection.tsx`):**
    * Aggregate rating bar: 4.8 / 5.0 across 199+ completed orders.
    * Real customer video testimonials in mobile reel format with play modal (`VideoPlayerModal.tsx`).
11. **FAQ Accordion (`FAQAccordion.tsx`):**
    * Expandable questions covering price deductions, payment modes, valid ID requirements, and pickup rescheduling.
12. **Final Call-to-Action Bar (`FinalCTA.tsx`):**
    * High-visibility sticky/scroll section prompting immediate valuation calculation.

---

### 3.2 Sell Flow — Category, Brand & Model Selection

#### Routes:
* Category selection: `/sell`
* Mobile models: `/sell/mobile`, `/sell-old-mobile-phone`, `/sell-old-phone`, `/sell-used-phone`
* Laptop models: `/sell/laptop`, `/sell-old-laptop`
* Tablet models: `/sell/tablet`, `/sell-old-tablet`
* Brand pages: `/sell/[category]/[brand]`
* Model overview & Variant Picker: `/sell/[category]/[brand]/[model]`

#### UI/UX Components & Features:
* **Brand Alphabetical & Popular Filter:** Search bar to filter brands instantly.
* **Model Grid:** Cards displaying model photo, release year, processor/chipset, and starting valuation.
* **Variant Selector Drawer / Pills:**
  * For Mobiles/Tablets: Storage capacity (e.g., 64 GB, 128 GB, 256 GB, 512 GB, 1 TB).
  * For Laptops (`lib/laptop-specs.ts`): Dynamic spec matrix mapping processor (Intel i3/i5/i7/i9, AMD Ryzen, Apple M1/M2/M3/M4), RAM (8 GB to 128 GB), and SSD/HDD storage options.
* **"Get Exact Value" Primary CTA:** Routes customer into the automated diagnostic question flow.

---

### 3.3 Dynamic Device Assessment Engine (The 6-Step QC Flow)

#### Route:
`/sell/[category]/[brand]/[model]/assess?variantId=[id]`

#### Key Components:
* `AssessmentHeader.tsx`: Progress bar indicating active step (Step 1 to 6) and device thumbnail.
* `AssessmentSidebar.tsx`: Sticky live price calculation drawer showing starting base price and real-time deductions based on selected answers.
* `VisualOptionCard.tsx`: Interactive option card featuring custom SVG hardware illustrations.
* `MobileIllustrations.tsx`, `LaptopIllustrations.tsx`, `TabletIllustrations.tsx`: Custom vector artwork for screen scratches, dents, camera lens damage, cracked hinge, keyboard defects, and missing accessories.
* `RadioQuestionItem.tsx`: High-contrast radio toggle list for yes/no operational checks.

#### Diagnostic Steps:
1. **Step 1: Core Operational Status**
   * Does device switch on and stay on without charger?
   * Can you make and receive phone calls (for mobile/cellular devices)?
   * Is the touch screen working properly across all areas?
2. **Step 2: Screen & Display Condition**
   * Flawless (No scratches, original factory panel).
   * Minor Scratches (1-2 hairline scratches invisible when screen is on).
   * Heavy Scratches or Glass Cracks.
   * Display bleeding, vertical/horizontal green/pink lines, dead pixels, or touch non-responsive spots.
3. **Step 3: Body & Physical Cosmetics**
   * Flawless (Zero scratches, like new).
   * Light Scratches (Minor signs of normal usage).
   * Dents or Chipped Edges.
   * Bent Chassis, Broken Back Glass, or Loose Hinges (for laptops).
4. **Step 4: Functional Hardware & Sensors**
   * Multi-select defect tiles: Front Camera, Rear Camera, Speaker/Earpiece, Microphone, Face ID / Fingerprint Sensor, Battery Health (<80%), WiFi / Bluetooth, Volume / Power Buttons.
5. **Step 5: Original Accessories & Inclusions**
   * Original Brand Charger & Cable.
   * Original Box with Matching IMEI/Serial Number.
   * Valid Tax Invoice / Purchase Bill with matching details.
6. **Step 6: Age of Device & Warranty**
   * Under 3 Months (Valid invoice required for active warranty claim).
   * 3 to 6 Months.
   * 6 to 11 Months.
   * Above 11 Months (Out of warranty).

#### Price Unlock Modal (`PriceUnlockModal.tsx`):
* Once Step 6 is submitted, the customer is presented with a sleek gated modal: *"Your Exact Valuation is Ready"*.
* Requires input of Customer Mobile Number and Name.
* Dispatches Meta Lead event in background.
* Saves quote to local storage and backend API, then redirects to `/quote/[quoteId]`.

---

### 3.4 Instant Quote Result Page (`/quote/[quoteId]`)

#### UI/UX Highlights:
* **Price Reveal Banner:** Large bold typography displaying algorithmic valuation (e.g., `₹42,500`).
* **7-Day Price Lock Guarantee Badge:** Reassuring the user that the quoted price will not change within 7 days.
* **Price Validity Countdown Timer:** Live ticking timer creating healthy conversion urgency.
* **Transparency Deduction Breakdown Accordion:**
  * Base Market Value
  * Itemized deductions for cosmetic wear, screen state, or missing charger.
  * Final Net Payout calculation.
* **Action CTAs:**
  * **"Book Free Doorstep Pickup" (Primary Glow Button):** Prompts OTP auth if not logged in, then opens Checkout.
  * **"Decline / Cancel Quote":** Triggers cancellation modal with reason selector (`Customer declined quote`, `Price too low`, etc.).
  * **"Add Another Device to Cart":** Saves current quote to `CartDrawer.tsx` and redirects to `/sell`.

---

### 3.5 Multi-Device Cart Drawer (`CartDrawer.tsx`)
* Slide-out right panel accessible anywhere on the site.
* Displays list of all devices customer intends to sell in one go.
* Shows individual device photos, specs, and quoted prices.
* Cumulative total payout badge (e.g., *"Total Cash Payout: ₹78,000 for 2 Devices"*).
* Individual "Remove" action and "Proceed to Combined Checkout" button.

---

### 3.6 Checkout & Pickup Scheduling (`/checkout/pickup`)

#### Interactive Flow & UI Sections:
1. **Live Pincode Serviceability Engine:**
   * PIN code input field with real-time verification against CashALL's 217 verified West Bengal PIN master.
   * If serviceable: Displays green checkmark with district confirmation (*"Kolkata - 700029 Serviced by Central Hub"*).
   * If non-serviceable: Displays amber alert with link to request callback or view expandable list of all serviced districts.
2. **Customer Address Input Form:**
   * Full Name, Phone Number, Alternative Contact, Email.
   * Flat / House No., Apartment Name, Street Address, Landmark.
   * State (West Bengal, Bihar, Jharkhand, UP, etc.) and District.
   * Auto-saves to browser storage for returning customers.
3. **Pickup Date & Time Slot Selector:**
   * Dynamic preset tabs: **Today**, **Tomorrow**, **Day After Tomorrow**, and **Custom Date Picker**.
   * Real-time cutoff awareness: If current time is past 1:00 PM, morning slots are automatically disabled.
   * Slot options: `10:00 AM – 01:00 PM`, `01:00 PM – 04:00 PM`, `04:00 PM – 07:00 PM`.
4. **Preferred Payout Method Selector:**
   * **UPI Transfer:** Field for VPA (e.g., `user@okhdfcbank`) with regex validation.
   * **Direct Bank Transfer (IMPS/NEFT):** Account Number, Confirm Account Number, IFSC Code.
   * **E-Commerce Gift Cards (Amazon/Flipkart):** Offering 3% additional festive bonus payout.
5. **Security & DPDP Act Data Undertaking:**
   * Checkbox confirming customer is the legitimate owner and device data has been unlinked/backed up.
   * Interactive modal (`LegalSellerAgreementModal`) detailing legal indemnification under Indian penal law.
6. **"Confirm Doorstep Pickup" Button:**
   * High-contrast button with loading spinner, preventing accidental double submissions.
   * Dispatches Meta Purchase & Lead pixels and routes to `/order/[orderId]`.

---

### 3.7 Order Confirmation & Live Tracking (`/order/[orderId]` & `/track/[orderId]`)

#### UI/UX Features:
* **Order Reference Pill:** e.g., `#CA89234` with one-tap copy button.
* **Visual Status Stepper:**
  1. *Pickup Scheduled* (Date, time slot, address).
  2. *Agent Assigned* (Executive photo, name, phone, verified badge).
  3. *Out for Pickup* (Live status update).
  4. *Physical Evaluation & QC Completed*.
  5. *Payout Dispatched & Transaction Receipt Generated*.
* **Assigned Field Executive Card:**
  * Quick "Call Executive" button (`tel:...`).
  * Real-time assigned agent notification.
* **Interactive Reschedule Modal (`RescheduleModal.tsx`):**
  * Allows customer to change pickup date and time slot without contacting support.
* **Order Cancellation Trigger:**
  * Allows customer to cancel booking with feedback options.
* **Download Digital Sale Receipt:** Direct link to `/receipt/[orderId]`.

---

### 3.8 PlayStation 5 Console & Game Rental Portal (`/rent`, `/rent/ps5`)

#### UI/UX Features:
* **Rental Period Selector:**
  * 1 Day Weekend Blitz (₹799)
  * 2 Days Weekend Pass (₹1,499)
  * 3 Days Mid-Week (₹1,999)
  * 7 Days Weekly Pro (₹3,499)
  * 1 Month Elite Gamer (₹9,999)
* **Hardware Inclusions Display:**
  * PS5 Disc Edition 4K UHD Console
  * 2x Sony DualSense Wireless Controllers
  * High-Speed HDMI 2.1 cable + Power cables
  * Optional 4K Gaming TV Add-On toggle.
* **Game CD Selection Library (10+ Top Rated Titles):**
  * Visual CD cover grid with age ratings and genre:
    * *Grand Theft Auto V* (18+)
    * *Marvel's Spider-Man 2* (16+)
    * *EA Sports FC 24* (3+)
    * *God of War Ragnarök* (18+)
    * *Cricket 24* (3+)
    * *Tekken 8* (16+)
    * *Mortal Kombat 1* (18+)
    * *Hogwarts Legacy* (12+)
    * *Call of Duty: Modern Warfare III* (18+)
* **Security Deposit Calculator:**
  * Transparently displays refundable security deposit.
  * Clear explanation of instant refund upon on-site return inspection.
* **KYC & Delivery Undertaking:**
  * Aadhaar card verification upload.
  * Digital signature on PS5 Delivery Inspection & Undertaking Form (`PS5_Rental_Delivery_Inspection_Form.pdf`).
* **Live Rental Tracking (`/rent/track/[rentalNumber]`):**
  * Tracking console delivery, active rental remaining hours, extension request button, and return pickup scheduling.

---

### 3.9 Customer Reviews & Social Proof Page (`/reviews`)
* `ReviewStatsBar.tsx`: Verified metrics (4.8 rating, 199+ verified transactions, 97% satisfaction rate).
* `CustomerVideoCarousel.tsx`: Horizontal sliding reels of verified customers showing instant UPI alert on their phones.
* `VideoPlayerModal.tsx`: High-definition video player for customer review playback.
* `CustomerReviewCard.tsx`: Review card displaying user name, device sold, payout amount, verified location tag, and payout method.
* Filter tags for Mobile, Laptop, Tablet, and 5-Star reviews.

---

## 4. Content Hubs, SEO Publishing & Educational Engines

CashALL features a rich knowledge architecture designed for Search Engine Optimization (SEO), Answer Engine Optimization (AEO), and Generative AI Search (GEO) systems.

### 4.1 Blogs System (`/blog` & `/blog/[slug]`)
* **Blog List Page (`app/blog/page.tsx`):**
  * Filter categories: *Resale Insights*, *Market Analysis*, *Device Security*, *Guides & Tips*, *AI & Future Tech*.
  * Search bar for tech articles.
  * Featured Hero post and grid of recent publications.
* **Blog Detail Page (`BlogPostTemplate.tsx`):**
  * **AEO Quick Answer Box:** Direct answer box optimized for Google Featured Snippets and Perplexity/Gemini citation.
  * **Geo Insights Card:** Regional resale trends for Eastern India (Kolkata, Howrah, Patna).
  * **Interactive Data Tables:** Depreciation rate comparison tables by storage tier and brand.
  * **Author Profile:** Certified hardware economics analyst bio.
  * **Dynamic FAQs:** Schema.org FAQPage structured data integration.

### 4.2 Recommerce News Hub (`/news`)
* Real-time tech industry headlines and secondary market telemetry:
  * Surge in pre-owned flagships amid inflation.
  * Government CEIR telecommunication database integration updates.
  * Dedicated Neural Processing Units (NPUs) and Apple Intelligence resale premiums.
* Trending badges and read-time indicators.

### 4.3 Technical Knowledge Articles (`/articles`)
* Deep technical guides for data privacy and device forensics:
  * **NIST Special Publication 800-88 Rev 1:** In-depth media sanitization standards (Clear, Purge, Destroy) explaining why standard OS factory resets leave data recoverable in flash memory clusters.
  * Cryptographic Master Key destruction inside Apple Secure Enclave & Android Titan M chips.
  * Legally binding Digital Certificate of Sanitization.

### 4.4 High-Impact Topical SEO Landing Pages
Dedicated, ultra-detailed standalone landing pages targeting high-intent long-tail keywords:
1. `/512gb-phones-the-sweet-spot-for-resale-value`
2. `/does-phones-with-dedicated-neural-engines-could-make-you-more-money`
3. `/steps-to-ensure-your-digital-sim-doesnt-go-with-sold-phones`
4. `/verify-your-phones-clean-status-before-selling-avoid-surprises`
5. `/why-iphones-hold-more-resale-value-than-android-in-india`
6. `/sell-phone-in-kolkata`, `/sell-phone-in-howrah`, `/sell-phone-in-gorakhpur`
7. `/compare/cashify-vs-cashall`, `/compare/cashall-vs-other-platforms`

---

## 5. Media, Catalogues & Asset Inventory

### 5.1 Public Assets Structure (`/public`)
* **Branding & Logos:**
  * `logo.png`, `logo.webp`, `logo-transparent.webp` (Primary brandmark)
  * `favicon.ico`, `favicon.png`, `favicon-192x192.png`, `favicon-512x512.png`
  * `app-icon.png`, `app-icon.webp` (Mobile launcher icon)
  * `brand-pattern.webp` (Geometric brand background texture)
  * `social-cover.webp`, `CashALL_facebookcover.webp`, `CashALL_yt_banner.webp`
* **Device & Hero Visuals (`/public/images/devices/`, `/public/images/hero/`):**
  * `all_devices.jpg`, `phone.jpg`, `laptop.jpg`, `tablet.jpg`, `ps5.jpg`
  * `hero_phone.jpg`, `hero_laptop.jpg`, `hero_tablet.jpg`, `hero_ps5.jpg`
* **Regional & Trust Badges (`/public/images/locations/`, `/public/images/trust/`):**
  * Kolkata, Howrah, Hooghly, Barrackpore, Patna, Ranchi, Gorakhpur landmark photography.
  * SVG trust vector badges: `data-wipe.svg`, `pickup.svg`, `shield.svg`, `support.svg`, `upi.svg`, `valuation.svg`.
* **Promotional Photos (`/public/photos/`):**
  * High-res banners: `advertise1.webp`, `advertise2.webp`, `adverise3.webp`, `advertise4.webp`.
* **Downloadable APK Packages:**
  * `CashALL-Admin.apk` (5.7 MB)
  * `CashALL-Agent.apk` (6.0 MB)
  * `CashALL-Caller.apk` (5.7 MB)
  * `CashALL-Customer.apk` (4.8 MB)
* **Master Catalogs & Spreadsheets:**
  * `CashALL_All_Products_Catalog.csv` (1,000+ cataloged devices)
  * `CashALL_Product_Images_Master.json` (Direct device photo mapping)
  * `CashALL_Questions_and_Deduction_Rules.json` (Algorithmic QC penalty matrix)
  * `CashALL_VERIFIED_PIN_MASTER_Kolkata_Howrah_Hooghly_Barrackpore.xlsx`

### 5.2 Dynamic Catalog Image Resolvers
* `/api/v1/catalog/image/[slug]`: Dynamically serves the official product render for any mobile, laptop, or tablet. If missing, delivers a calibrated fallback based on device category.
* `/api/v1/catalog/brand-logo/[slug]`: Delivers high-contrast SVG brand logos.

---

## 6. Field Agent Portal & Mobile App UI/UX

### 6.1 Authentication (`/agent/login`)
* Sleek mobile-first login interface.
* Agent Phone Number and 4-digit PIN authentication.
* Auto-syncs agent credentials with Android Native Bridge for background lead alerts.

### 6.2 Agent Dashboard (`/agent/dashboard`)
* **Real-Time Date Filtering Tabs:**
  * `ALL` | `TODAY` | `TOMORROW` | `DAY AFTER TOMORROW`
  * Displays lead counts per date bucket with Indian Standard Time (IST) calendar awareness.
* **Status Filter Tabs:**
  * `ALL` | `PENDING` | `COMPLETED` | `CANCELLED`
* **Real-Time New Lead Alarm Siren & Buzzer:**
  * When a new lead is assigned, the dashboard plays a loud looping siren sound and triggers Android device vibration.
  * Dedicated "Silence Buzzer" floating button.
* **Lead Information Cards:**
  * Customer Name, Phone, Quoted Price, Target Device, Pickup Slot.
  * Full customer address with landmark.
* **Interactive Lead Action Buttons:**
  * **"Call Customer" Button:** Initiates native dialer call (`tel:...`) and automatically triggers Android Call Recording.
  * **"Navigate (Google Maps)" Button:** One-tap trigger opening Google Maps with turn-by-turn navigation directly to the customer's doorstep.
  * **"View Customer QC Answers" Button:** Launches `CustomerAnswersModal.tsx` showing exactly what the customer selected during online self-assessment.
  * **"Start Physical Inspection" Button:** Navigates to on-site diagnostic checklist.
  * **"Upload Payment Proof (OCR)" Button:** Opens camera/gallery picker; uses Tesseract.js to automatically detect UTR and transferred amount from UPI screenshots.
  * **"Complete Order" Button:** Finalizes transaction, archives lead, and sends digital invoice to customer.

### 6.3 On-Site Physical Inspection Checklist (`/agent/orders/[orderNumber]/inspection`)
* Detailed item-by-item verification:
  * IMEI verification against CEIR database.
  * Screen condition confirmation (Display bleeding, touchscreen dead zones).
  * Body scratches, dents, camera lens condition.
  * Battery health test and accessory verification.
* **Dynamic Re-Quotation Modal:** If the device has undisclosed defects, the agent adjusts the price transparently; customer accepts on screen with digital OTP confirmation.

---

## 7. Partner Portal UI/UX

Designed for external franchisee shops, repair centers, and recommerce trade partners.

### 7.1 Routes & Flow
* `/partner`: Partner landing and authentication.
* `/partner/orders`: Partner assigned orders queue with search, status filters, and reschedule modal.
* `/partner/orders/[id]/verification`: Customer Aadhaar/PAN photo capture and automated IMEI verification check.
* `/partner/orders/[id]/inspection`: Physical grading matrix and revised price negotiation.
* `/partner/orders/[id]/payment`: Direct payout triggering via partner bank account or CashALL wallet, with transaction reference input.
* `/partner/orders/[id]/signature`: Fullscreen HTML5 digital signature pad where the customer signs the legal transfer agreement, generating the official Bill of Sale.

---

## 8. Support & Telecaller Portal UI/UX

Dedicated environment for inside sales, customer success, and order confirmation telecallers.

### 8.1 Routes & Flow
* `/support/login`: Support agent credentials login.
* `/support/dashboard`:
  * **Unconverted Quotes Queue:** Real-time list of customers who unlocked a price on the website but haven't booked a pickup.
  * **Call Disposition Logger Modal:**
    * Outcome selector: `Customer Interested`, `Call Not Answered`, `Busy - Call Later`, `Price Too Low`, `Order Confirmed`, `Wrong Number`.
    * Free-text telecaller notes and follow-up date reminder.
  * **One-Click Quote-to-Order Conversion:** Instantly books a pickup slot while on call with the customer.
  * **Integrated Order Reschedule:** Reschedules pickup dates via `RescheduleModal.tsx`.
  * **Call Telemetry & Audio Playback:** Syncs with the `android-caller-app` to display audio recordings of calls made to customers with embedded HTML5 audio player.

---

## 9. Admin Control Center & Enterprise Portal

Comprehensive management console located at `/admin` with 19 specialized operational modules.

### 9.1 Module Breakdown
1. **Dashboard Overview (`/admin`):** Real-time KPI counters (Gross Merchandise Value, Active Pickups Today, Conversion Rate, Total Revenue, Recent Orders stream).
2. **Order Management (`/admin/orders`):** Exhaustive data grid of all buyback orders with advanced filters, status modifiers, agent re-assignment, and manual order override.
3. **PS5 Rentals Console (`/admin/rentals`):** Manages active console rentals, game discs dispatched, security deposit statuses, and return inspections.
4. **Device Catalog (`/admin/catalog`):** Brand, model, and variant CRUD management. Add new smartphone models, edit base prices, and toggle visibility.
5. **Pricing Rules Matrix (`/admin/pricing`):** Algorithmic penalty configuration. Set deduction percentages for broken screens, missing boxes, battery health drops, etc.
6. **Quotes Repository (`/admin/quotes`):** Master repository of all generated quotes, tracking conversion funnel drop-offs.
7. **Agent Management (`/admin/agents`):** Field executive directory, active status toggles, assigned pickup territories, and daily performance metrics.
8. **Support Team Management (`/admin/support`):** Caller roster, conversion metrics, and daily call quotas.
9. **Support Calls & Audio Recordings (`/admin/support/calls`):** Telemetry hub listening to and reviewing field/support call recordings uploaded from the caller app.
10. **Transaction Audit Ledger (`/admin/ledger`):** Financial double-entry audit ledger recording every UPI/IMPS payout, UTR proof, and daily payout reconciliations.
11. **Reports & Analytics (`/admin/reports`):** Business intelligence charts, top-selling smartphone brands, average price per category, and regional demand maps.
12. **Physical Inspections QC Hub (`/admin/inspections`):** Audit of on-site diagnostic reports filed by agents, highlighting price revision frequencies.
13. **Service Areas (PIN Codes) (`/admin/service-areas`):** Management of 217+ active West Bengal pincodes with instant activation/deactivation toggles.
14. **Blacklisted Service Areas (`/admin/service-areas/blacklisted`):** Fraud prevention console listing blacklisted pincodes, suspicious mobile numbers, and blocked addresses.
15. **Dispatch Console (`/admin/dispatch`):** Geo-routing dashboard optimizing pickup executive routes across Kolkata, Howrah, and Hooghly.
16. **Merchant Exceptions (`/admin/merchant-exceptions`):** High-value device overrides requiring dual management approval.
17. **Partners Management (`/admin/partners`):** Master directory of verified franchisee and retail partners.
18. **Audit Trail (`/admin/audit`):** Immutable chronological log of all administrative actions, logins, and overrides.
19. **Digital Bill Viewer (`/admin/bill/[orderNumber]`):** Official, printable, GST-compliant Electronic Bill of Sale with QR code verification.

---

## 10. Native Android Hybrid Bridge Architecture

The CashALL repository includes 4 native Android Kotlin applications providing hardware integration:
* `android-admin-app`: Admin app with foreground order polling service, push alerts, and Google Maps turn-by-turn navigation.
* `android-agent-app`: Field executive app with background service, real-time loud lead buzzer alarm, and audio call recorder.
* `android-caller-app`: Telecaller app using Android Accessibility Services to automatically record inbound/outbound customer support calls and upload MP3/WAV files to `/api/v1/support/recordings`.
* `android-customer-app`: High-performance Android WebView wrapper featuring native splash screens, offline caching, and push notifications.

---
*End of Frontend & UI/UX Master Documentation.*
