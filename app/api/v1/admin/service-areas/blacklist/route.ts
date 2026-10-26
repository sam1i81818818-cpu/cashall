import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";

const SETTING_KEY = "KEY_BLACKLISTED_PINCODES";

export interface BlacklistedPincodeRecord {
  id: string;
  pincode: string;
  locality: string;
  subArea: string;
  hubNode: string;
  hubName: string;
  tier: "Hard Blacklist" | "Safety Redline" | "Fraud Syndicate" | "Escrow Pre-Auth" | "Slum Cluster";
  reason: string;
  riskScore: number;
  policeFirs?: string;
  failedVisits?: string;
  enforcement: string;
  status: "Active" | "Pending Field Audit" | "Bypass Exception";
  perimeterKm2: number;
  coordinates: string;
  notes?: string;
  incidents: {
    title: string;
    date: string;
    detail: string;
    type: "police" | "device" | "bot" | "warning";
  }[];
  updatedAt: string;
}

const DEFAULT_BLACKLISTED: BlacklistedPincodeRecord[] = [
  {
    id: "BLK-110006",
    pincode: "110006",
    locality: "Old Delhi — Chandni Chowk",
    subArea: "Lahori Gate / Khari Baoli",
    hubNode: "DEL-02 Node",
    hubName: "Delhi NCR Central",
    tier: "Hard Blacklist",
    reason: "High Cash Theft & Repeated Counterfeit Device Trade",
    riskScore: 98,
    policeFirs: "4 Police FIRs",
    enforcement: "Auto-Reject (₹0 Cap)",
    status: "Active",
    perimeterKm2: 3.2,
    coordinates: "28.6562° N, 77.2307° E",
    incidents: [
      {
        title: "Police Inquiry Cross-Match (FIR #1842)",
        date: "14 May 2024",
        detail: "IMEI 3582••••8491 traced to Lahori Gate bazaar syndicate; linked to 2 prior fraudulent buyback requests on Delhi West node.",
        type: "police",
      },
      {
        title: "Counterfeit Display Swap Attempt",
        date: "28 Apr 2024",
        detail: "Lead Tech Pooja Sharma escalated counterfeit display swap attempt on iPhone 13 Pro during on-site valuation; hostile handover averted.",
        type: "device",
      },
      {
        title: "Bot Quotation Burst Auto-Flag",
        date: "10 Jan 2024",
        detail: "Automated security engine flagged 5 consecutive bogus quotation requests originating from single IP subnet in under 120 minutes.",
        type: "bot",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BLK-110094",
    pincode: "110094",
    locality: "Mustafabad & Shiv Vihar",
    subArea: "Karawal Nagar Corridor",
    hubNode: "DEL-02 Node",
    hubName: "Delhi North-East",
    tier: "Safety Redline",
    reason: "Technician Assault Risk & Late-Hour Unsafe Transit Corridor",
    riskScore: 92,
    failedVisits: "7 Dispatch Aborts",
    enforcement: "Escort Required / Daylight Only",
    status: "Active",
    perimeterKm2: 4.5,
    coordinates: "28.7182° N, 77.2748° E",
    incidents: [
      {
        title: "Field Force Threat Report #581",
        date: "02 Mar 2024",
        detail: "Field executive reported verbal intimidation and cash demand during late evening evaluation slot. Dispatches restricted to 10AM-4PM buddy-system only.",
        type: "warning",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BLK-560053",
    pincode: "560053",
    locality: "Chickpet Commercial Market",
    subArea: "Avenue Road / Balepet",
    hubNode: "BLR-01 Node",
    hubName: "Bengaluru Central",
    tier: "Fraud Syndicate",
    reason: "Grey Market Refurbished Boards Masquerading as Genuine OEM",
    riskScore: 89,
    policeFirs: "2 Police Inquiries",
    enforcement: "Physical Store QC Only",
    status: "Active",
    perimeterKm2: 2.1,
    coordinates: "12.9716° N, 77.5753° E",
    incidents: [
      {
        title: "Swapped Logic Board Intercept",
        date: "19 Feb 2024",
        detail: "Samsung Galaxy S23 Ultra inspection identified swapped Snapdragon logic board with non-matching hardware fingerprint.",
        type: "device",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BLK-500002",
    pincode: "500002",
    locality: "Charminar Old City",
    subArea: "Gulzar Houz / Lad Bazaar",
    hubNode: "HYD-01 Node",
    hubName: "Hyderabad South",
    tier: "Escrow Pre-Auth",
    reason: "High RTO & Cash-on-Doorstep Absconding Patterns",
    riskScore: 78,
    failedVisits: "5 Failed Field Visits",
    enforcement: "Pre-paid Escrow Only",
    status: "Active",
    perimeterKm2: 3.8,
    coordinates: "17.3616° N, 78.4747° E",
    incidents: [
      {
        title: "Fake Address Density Spike",
        date: "08 Dec 2023",
        detail: "3 repeated orders cancelled upon rider arrival at non-existent commercial addresses.",
        type: "warning",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BLK-122001",
    pincode: "122001",
    locality: "Old Railway Road Ext",
    subArea: "Bhim Nagar / Jacobpura",
    hubNode: "DEL-01 Node",
    hubName: "South NCR Node",
    tier: "Slum Cluster",
    reason: "Inaccessible Narrow Alleyways / Constant Logistics SLA Overruns",
    riskScore: 64,
    failedVisits: "SLA Overrun >120m",
    enforcement: "Hub Pickup Only",
    status: "Active",
    perimeterKm2: 5.0,
    coordinates: "28.4595° N, 77.0266° E",
    incidents: [
      {
        title: "Transit Inaccessibility Escalation",
        date: "12 Nov 2023",
        detail: "Motorcycles and EVs unable to penetrate pedestrianized grid; orders delayed >3 hours.",
        type: "warning",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "BLK-700001",
    pincode: "700001",
    locality: "Burrabazar & BBD Bagh",
    subArea: "Cotton Street / Canning Street",
    hubNode: "CCU-01 Node",
    hubName: "Kolkata Central",
    tier: "Fraud Syndicate",
    reason: "Bulk Stolen iPhone Consignments & Fake Bill Verification Breaches",
    riskScore: 91,
    policeFirs: "3 Police FIRs",
    enforcement: "Strict Serial IMEI Verification",
    status: "Active",
    perimeterKm2: 2.8,
    coordinates: "22.5804° N, 88.3512° E",
    incidents: [
      {
        title: "Stolen Device IMEI Match",
        date: "18 Jun 2024",
        detail: "Two iPhone 14 units flagged by West Bengal Police central portal as reported snatched in Howrah.",
        type: "police",
      },
    ],
    updatedAt: new Date().toISOString(),
  },
];

export const GET = apiWrapper(async (req: NextRequest) => {
  const decodedUser = await verifyAuthToken(req);
  requireRole(["ADMIN", "SUPER_ADMIN"], decodedUser.role);

  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: SETTING_KEY },
    });

    if (setting && setting.value) {
      const parsed = JSON.parse(setting.value);
      return NextResponse.json({ success: true, data: parsed });
    }
  } catch (err) {
    console.error("Error reading blacklisted pincodes:", err);
  }

  // Return default data if not yet customized in database
  return NextResponse.json({ success: true, data: DEFAULT_BLACKLISTED });
});

export const POST = apiWrapper(async (req: NextRequest) => {
  const decodedUser = await verifyAuthToken(req);
  requireRole(["ADMIN", "SUPER_ADMIN"], decodedUser.role);

  const body = await req.json();
  const { action, item, items } = body;

  let currentItems: BlacklistedPincodeRecord[] = [];
  try {
    const existing = await prisma.systemSetting.findUnique({
      where: { key: SETTING_KEY },
    });
    if (existing?.value) {
      currentItems = JSON.parse(existing.value);
    } else {
      currentItems = [...DEFAULT_BLACKLISTED];
    }
  } catch {
    currentItems = [...DEFAULT_BLACKLISTED];
  }

  if (action === "REPLACE_ALL" && Array.isArray(items)) {
    currentItems = items;
  } else if (action === "ADD" && item) {
    const cleanPin = String(item.pincode).trim();
    const existingIdx = currentItems.findIndex((x) => x.pincode === cleanPin);
    const newRecord: BlacklistedPincodeRecord = {
      id: item.id || `BLK-${cleanPin}`,
      pincode: cleanPin,
      locality: item.locality || `Postal Area ${cleanPin}`,
      subArea: item.subArea || "Custom Exclusion Zone",
      hubNode: item.hubNode || "DEL-02 Node",
      hubName: item.hubName || "Operational Hub",
      tier: item.tier || "Hard Blacklist",
      reason: item.reason || "Manual Risk Exclusion Triggered",
      riskScore: item.riskScore || 85,
      policeFirs: item.policeFirs,
      failedVisits: item.failedVisits,
      enforcement: item.enforcement || "Auto-Reject (₹0 Cap)",
      status: item.status || "Active",
      perimeterKm2: item.perimeterKm2 || 2.5,
      coordinates: item.coordinates || "28.6139° N, 77.2090° E",
      notes: item.notes,
      incidents: item.incidents || [
        {
          title: "Manual Administrative Blacklist Initiated",
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
          detail: item.notes || "Blacklist restriction manually enforced by CashALL Security Lead.",
          type: "warning",
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      currentItems[existingIdx] = newRecord;
    } else {
      currentItems.unshift(newRecord);
    }

    // Also sync with prisma.serviceArea by marking active = false
    try {
      await prisma.serviceArea.upsert({
        where: { pincode: cleanPin },
        update: { active: false, pickupAvailable: false },
        create: {
          pincode: cleanPin,
          city: item.locality || "Exclusion Zone",
          state: "Delhi",
          active: false,
          pickupAvailable: false,
        },
      });
    } catch (e) {
      console.warn("Could not sync serviceArea model:", e);
    }
  } else if (action === "DELETE" && item?.pincode) {
    currentItems = currentItems.filter((x) => x.pincode !== String(item.pincode).trim());
    // Re-enable service area
    try {
      await prisma.serviceArea.updateMany({
        where: { pincode: String(item.pincode).trim() },
        data: { active: true, pickupAvailable: true },
      });
    } catch {}
  } else if (action === "UPDATE_STATUS" && item?.pincode) {
    const idx = currentItems.findIndex((x) => x.pincode === String(item.pincode).trim());
    if (idx >= 0) {
      currentItems[idx].status = item.status;
      if (item.notes) currentItems[idx].notes = item.notes;
      currentItems[idx].updatedAt = new Date().toISOString();
    }
  }

  // Persist to Postgres SystemSetting
  await prisma.systemSetting.upsert({
    where: { key: SETTING_KEY },
    update: {
      value: JSON.stringify(currentItems),
      description: "Restricted and blacklisted pincodes security exclusion matrix",
    },
    create: {
      key: SETTING_KEY,
      value: JSON.stringify(currentItems),
      description: "Restricted and blacklisted pincodes security exclusion matrix",
    },
  });

  return NextResponse.json({ success: true, data: currentItems });
});
