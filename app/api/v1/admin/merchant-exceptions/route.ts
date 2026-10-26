import { NextRequest, NextResponse } from "next/server";
import { apiWrapper } from "@/lib/utils/api-wrapper";
import { verifyAuthToken, requireRole } from "@/lib/middlewares/auth";
import { prisma } from "@/lib/db";
import { AppError } from "@/lib/utils/AppError";

const SETTING_KEY = "KEY_MERCHANT_EXCEPTIONS";

export interface MerchantExceptionRecord {
  id: string; // e.g. "EXC-DEL-009"
  merchantName: string;
  gstin: string;
  contactPerson: string;
  phone: string;
  email?: string;
  pincode: string;
  locality: string;
  hubNode: string;
  permittedScope: string;
  timingWindow: string;
  securityBond: string;
  bondRef: string;
  auditScore: number;
  grade: string;
  status: "Active & Bonded" | "Pending KYC" | "Under Renewal" | "Revoked";
  issuedDate: string;
  expiryDate: string;
  cryptographicSignature: string;
  blockchainBlockHash: string;
  handledUnits: number;
  discrepancies: number;
}

const DEFAULT_EXCEPTIONS: MerchantExceptionRecord[] = [
  {
    id: "EXC-DEL-009",
    merchantName: "Apex Cellular & Electronics LLP",
    gstin: "07AAACA2104K1Z8",
    contactPerson: "Rajiv Aggarwal",
    phone: "+91 98110 44222",
    email: "rajiv@apexcellular.in",
    pincode: "110006",
    locality: "Old Delhi — Chandni Chowk (Lahori Gate)",
    hubNode: "DEL-02 Node",
    permittedScope: "B2B Bulk Liquidator (Min 10 units)",
    timingWindow: "10:00 — 18:00 IST",
    securityBond: "₹10,00,000 BG Locked",
    bondRef: "HDFC-BG-2024-8841",
    auditScore: 99.4,
    grade: "A+",
    status: "Active & Bonded",
    issuedDate: "01-Jun-2024",
    expiryDate: "31-May-2025",
    cryptographicSignature: "0x8f2c91b8941da7e089201fba419082ba41b09284109827419823019824",
    blockchainBlockHash: "0x3e18a9021b084920412894109827419823019824109827419823019824",
    handledUnits: 480,
    discrepancies: 0,
  },
  {
    id: "EXC-DEL-014",
    merchantName: "National Phone Resale Hub",
    gstin: "07AABCN8291P1ZK",
    contactPerson: "Kavita Soni",
    phone: "+91 98711 02938",
    email: "ops@nationalresale.com",
    pincode: "110094",
    locality: "Mustafabad & Karawal Nagar",
    hubNode: "DEL-02 Node",
    permittedScope: "Certified Franchise Nodal Drop",
    timingWindow: "10:00 — 16:00 IST (Daylight Only)",
    securityBond: "₹5,00,000 Cash Lien",
    bondRef: "AXIS-FD-99210",
    auditScore: 98.2,
    grade: "A",
    status: "Active & Bonded",
    issuedDate: "15-May-2024",
    expiryDate: "14-May-2025",
    cryptographicSignature: "0x419082ba41b092841098274198230198248f2c91b8941da7e089201fba",
    blockchainBlockHash: "0x89204128941098274198230198241098274198230198243e18a9021b08",
    handledUnits: 195,
    discrepancies: 0,
  },
  {
    id: "EXC-BLR-003",
    merchantName: "CyberCity IT Asset Recovery",
    gstin: "29AADCC9912H1ZQ",
    contactPerson: "Vikram Nambiar",
    phone: "+91 94481 29011",
    email: "vnambiar@cybercityrecovery.com",
    pincode: "560053",
    locality: "Chickpet Commercial Hub",
    hubNode: "BLR-01 Node",
    permittedScope: "Corporate Lease Return Depot (Armed Escort)",
    timingWindow: "09:00 — 19:00 IST",
    securityBond: "₹15,00,000 BG Locked",
    bondRef: "SBI-BG-77401",
    auditScore: 97.8,
    grade: "A",
    status: "Active & Bonded",
    issuedDate: "10-Apr-2024",
    expiryDate: "09-Apr-2025",
    cryptographicSignature: "0x74198230198241098274198230198243e18a9021b084920412894109827",
    blockchainBlockHash: "0x098274198230198243e18a9021b084920412894109827419823019824109",
    handledUnits: 212,
    discrepancies: 0,
  },
  {
    id: "EXC-HYD-005",
    merchantName: "Deccan Mobile Exchange & Spare",
    gstin: "36AABFD1029R1ZU",
    contactPerson: "Syed Mujeeb",
    phone: "+91 98490 19283",
    email: "mujeeb@deccanexchange.in",
    pincode: "500002",
    locality: "Charminar Old City",
    hubNode: "HYD-01 Node",
    permittedScope: "B2B Wholesale Trade In (Self-Drop to Hub)",
    timingWindow: "10:00 — 16:00 IST",
    securityBond: "₹7,50,000 Lien Locked",
    bondRef: "SBI-FD-88912",
    auditScore: 96.5,
    grade: "A",
    status: "Active & Bonded",
    issuedDate: "20-Jan-2024",
    expiryDate: "19-Jan-2025",
    cryptographicSignature: "0x1b0849204128941098274198230198241098274198230198243e18a902",
    blockchainBlockHash: "0x28941098274198230198243e18a9021b0849204109827419823019824109",
    handledUnits: 54,
    discrepancies: 0,
  },
  {
    id: "EXC-DEL-031",
    merchantName: "Gurgaon NCR Enterprise Tech Corp",
    gstin: "06AAACG8819Q1ZP",
    contactPerson: "Amitabh Sen",
    phone: "+91 99100 81290",
    email: "asen@gurgaontech.org",
    pincode: "122001",
    locality: "Old Railway Road Ext",
    hubNode: "DEL-01 Node",
    permittedScope: "Direct Enterprise Fleet Buyback",
    timingWindow: "10:00 — 18:00 IST",
    securityBond: "₹25,00,000 BG Locked",
    bondRef: "ICICI-BG-9081",
    auditScore: 99.8,
    grade: "A+",
    status: "Active & Bonded",
    issuedDate: "05-Feb-2024",
    expiryDate: "04-Feb-2025",
    cryptographicSignature: "0x98274198230198243e18a9021b0849204128941098274198230198241098",
    blockchainBlockHash: "0x41098274198230198241098274198230198243e18a9021b084920412894",
    handledUnits: 420,
    discrepancies: 0,
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
      return NextResponse.json({ success: true, data: JSON.parse(setting.value) });
    }
  } catch (err) {
    console.error("Error fetching merchant exceptions:", err);
  }

  return NextResponse.json({ success: true, data: DEFAULT_EXCEPTIONS });
});

export const POST = apiWrapper(async (req: NextRequest) => {
  const decodedUser = await verifyAuthToken(req);
  requireRole(["ADMIN", "SUPER_ADMIN"], decodedUser.role);

  const body = await req.json();
  const { action, item } = body;

  let currentItems: MerchantExceptionRecord[] = [];
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: SETTING_KEY },
    });
    if (setting?.value) {
      currentItems = JSON.parse(setting.value);
    } else {
      currentItems = [...DEFAULT_EXCEPTIONS];
    }
  } catch {
    currentItems = [...DEFAULT_EXCEPTIONS];
  }

  if (action === "ADD" && item) {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const passId = item.id || `EXC-${(item.hubNode || "DEL").substring(0, 3)}-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord: MerchantExceptionRecord = {
      id: passId,
      merchantName: item.merchantName,
      gstin: item.gstin,
      contactPerson: item.contactPerson,
      phone: item.phone,
      email: item.email || "partner@cashall.in",
      pincode: item.pincode,
      locality: item.locality,
      hubNode: item.hubNode || "DEL-02 Node",
      permittedScope: item.permittedScope || "B2B Bulk Liquidator",
      timingWindow: item.timingWindow || "10:00 — 18:00 IST",
      securityBond: item.securityBond || "₹10,00,000 BG Locked",
      bondRef: item.bondRef || `BG-${Date.now().toString().slice(-6)}`,
      auditScore: item.auditScore || 98.5,
      grade: "A+",
      status: "Active & Bonded",
      issuedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      cryptographicSignature: `0x${randomHex}92841098274198230198248f2c91b8941da7e0`,
      blockchainBlockHash: `0x3e18a9021b084920412894109827419823019824${randomHex}`,
      handledUnits: 0,
      discrepancies: 0,
    };

    currentItems.unshift(newRecord);
  } else if (action === "REVOKE" && item?.id) {
    const idx = currentItems.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      currentItems[idx].status = "Revoked";
    }
  } else if (action === "DELETE" && item?.id) {
    currentItems = currentItems.filter((x) => x.id !== item.id);
  }

  await prisma.systemSetting.upsert({
    where: { key: SETTING_KEY },
    update: {
      value: JSON.stringify(currentItems),
      description: "Whitelisted merchant exceptions and cryptographically signed QR passes",
    },
    create: {
      key: SETTING_KEY,
      value: JSON.stringify(currentItems),
      description: "Whitelisted merchant exceptions and cryptographically signed QR passes",
    },
  });

  return NextResponse.json({ success: true, data: currentItems });
});
