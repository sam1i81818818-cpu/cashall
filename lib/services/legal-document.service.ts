import { prisma } from "@/lib/db";
import crypto from "crypto";
import { logger } from "@/lib/utils/logger";

export type LegalDocType =
  | "SELLER_PURCHASE_AGREEMENT"
  | "SELLER_TERMS"
  | "WEBSITE_TERMS"
  | "PRIVACY_POLICY"
  | "COOKIE_POLICY"
  | "INSPECTION_REVISION_POLICY"
  | "PICKUP_POLICY"
  | "CANCELLATION_POLICY"
  | "GRIEVANCE_POLICY"
  | "AGENT_ENGAGEMENT_AGREEMENT"
  | "AGENT_PICKUP_SOP";

export interface DefaultDocDefinition {
  type: LegalDocType;
  title: string;
  version: string;
  summary: string;
  content: string;
}

export const DEFAULT_LEGAL_DOCUMENTS: Record<LegalDocType, DefaultDocDefinition> = {
  SELLER_PURCHASE_AGREEMENT: {
    type: "SELLER_PURCHASE_AGREEMENT",
    title: "Used Device Purchase Agreement & Seller Statutory Declaration",
    version: "1.0",
    summary: "Transaction-bound sale agreement and statutory seller ownership declaration for devices sold to CashALL.",
    content: `# USED DEVICE PURCHASE AGREEMENT & SELLER STATUTORY DECLARATION
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Purchaser Entity:** Aarna Enterprise (trading as "CashALL"), Howrah/Kolkata, West Bengal, India  
**Legal Status:** [LAWYER REVIEW REQUIRED - PENDING FORMAL ADVOCATE SIGN-OFF]

---

### 1. PARTIES & RECITALS
This Used Device Purchase Agreement ("Agreement") is entered into by and between:
1. **The Seller:** The customer whose identity, telephone number, and pickup address are recorded in the associated CashALL transaction order record.
2. **The Purchaser:** **Aarna Enterprise**, an Indian commercial enterprise operating the consumer electronics recommerce brand **CashALL** ("Purchaser", "we", "us").

---

### 2. STATUTORY SELLER DECLARATIONS & WARRANTIES
The Seller unconditionally makes the following solemn declarations:

1. **Lawful Ownership & Authority to Sell:**
   [LAWYER TO INSERT APPROVED SELLER OWNERSHIP DECLARATION]
   The Seller represents and warrants that they are the lawful, absolute owner or duly authorized agent of the owner of the electronic device identified in the transaction details (including brand, model, and IMEI/serial number), possessing unrestricted legal capacity to sell, transfer, and convey title to the Purchaser.

2. **Non-Stolen & Lawful Possession Declaration:**
   [LAWYER TO INSERT APPROVED ANTI-THEFT & BNS/IPC INDEMNITY CLAUSE]
   The Seller confirms that the device is not knowingly stolen, lost, unlawfully possessed, or obtained through any fraudulent or illegal means. The Seller acknowledges that tendering stolen goods is an offense under the Bharatiya Nyaya Sanhita, 2023 (and applicable Indian penal provisions), and agrees that CashALL cooperates fully with law enforcement authorities.

3. **No Financial Encumbrances, EMI Claims, or Liens:**
   [LAWYER TO INSERT APPROVED FINANCING / EMI LIEN DECLARATION]
   The Seller warrants that the device is free and clear of all liens, mortgages, hypothecations, finance claims, pending Equated Monthly Installment (EMI) obligations, or third-party ownership claims.

4. **IMEI & Device Identity Integrity:**
   The Seller confirms that the device's IMEI and serial number have not been knowingly altered, duplicated, tampered with, or manipulated, and match the information supplied to CashALL.

5. **Seller Responsibility & Indemnity:**
   [LAWYER TO INSERT APPROVED INDEMNITY CLAUSE]
   The Seller agrees to defend, indemnify, and hold harmless Aarna Enterprise, its proprietors, partners, agents, and affiliates against any and all claims, damages, liabilities, costs, and expenses (including legal fees) arising out of any breach of the above representations, third-party title disputes, or false declarations.

---

### 3. PHYSICAL INSPECTION & PRICE REVISION
[LAWYER TO INSERT APPROVED DEVICE INSPECTION / PRICE REVISION CLAUSE]
1. The online quotation provided on cashall.in is a preliminary, non-binding estimate based solely on customer-provided declarations.
2. Transfer of title and final price agreement occur only following doorstep physical verification by an authorized representative.
3. If physical defects or variances are discovered, a revised valuation shall be presented. The Seller has the absolute right to reject the revised valuation with zero cancellation fee.

---

### 4. DATA SANITIZATION & ACCOUNT DE-LINKING
[LAWYER TO INSERT APPROVED DATA ERASURE & ACCOUNT UNLINK RESPONSIBILITY]
Prior to handover, the Seller must:
- Remove all SIM cards and external memory cards.
- Sign out of and unlink all cloud accounts (Apple iCloud, Google Account, Samsung Account, etc.).
- Complete an on-site factory data reset. The Purchaser assumes no responsibility for data remaining on devices where the Seller failed to de-link accounts.

---

### 5. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed in accordance with the substantive laws of India. Courts of competent jurisdiction in **Kolkata, West Bengal** shall have exclusive jurisdiction over any disputes arising hereunder.
`,
  },

  SELLER_TERMS: {
    type: "SELLER_TERMS",
    title: "Sell Your Device / Seller Terms & Conditions",
    version: "1.0",
    summary: "Comprehensive commercial terms governing customer device buyback transactions with CashALL.",
    content: `# CASHALL SELLER TERMS & CONDITIONS
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise (operating brand "CashALL")  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

### 1. SCOPE OF SERVICES
CashALL operates a direct consumer electronic device acquisition and recommerce service. Customers act as sellers ("Sellers") and sell eligible pre-owned devices directly to Aarna Enterprise ("Purchaser").

### 2. SELLER ELIGIBILITY
Sellers must:
- Be at least 18 years of age and possess full legal capacity to enter into binding commercial contracts under the Indian Contract Act, 1872.
- Provide a valid mobile number and doorstep pickup address within CashALL's designated service areas.
- Present a valid government-issued photo identity proof (e.g. Aadhaar, Voter ID, PAN, Driving License) for visual verification and anti-theft compliance.

### 3. VALUATION & QUOTE VALIDITY
1. Online quotes are formulated using algorithmic evaluation based entirely on self-assessment responses submitted by the Seller.
2. Online quotes remain valid for 7 days from generation, subject to physical verification confirming declared specifications and condition.
3. Quotes are non-binding until confirmed following physical inspection.

### 4. DOORSTEP INSPECTION & PRICE REVISION
- Physical inspection is conducted by authorized executives to verify screen condition, functional hardware, casing wear, and IMEI validity.
- If physical condition diverges from the online assessment, an objective re-quote is presented.
- The Seller holds the complete right to accept or decline the revised quote without any visit or cancellation charges.

### 5. PAYMENT DISBURSEMENT
- Payout is disbursed immediately via real-time UPI or IMPS bank transfer upon mutual agreement and signature of the Used Device Purchase Agreement.
- Ownership transfers permanently and irrevocably once payment reference is generated.

### 6. DISPUTES & JURISDICTION
Any disputes shall be submitted to the exclusive jurisdiction of the competent courts in **Kolkata, West Bengal**.
`,
  },

  WEBSITE_TERMS: {
    type: "WEBSITE_TERMS",
    title: "Website Terms of Use & Master Policies",
    version: "1.0",
    summary: "General terms governing access and use of cashall.in website and digital services.",
    content: `# CASHALL WEBSITE TERMS OF USE
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

These Terms of Use govern access to and use of https://www.cashall.in operated by Aarna Enterprise. By browsing, accessing, or utilizing the platform, you agree to comply with all applicable Indian laws, including the Information Technology Act, 2000. All intellectual property, trademarks, and content are the property of Aarna Enterprise.
`,
  },

  PRIVACY_POLICY: {
    type: "PRIVACY_POLICY",
    title: "Privacy Policy & DPDP Data Protection Framework",
    version: "1.0",
    summary: "Data protection notice articulating collection, use, retention, and Data Principal rights under DPDP Act 2023.",
    content: `# CASHALL PRIVACY POLICY (DPDP FRAMEWORK)
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Data Fiduciary:** Aarna Enterprise (CashALL)  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

### 1. OVERVIEW & DATA FIDUCIARY IDENTITY
Aarna Enterprise ("CashALL", "we", "us") operates as a Data Fiduciary pursuant to the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000.

### 2. DATA WE COLLECT & PURPOSE
- **Identity & Contact Data:** Name, phone number, email address (for quote generation, pickup communication, and invoice delivery).
- **Logistics Data:** Doorstep address, PIN code (for routing evaluation personnel).
- **Statutory Verification Data:** Masked Government ID details (anti-theft verification as required by Indian commercial practice).
- **Device Identifiers:** IMEI and serial numbers (for national blacklist checks and legal pedigree).
- **Payment Data:** Bank account / UPI VPA (for direct payout disbursement).

### 3. DATA PRINCIPAL RIGHTS (DPDP ACT 2023)
Data Principals have the statutory right to:
1. Request a summary of personal data processed.
2. Request correction or completion of inaccurate personal data.
3. Request erasure of personal data, subject to statutory retention obligations (e.g. GST tax invoice requirements under Section 36 of GST Act).
4. Lodge a grievance with our designated Grievance Officer.

### 4. DATA RETENTION POLICY
[LAWYER TO INSERT APPROVED DATA RETENTION SCHEDULE UNDER DPDP RULES 2025]
Personal data is retained only for the duration necessary to fulfill the transactional purpose or to satisfy statutory obligations under Indian tax, corporate, and criminal law.
`,
  },

  COOKIE_POLICY: {
    type: "COOKIE_POLICY",
    title: "Cookie & Digital Telemetry Policy",
    version: "1.0",
    summary: "Disclosure of cookies, analytics telemetry, and local storage utilization on cashall.in.",
    content: `# CASHALL COOKIE POLICY
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

CashALL uses essential cookies, functional session cookies, and performance telemetry to remember your quote details, authenticate user sessions, and optimize doorstep logistics routing. Users may control cookie preferences via browser settings.
`,
  },

  INSPECTION_REVISION_POLICY: {
    type: "INSPECTION_REVISION_POLICY",
    title: "Device Inspection & Price Revision Policy",
    version: "1.0",
    summary: "Clear rules governing online preliminary estimates vs physical doorstep inspection and price revisions.",
    content: `# CASHALL DEVICE INSPECTION & PRICE REVISION POLICY
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

### 1. ONLINE ESTIMATE VS DOORSTEP PHYSICAL QC
1. The quote generated on cashall.in is an automated preliminary estimate formulated on customer-declared parameters.
2. Final valuation is subject to a physical 15-minute diagnostic inspection by our authorized technician at your doorstep.

### 2. RE-QUOTE PROTOCOL
- If the device matches the declared condition, the full original price is paid.
- If physical, functional, or display defects are discovered that were omitted during online self-assessment, our executive will generate an objective re-quote explaining the diagnostic findings.
- **Customer Rejection Rights:** If you decline the revised valuation, the pickup is cancelled immediately. **CashALL charges ₹0 cancellation fee and ₹0 doorstep visit charge.**
`,
  },

  PICKUP_POLICY: {
    type: "PICKUP_POLICY",
    title: "Doorstep Pickup & Evaluation Policy",
    version: "1.0",
    summary: "Operational guidelines for doorstep pickup appointments, slots, and technician visits.",
    content: `# CASHALL DOORSTEP PICKUP POLICY
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

CashALL provides complimentary doorstep evaluation across serviced districts. Customers must ensure availability during selected appointment windows and verify the identity of the assigned field executive before handing over devices.
`,
  },

  CANCELLATION_POLICY: {
    type: "CANCELLATION_POLICY",
    title: "Cancellation & Transaction Finality Policy",
    version: "1.0",
    summary: "Zero-fee cancellation rules before handover and irrevocable finality following payout.",
    content: `# CASHALL CANCELLATION POLICY
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

- **Before Payment Disbursement:** Customers may cancel their scheduled pickup or reject a revised price valuation at any time prior to payment execution with **zero fees**.
- **Post-Payment Finality:** Once payment has been disbursed and the Used Device Purchase Agreement signed, the transaction is **final and irrevocable**. Devices immediately enter our processing pipeline and cannot be retrieved.
`,
  },

  GRIEVANCE_POLICY: {
    type: "GRIEVANCE_POLICY",
    title: "Grievance Redressal Mechanism & Officer Designation",
    version: "1.0",
    summary: "Statutory grievance officer framework under Consumer Protection (E-Commerce) Rules, 2020 and DPDP Act 2023.",
    content: `# CASHALL GRIEVANCE REDRESSAL MECHANISM
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED - STATUTORY DESIGNATION PENDING CONFIRMATION]

---

### 1. GRIEVANCE REDRESSAL FRAMEWORK
Pursuant to the Consumer Protection (E-Commerce) Rules, 2020, and Section 13 of the Digital Personal Data Protection Act, 2023, CashALL provides a structured mechanism for addressing customer grievances.

### 2. DESIGNATED GRIEVANCE OFFICER
[LAWYER/BUSINESS TO CONFIRM GRIEVANCE OFFICER DETAILS]
- **Designated Officer:** Ankit Gupta (Compliance Officer)
- **Entity:** Aarna Enterprise (CashALL)
- **Email:** support@cashall.in (Subject: "Grievance Officer - Attention")
- **Helpline:** +91 7604092333
- **Registered Address:** Kolkata, West Bengal 711203, India

### 3. TIMELINES FOR REDRESSAL
- Acknowledgment: Within 48 hours of receipt of grievance.
- Redressal: Within 30 days from the date of receipt, subject to statutory limits.
`,
  },

  AGENT_ENGAGEMENT_AGREEMENT: {
    type: "AGENT_ENGAGEMENT_AGREEMENT",
    title: "Field Logistics Agent Appointment & Engagement Agreement",
    version: "1.0",
    summary: "Contractual engagement terms, confidentiality, customer data protection, and liability covenants for field executives.",
    content: `# FIELD LOGISTICS AGENT APPOINTMENT & ENGAGEMENT AGREEMENT
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Principal Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

### 1. SCOPE & FIDUCIARY DUTIES
The Agent is appointed as an authorized field logistics representative of Aarna Enterprise for conducting doorstep device inspection, verifying customer identity proofs, supervising factory data resets, and executing device custody transfers.

### 2. CONFIDENTIALITY & DATA PROTECTION
- The Agent shall not copy, retain, screenshot, or misuse customer personal data (phone numbers, addresses, KYC proofs).
- The Agent shall ensure all customer devices undergo a verified factory reset prior to leaving the customer's presence.

### 3. PROHIBITED CONDUCT
- No off-platform cash transactions or unauthorized pricing overrides.
- No acceptance of devices with altered, missing, or blacklisted IMEI numbers.
- Any breach will result in immediate termination, forfeiture of dues, and reporting to legal authorities.
`,
  },

  AGENT_PICKUP_SOP: {
    type: "AGENT_PICKUP_SOP",
    title: "Field Pickup & Doorstep QC Standard Operating Procedure (SOP)",
    version: "1.0",
    summary: "Step-by-step mandatory operational protocol for field executives during doorstep evaluation.",
    content: `# CASHALL FIELD PICKUP STANDARD OPERATING PROCEDURE (SOP)
**Document Version:** 1.0  
**Effective Date:** January 1, 2026  
**Operating Entity:** Aarna Enterprise  
**Review Status:** [LAWYER REVIEW REQUIRED]

---

### STEP 1: PRE-VISIT VERIFICATION
1. Verify assigned order details and customer contact in the Agent Console.
2. Call the customer 30 minutes prior to arrival to confirm presence and ask them to back up personal data.

### STEP 2: ON-SITE HARDWARE QC
1. Dial *#06# on the device to verify the 15-digit IMEI against the order.
2. Execute the 15-point checklist (screen touch, camera, mic, battery, casing).
3. If defects exist, record objective findings and capture at least 1 clear photo.

### STEP 3: RE-QUOTE & CUSTOMER ACCEPTANCE
1. If price revision is required, explain the diagnostic reasons objectively.
2. Require the customer to accept the revised offer. Never force or coerce a sale.

### STEP 4: ASSISTED DATA SANITIZATION & HANDOVER
1. Guide customer to sign out of iCloud / Google accounts.
2. Perform on-screen factory reset in the customer's presence.
3. Obtain digital signature on the Seller Purchase Agreement.
4. Verify instant UPI payout confirmation before securing the device in the tamper-evident pouch.
`,
  },
};

export class LegalDocumentService {
  /**
   * Computes SHA-256 hash of a text string.
   */
  static computeHash(content: string): string {
    return crypto.createHash("sha256").update(content.trim()).digest("hex");
  }

  /**
   * Retrieves the currently published version of a legal document.
   * If database record does not exist, automatically seeds default template.
   */
  static async getPublishedDocument(type: LegalDocType) {
    try {
      const doc = await prisma.legalDocument.findFirst({
        where: {
          documentType: type as any,
          status: "PUBLISHED",
        },
        orderBy: { effectiveDate: "desc" },
      });

      if (doc) return doc;

      // Check if any version exists
      const existing = await prisma.legalDocument.findFirst({
        where: { documentType: type as any },
        orderBy: { version: "desc" },
      });

      if (existing) return existing;

      // Seed default document
      return await this.seedDocument(type);
    } catch (err: any) {
      logger.warn(`Database legal document fetch failed for ${type}, returning static fallback:`, err?.message);
      const def = DEFAULT_LEGAL_DOCUMENTS[type];
      return {
        id: `static-${type.toLowerCase()}`,
        documentType: type,
        title: def.title,
        version: def.version,
        status: "PUBLISHED",
        content: def.content,
        contentHash: this.computeHash(def.content),
        effectiveDate: new Date("2026-01-01"),
        publishedAt: new Date("2026-01-01"),
      };
    }
  }

  /**
   * Seeds a single default document into the database.
   */
  static async seedDocument(type: LegalDocType) {
    const def = DEFAULT_LEGAL_DOCUMENTS[type];
    const hash = this.computeHash(def.content);

    try {
      return await prisma.legalDocument.upsert({
        where: {
          documentType_version: {
            documentType: type as any,
            version: def.version,
          },
        },
        update: {},
        create: {
          documentType: type as any,
          title: def.title,
          version: def.version,
          status: "PUBLISHED",
          content: def.content,
          summaryOfChanges: def.summary,
          contentHash: hash,
          effectiveDate: new Date("2026-01-01"),
          publishedAt: new Date("2026-01-01"),
        },
      });
    } catch (e: any) {
      logger.error(`Failed to seed legal document ${type}:`, e);
      return {
        id: `static-${type.toLowerCase()}`,
        documentType: type,
        title: def.title,
        version: def.version,
        status: "PUBLISHED",
        content: def.content,
        contentHash: hash,
        effectiveDate: new Date("2026-01-01"),
        publishedAt: new Date("2026-01-01"),
      };
    }
  }

  /**
   * Seeds all default documents into the database if not present.
   */
  static async seedAllDefaultDocuments() {
    const types = Object.keys(DEFAULT_LEGAL_DOCUMENTS) as LegalDocType[];
    const results = [];
    for (const t of types) {
      results.push(await this.seedDocument(t));
    }
    return results;
  }
}
