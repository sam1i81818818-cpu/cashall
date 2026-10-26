# CashALL — Frontend to Backend Connectivity & Button Action Flow Specification

> **Document Type:** Full-Stack API Integration, Button-by-Button Action Flow & State Synchronization Matrix  
> **Platform Version:** CashALL Recommerce Enterprise v1.0.0  
> **Target Audience:** Full-Stack Developers, Backend Engineers, Mobile Engineers, QA Automation & DevOps  

---

## 1. End-to-End Architectural Data Flow

CashALL connects high-performance Next.js 14 client-side interfaces, responsive modals, and hybrid native Android applications to an enterprise backend powered by PostgreSQL, Prisma ORM, and third-party communication engines.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND CLIENT SURFACES                                 │
│  [Customer Portal]    [Agent Portal & App]    [Admin Portal]    [Support / Caller App]  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ Fetch API / JSON / Form-Data
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 APP ROUTER API LAYER (/api/v1/...)                   │
│   • Auth & OTP Handlers          • Order State Machine        • Dynamic Valuation      │
│   • Media & Audio Streaming      • Payout & Payment OCR       • CEIR IMEI & Geocoding  │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────────────┐
│     DATABASE & PERSISTENCE LAYER      │       │     EXTERNAL THIRD-PARTY SERVICES     │
│   • Prisma ORM 5.21                   │       │   • Meta Conversions API (CAPI)       │
│   • PostgreSQL (Neon / Supabase)      │       │   • Resend & Nodemailer Email API     │
│   • 18 Normalized Relational Tables   │       │   • Fast2SMS & Twilio SMS Gateway     │
│   • Client LocalStorage / IndexedDB   │       │   • WhatsApp Business Cloud API       │
│   • Audio & OCR Blob Storage          │       │   • Google Maps Distance & Geocode    │
└───────────────────────────────────────┘       └───────────────────────────────────────┘
```

---

## 2. Master Button-by-Button & Action-by-Action Connectivity Matrix

### 2.1 Customer Portal (Public & Authenticated Client Actions)

| # | UI Element / Button | Component & File Path | Trigger Event | Client State & Storage | Target API Route & Method | Database Models Touched | External Services & Side Effects | Success UI Outcome |
|---|---------------------|------------------------|---------------|------------------------|---------------------------|-------------------------|-----------------------------------|-------------------|
| **C-01** | **Search Device Input** | `DeviceSearch.tsx`<br>`components/home/DeviceSearch.tsx` | `onChange` (Debounced 150ms) | `searchQuery` state | Local fuzzy search over `INITIAL_MODELS` + GET `/api/v1/catalog?q=...` | `DeviceModel`, `Brand` | None | Drops down matching models with brand logo and starting buyback price |
| **C-02** | **Location Selector Modal Item** | `LocationModal.tsx`<br>`components/common/LocationModal.tsx` | `onClick` (City/State tile) | Sets `localStorage["cashall_location"]` | None (Client state sync) | None | Dispatches `cashall_location_updated` window event | Updates Header location badge; auto-adjusts regional pricing & banners |
| **C-03** | **Brand Card Click** | `PopularBrands.tsx`<br>`components/home/PopularBrands.tsx` | `onClick` | None | Next.js Router Navigation | None | None | Navigates customer to `/sell/[category]/[brand]` |
| **C-04** | **Model Card Click** | Brand model grid<br>`app/sell/[category]/[brand]/page.tsx` | `onClick` | None | Next.js Router Navigation | None | None | Navigates customer to `/sell/[category]/[brand]/[model]` |
| **C-05** | **Storage / RAM / Processor Chip** | Model spec page<br>`app/sell/[cat]/[brand]/[model]/page.tsx` | `onClick` | Sets `activeVariant` state & `localStorage["cashall_current_variant"]` | None (Client sync) | None | None | Updates dynamic base price display and enables "Get Exact Value" button |
| **C-06** | **"Get Exact Value" Button** | Model spec page<br>`app/sell/[cat]/[brand]/[model]/page.tsx` | `onClick` | Pushes variant ID query param | Next.js Router Navigation | None | None | Navigates to `/sell/[cat]/[brand]/[model]/assess?variantId=...` |
| **C-07** | **Assessment Question Option Card** | `VisualOptionCard.tsx`<br>`components/assessment/VisualOptionCard.tsx` | `onClick` | Updates `answers` state dictionary in assessment flow | Client valuation engine (`lib/pricing-engine.ts`) | None | Web Audio API plays subtle click feedback chime | Recalculates deductions live in `AssessmentSidebar.tsx`; progresses stepper |
| **C-08** | **"Continue / Next Step" Button** | `AssessmentHeader.tsx`<br>`components/assessment/AssessmentHeader.tsx` | `onClick` | Increments `currentStep` (1 to 6) | None | None | None | Smooth transitions to next physical condition question set |
| **C-09** | **"Unlock Exact Valuation" Button** | Assessment Step 6<br>`app/sell/.../assess/page.tsx` | `onClick` | Opens `PriceUnlockModal.tsx` | None | None | None | Displays phone number capture modal with guaranteed valuation preview |
| **C-10** | **Price Unlock Modal Submit** | `PriceUnlockModal.tsx`<br>`components/common/PriceUnlockModal.tsx` | `onSubmit` | Sets `cashall_user` & `cashall_latest_quote` in `localStorage` | **POST** `/api/v1/quotes/save` | `Quote`, `User` | **Meta Pixel / CAPI:** Fires `Lead` event with phone & value; **SMS:** Sends instant SMS quote alert | Closes modal, stores quote ID, routes to `/quote/[quoteId]` |
| **C-11** | **"Add Another Device to Cart" Button** | `QuoteResultPage`<br>`app/quote/[quoteId]/page.tsx` | `onClick` | Calls `saveQuoteToCart()` in `lib/cart.ts` | None | None | Dispatches `cashall_cart_updated` event | Saves quote to multi-item basket; slides open `CartDrawer.tsx` |
| **C-12** | **Cart Remove Item Button** | `CartDrawer.tsx`<br>`components/cart/CartDrawer.tsx` | `onClick` | Calls `removeQuoteFromCart()` in `lib/cart.ts` | None | None | Dispatches `cashall_cart_updated` event | Removes device from drawer, recalculates aggregate total payout tally |
| **C-13** | **"Decline / Cancel Quote" Button** | `QuoteResultPage`<br>`app/quote/[quoteId]/page.tsx` | `onClick` | Sets `quote.status = "CANCELLED"` | **POST** `/api/v1/quotes/[quoteId]/cancel` | `Quote` | Records cancellation reason in DB | Updates UI to cancelled state; closes modal |
| **C-14** | **"Book Free Doorstep Pickup" Button** | `QuoteResultPage`<br>`app/quote/[quoteId]/page.tsx` | `onClick` | Checks user login session | If no session: opens `CustomerAuthModal`; If session: routes to Checkout | None | None | Navigates to `/checkout/pickup?quoteId=...` |
| **C-15** | **Pincode Verification Input** | `PickupCheckoutContent`<br>`app/checkout/pickup/page.tsx` | `onChange` / `onBlur` (6 Digits) | `pincode`, `serviceStatus` | Client lookup (`lib/serviceability.ts`) + GET `/api/v1/serviceability?pin=...` | `ServiceArea` | None | Displays green checkmark (*"Kolkata - 700029 Serviced"*) or amber fallback notice |
| **C-16** | **Pickup Date Preset Tabs** | `PickupCheckoutContent`<br>`app/checkout/pickup/page.tsx` | `onClick` (Today / Tomorrow / Day After) | `pickupDate`, updates dynamic time slots | Client date calculation (`lib/utils/pickup-date.ts`) | None | None | Automatically filters out expired time slots based on current IST time |
| **C-17** | **Payout Mode Selector Tabs** | `PickupCheckoutContent`<br>`app/checkout/pickup/page.tsx` | `onClick` (UPI / Bank / Gift Card) | `payoutMethod` state (`"UPI"` / `"BANK_TRANSFER"` / `"GIFT_CARD"`) | None | None | None | Dynamically switches input fields between UPI ID (VPA) and Bank Account + IFSC |
| **C-18** | **Terms & Seller Agreement Checkbox** | `PickupCheckoutContent`<br>`app/checkout/pickup/page.tsx` | `onChange` | `termsAccepted` boolean | None | None | None | Enables primary "Confirm Doorstep Pickup" submit button |
| **C-19** | **"Confirm Doorstep Pickup" Button** | `PickupCheckoutContent`<br>`app/checkout/pickup/page.tsx` | `onSubmit` | Sets `isSubmitting = true`, saves order to `cashall_latest_order` & `cashall_all_orders` | **POST** `/api/v1/orders/create` | `Order`, `Pickup`, `User`, `Quote` | **Meta CAPI:** Fires `Purchase` & `Schedule` events; **Resend/Email:** Sends order confirmation email; **SMS:** Sends order booking SMS | Plays confirmation chime, clears cart, redirects customer to `/order/[orderId]` |
| **C-20** | **Reschedule Pickup Button** | Order Tracking Page<br>`app/order/[orderId]/page.tsx` | `onClick` | Opens `RescheduleModal.tsx` | None | None | None | Opens date and slot picker modal |
| **C-21** | **Reschedule Modal Submit** | `RescheduleModal.tsx`<br>`components/common/RescheduleModal.tsx` | `onSubmit` | Updates local order date/slot | **POST** `/api/v1/orders/[id]/reschedule` | `Order`, `Pickup` | **SMS/WhatsApp:** Dispatches rescheduling confirmation alert to customer and assigned agent | Updates order tracking timeline; closes modal with success toast |
| **C-22** | **Cancel Order Button** | Order Tracking Page<br>`app/order/[orderId]/page.tsx` | `onClick` | Prompts cancellation reason | **POST** `/api/v1/orders/[id]/cancel` | `Order` | **SMS:** Sends cancellation notice; releases assigned field agent | Updates badge to `CANCELLED`; disables live tracking stepper |
| **C-23** | **Download Legal Sale Receipt** | Order Tracking Page<br>`app/order/[orderId]/page.tsx` | `onClick` | None | **GET** `/api/v1/orders/[id]/generate-bill` or client `@react-pdf/renderer` | `Order`, `QcReport`, `Payment` | Renders PDF stream | Generates and downloads official GST Bill of Sale PDF (`CashALL_Bill_CAXXXX.pdf`) |
| **C-24** | **PS5 Console Rental Submit** | PS5 Rental Page<br>`app/rent/ps5/page.tsx` | `onSubmit` | Sets `cashall_ps5_rental` | **POST** `/api/v1/rentals` | `Rental`, `User` | **Email/SMS:** Sends rental confirmation and delivery inspection appointment | Routes to `/rent/track/[rentalNumber]` with live delivery tracking |

---

### 2.2 Field Agent Portal & Mobile App Actions

| # | UI Element / Button | Component & File Path | Trigger Event | Client State & Storage | Target API Route & Method | Database Models Touched | External Services & Side Effects | Success UI Outcome |
|---|---------------------|------------------------|---------------|------------------------|---------------------------|-------------------------|-----------------------------------|-------------------|
| **A-01** | **Agent Login Button** | `AgentLoginPage`<br>`app/agent/login/page.tsx` | `onSubmit` | Sets `cashall_agent_session` in `localStorage` | **POST** `/api/v1/agent/login` | `Agent`, `User` | Persists session into Android Bridge: `CashAllAgentNative.saveAgentSession` | Stores authentication token and redirects to `/agent/dashboard` |
| **A-02** | **Silence Buzzer Alarm Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | Sets `isAlarmSounding = false` | None (Client audio mute) | None | Stops Web Audio buzzer siren; calls `CashAllAgentNative.silenceAlarm` | Turns off audible alert on both browser and Android background service |
| **A-03** | **Date Filter Tab ("TODAY")** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | Sets `selectedDateFilter = "TODAY"` | None (Filters orders state in memory) | None | None | Instantly filters lead cards to orders scheduled for current calendar day |
| **A-04** | **Call Customer Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | None | Triggers `tel:${ord.userPhone}` | None | **Android Caller App:** Launches native dialer & starts recording call audio via accessibility service | Launches phone call to customer; logs call attempt |
| **A-05** | **Google Maps Navigation Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | None | Opens `https://maps.google.com/?q=...` | None | **Google Maps:** Launches turn-by-turn driving navigation to customer address | Opens Google Maps app targeting the customer's exact pincode and address |
| **A-06** | **"View Answers Sheet" Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | Sets `selectedOrderForAnswers` | None | None | None | Launches `CustomerAnswersModal.tsx` showing customer's online QC responses |
| **A-07** | **"Start Inspection" Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | None | **POST** `/api/v1/orders/[id]/start-inspection` | `Order` | Updates order state to `INSPECTION_IN_PROGRESS` | Navigates agent to `/agent/orders/[orderNumber]/inspection` |
| **A-08** | **Inspection Diagnostic Checkboxes** | Agent Inspection Page<br>`app/agent/orders/.../inspection` | `onChange` | Updates physical grading state | Client deduction calculator | None | None | Updates revised price proposal in real-time based on actual physical wear |
| **A-09** | **Propose Re-Quoted Price Button** | Agent Inspection Page<br>`app/agent/orders/.../inspection` | `onSubmit` | Sets `requotedPrice` | **POST** `/api/v1/orders/[id]/final-offer` | `Order`, `PriceRevisionRecord` | **SMS & WhatsApp:** Sends revised quotation link to customer phone | Customer receives on-screen modal to accept or decline the revised offer |
| **A-10** | **Upload Payment Proof (OCR)** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onChange` (File input) | Sets `ocrStatus = "Scanning..."` | Client Tesseract.js OCR + **POST** `/api/v1/agent/upload-payment` | `Payment`, `Order` | **Tesseract.js OCR:** Reads image bitmap, extracts 12-digit UTR and ₹ amount | Auto-fills UTR and Amount fields; attaches payment screenshot to order |
| **A-11** | **"Complete Order" Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | Sets `isCompleting = true` | **POST** `/api/v1/agent/orders/[id]/complete` | `Order`, `Payment`, `AuditLog` | **Resend Email:** Dispatches final electronic Bill of Sale to customer email; **SMS:** Confirmation | Marks order as `COMPLETED`; plays success chime; moves order to History tab |
| **A-12** | **Agent Logout Button** | `AgentDashboardPage`<br>`app/agent/dashboard/page.tsx` | `onClick` | Clears `cashall_agent_session` | None | None | Clears Android Bridge session: `CashAllAgentNative.clearAgentSession` | Redirects agent to `/agent/login` |

---

### 2.3 Partner Portal Actions

| # | UI Element / Button | Component & File Path | Trigger Event | Target API Route & Method | Database Models Touched | Side Effects & Third-Party Integrations | Success UI Outcome |
|---|---------------------|------------------------|---------------|---------------------------|-------------------------|----------------------------------------|-------------------|
| **P-01** | **Partner Login Submit** | `app/partner/page.tsx` | `onSubmit` | **POST** `/api/v1/auth/partner-login` | `User` (Role: PARTNER) | Sets session token in `cashall_partner_session` | Redirects partner to `/partner/orders` |
| **P-02** | **Upload Customer Aadhaar / ID** | `app/partner/orders/[id]/verification` | `onChange` (File) | **POST** `/api/v1/orders/[id]/verify-identity` | `Order`, `User` | Cloud storage upload + OCR name verification | Confirms KYC status with green verification badge |
| **P-03** | **Verify CEIR IMEI Button** | `app/partner/orders/[id]/verification` | `onClick` | **POST** `/lib/services/imei.service.ts` | `Order` | CEIR National Registry API query | Confirms IMEI is clean and not reported lost/stolen |
| **P-04** | **Submit Physical Inspection QC** | `app/partner/orders/[id]/inspection` | `onSubmit` | **POST** `/api/v1/admin/orders/[id]/qc-report` | `QcReport`, `Order` | Calculates final settlement price | Transitions order to payment authorization screen |
| **P-05** | **Trigger Instant Spot Payout** | `app/partner/orders/[id]/payment` | `onSubmit` | **POST** `/api/v1/orders/[id]/payment` | `Payment`, `Order` | **Bank Payout Gateway:** Dispatches IMPS/UPI API call | Records UTR transaction number; locks payout |
| **P-06** | **Digital Signature Save Button** | `app/partner/orders/[id]/signature` | `onClick` (Signature Pad) | **POST** `/api/v1/orders/[id]/esign` | `SellerAgreementAcceptance`, `Order` | Embeds digital signature into `@react-pdf/renderer` invoice | Generates legally binding electronic Bill of Sale |

---

### 2.4 Support & Telecaller Portal Actions

| # | UI Element / Button | Component & File Path | Trigger Event | Target API Route & Method | Database Models Touched | Side Effects & Integrations | Success UI Outcome |
|---|---------------------|------------------------|---------------|---------------------------|-------------------------|-----------------------------|-------------------|
| **S-01** | **Support Login Submit** | `app/support/login/page.tsx` | `onSubmit` | **POST** `/api/v1/support/login` | `User` (Role: SUPPORT) | Sets `cashall_support_session` in `localStorage` | Navigates to `/support/dashboard` |
| **S-02** | **"Log Call Outcome" Submit** | `app/support/dashboard/page.tsx` | `onSubmit` | **POST** `/api/v1/support/calls` | `CallLog`, `Quote` | Updates lead priority score | Updates disposition tag on the quote card |
| **S-03** | **"Convert Quote to Order" Button** | `app/support/dashboard/page.tsx` | `onClick` | **POST** `/api/v1/admin/quotes/convert` | `Order`, `Quote`, `Pickup` | **SMS & Email:** Sends booking confirmation to customer | Instantly creates active order and assigns dispatch slot |
| **S-04** | **"Reschedule Pickup" Submit** | `app/support/dashboard/page.tsx` | `onSubmit` | **POST** `/api/v1/orders/[id]/reschedule` | `Order`, `Pickup` | Dispatches reschedule SMS alert | Updates order schedule date and time slot |
| **S-05** | **Play Call Recording Audio** | `app/support/dashboard/page.tsx` | `onClick` | **GET** `/api/v1/support/recordings?id=...` | `CallRecording` | Streams WAV/MP3 audio recorded by `android-caller-app` | Embedded HTML5 player streams recorded call audio |

---

### 2.5 Admin Control Center Actions

| # | UI Element / Button | Component & File Path | Trigger Event | Target API Route & Method | Database Models Touched | Side Effects & Integrations | Success UI Outcome |
|---|---------------------|------------------------|---------------|---------------------------|-------------------------|-----------------------------|-------------------|
| **ADM-01** | **Admin Login Submit** | `app/admin/login/page.tsx` | `onSubmit` | **POST** `/api/v1/auth/admin-login` | `User` (Role: ADMIN) | Sets `cashall_admin_session` | Grants access to `/admin` dashboard |
| **ADM-02** | **Assign Agent to Order** | `app/admin/orders/page.tsx` | `onChange` (Agent Dropdown) | **POST** `/api/v1/admin/orders/[id]/assign-agent` | `Order`, `Agent`, `AuditLog` | **Push Notification:** Triggers siren alarm on assigned agent's phone | Order card displays assigned agent's name and avatar |
| **ADM-03** | **Update Device Base Price** | `app/admin/catalog/page.tsx` | `onSubmit` (Edit Price Modal) | **PUT** `/api/v1/admin/catalog` | `DeviceVariant`, `AuditLog` | Clears frontend pricing cache | Immediately reflects updated pricing across consumer search |
| **ADM-04** | **Save Pricing Rule Deduction %** | `app/admin/pricing/page.tsx` | `onSubmit` | **POST** `/api/v1/admin/pricing` | `PricingRule`, `AuditLog` | Recalculates quote evaluation algorithm | Updates dynamic deduction engine across all categories |
| **ADM-05** | **Blacklist Fraudulent Phone / PIN** | `app/admin/service-areas/blacklisted` | `onSubmit` | **POST** `/api/v1/admin/service-areas/blacklist` | `BlacklistedArea`, `AuditLog` | Blocks automated checkout submissions | Instantly halts pickups in targeted fraud zone |
| **ADM-06** | **Manual Order Override** | `app/admin/orders/page.tsx` | `onClick` (Force Complete) | **POST** `/api/v1/admin/override` | `Order`, `AuditLog` | Logs administrator security trail | Forces order status update with dual-auth logging |
| **ADM-07** | **Send Bill Email to Customer** | `app/admin/orders/page.tsx` | `onClick` | **POST** `/api/v1/admin/orders/[id]/send-bill-email` | `Order` | **Resend Email Service:** Re-sends official Bill PDF | Customer receives PDF copy in inbox within seconds |
| **ADM-08** | **Approve PS5 Return & Refund** | `app/admin/rentals/page.tsx` | `onSubmit` | **PUT** `/api/v1/rentals/[rentalNumber]` | `Rental`, `Payment` | **Payout Gateway:** Initiates instant security deposit refund | Marks rental as completed; updates deposit ledger |

---

## 3. Real-Time Synchronization & Hardware Bridge Protocols

### 3.1 Background Polling & Siren Alarms
* **Field Agent Dashboard:** Polls `/api/v1/agent/orders?phone=...` at calibrated 15-second intervals.
* When a newly assigned order with `status === "SCHEDULED"` is detected:
  1. The Web Audio synthesizer triggers an oscillating dual-frequency siren (850Hz – 1200Hz).
  2. The window invokes the native Android interface:
     ```javascript
     if (window.CashAllAgentNative?.triggerNewLeadAlarm) {
       window.CashAllAgentNative.triggerNewLeadAlarm(JSON.stringify(newOrder));
     }
     ```
  3. The native Kotlin service (`AlarmSoundManager.kt`) acquires a `WakeLock`, triggers device vibration, and plays the alarm through the device's alarm stream even if the phone is set to silent or the screen is locked.

### 3.2 Telecaller Automatic Call Recording Pipeline
* The `android-caller-app` runs an Android `AccessibilityService` (`CallRecorderAccessibilityService.kt`).
* When an outbound call is dialed to a customer phone number:
  1. The service begins recording audio from the voice communication stream.
  2. Upon call termination, the file is saved as an encrypted audio payload.
  3. `CallUploader.kt` initiates a multi-part HTTP upload to:
     ```http
     POST /api/v1/support/recordings
     Headers: Authorization: Bearer <CALLER_APP_KEY>
     Body: { audioFile: Binary, customerPhone: String, duration: Int }
     ```
  4. The server stores the audio file and creates a relational `CallLog` entry viewable in both the Support Dashboard (`/support/dashboard`) and Admin Calls Console (`/admin/support/calls`).

### 3.3 LocalStorage to PostgreSQL Auto-Sync Engine
* To ensure zero lead loss even during network disconnects or edge interruptions:
  1. Every quote and order created in the browser is immediately persisted in `localStorage["cashall_latest_order"]` and `localStorage["cashall_all_orders"]`.
  2. The global `Header.tsx` runs an automated background sync routine throttled to once every 10 minutes:
     ```typescript
     POST /api/v1/orders/sync-local
     Body: { orders: localAllOrdersArray }
     ```
  3. The backend matches orders by unique `orderNumber` and automatically creates or updates the database record.

---

## 4. Lifecycle State Machines & State Transitions

### 4.1 Recommerce Order State Machine
```
[DRAFT QUOTE] ──(Price Unlock)──► [SAVED QUOTE] ──(Confirm Pickup)──► [SCHEDULED / PENDING]
                                                                             │
                                                                 (Assign Field Agent)
                                                                             ▼
                                                                        [ASSIGNED]
                                                                             │
                                                                 (Agent En Route)
                                                                             ▼
                                                                    [OUT_FOR_PICKUP]
                                                                             │
                                                                 (Start Diagnostics)
                                                                             ▼
                                                                [INSPECTION_IN_PROGRESS]
                                                                             │
                                            ┌────────────────────────────────┴────────────────────────────────┐
                                            │ (Undisclosed Defect Found)                                      │ (All Checks Pass)
                                            ▼                                                                 ▼
                                  [REQUOTED / PRICE REVISED]                                            [QC_VERIFIED]
                                            │                                                                 │
                                ┌───────────┴───────────┐                                                     │
                                ▼                       ▼                                                     │
                       [OFFER ACCEPTED]        [OFFER DECLINED]                                               │
                                │                       │                                                     │
                                │                       ▼                                                     │
                                │                  [CANCELLED]                                                │
                                └───────────────────────┬─────────────────────────────────────────────────────┘
                                                        │
                                             (Spot UPI / IMPS Payout)
                                                        ▼
                                                 [PAYMENT_SUCCESS]
                                                        │
                                            (Legal Bill of Sale e-Sign)
                                                        ▼
                                                   [COMPLETED]
```

### 4.2 PS5 Console Rental State Machine
```
[RENTAL BOOKED] ──► [SECURITY DEPOSIT SECURED] ──► [KYC VERIFIED]
                                                         │
                                             (Doorstep Delivery & Video QC)
                                                         ▼
                                                [DELIVERED_ACTIVE]
                                                         │
                                             (Scheduled Return Date)
                                                         ▼
                                                [RETURN_INSPECTION]
                                                         │
                                      ┌──────────────────┴──────────────────┐
                                      ▼                                     ▼
                            (Zero Hardware Damage)               (Defect / Loss Incurred)
                                      │                                     │
                                      ▼                                     ▼
                         [DEPOSIT REFUNDED 100%]              [DEPOSIT DEDUCTED PRO-RATA]
                                      └──────────────────┬──────────────────┘
                                                         │
                                                         ▼
                                                [RENTAL_COMPLETED]
```

---

## 5. Client-Side Storage Keys & Session Inventory

| Key Name | Storage Medium | Scope & Purpose |
|----------|----------------|-----------------|
| `cashall_user` | `localStorage` | Authenticated customer profile (`phone`, `name`, `email`) |
| `cashall_location` | `localStorage` | Current selected region and state (`city`, `state`) |
| `cashall_cart_quotes` | `localStorage` | Array of device quotes stored in the multi-item selling cart |
| `cashall_latest_quote` | `localStorage` | Most recent device valuation breakdown |
| `cashall_latest_order` | `localStorage` | Most recent active buyback order |
| `cashall_all_orders` | `localStorage` | Full history of customer orders for instant offline access |
| `cashall_agent_session` | `localStorage` | Field executive session token, name, and phone |
| `cashall_admin_session` | `localStorage` | Administrative credential token and role |
| `cashall_partner_session`| `localStorage` | Partner store authentication token |
| `cashall_support_session`| `localStorage` | Telecaller / Support representative session |
| `cashall_sound_muted` | `localStorage` | Sound control preference (muted / unmuted) |
| `cashall_orders_synced_at`| `sessionStorage` | Timestamp of last local-to-cloud order synchronization |

---
*End of Frontend to Backend Connectivity & Action Flow Specification.*
