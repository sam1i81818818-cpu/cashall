import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";

export interface Ps5Rental {
  id: string;
  rentalNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  pincode: string;
  govtIdType?: string;
  govtIdNumber?: string;
  consoleModel: "PS5 Disc Edition" | "PS5 Digital Edition" | string;
  rentalPackage?: "CONSOLE_ONLY" | "CONSOLE_CD" | "CONSOLE_DIGITAL_ID";
  startDate: string;
  endDate: string;
  totalDays: number;
  extendedDays: number;
  dailyRate: number; // 399, 499, or 599
  cdCount: number;
  cdRate: number; // 0 (included in 499) or 100
  selectedGames: string[];
  extraControllers: boolean;
  totalAmount: number;
  paymentStatus: "PENDING_ON_DELIVERY" | "PAID";
  rentalStatus:
    | "BOOKED"
    | "AGENT_ASSIGNED"
    | "OUT_FOR_DELIVERY"
    | "ACTIVE"
    | "EXTENDED"
    | "RETURN_SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";
  assignedAgentId?: string;
  assignedAgentName?: string;
  preDeliveryVideoUrl?: string;
  returnVideoUrl?: string;
  consoleSerialNumber?: string;
  controller1SerialNumber?: string;
  controller2SerialNumber?: string;
  accessoriesDelivered?: {
    powerCable?: boolean;
    hdmiCable?: boolean;
    typecCable?: boolean;
    baseStand?: boolean;
    carryingCase?: boolean;
    other?: string;
  };
  inspectionChecklist?: {
    outerBodyIntact?: boolean;
    portsOk?: boolean;
    sealIntact?: boolean;
    buttonsTested?: boolean;
    stickDriftChecked?: boolean;
    videoRecorded?: boolean;
  };
  customerSignature?: string;
  agentSignature?: string;
  signedAt?: string;
  reportedDefects?: string;
  repairCost?: number;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORE_FILE = path.join(process.cwd(), "data", "ps5_rentals.json");

function ensureDataDir() {
  const dir = path.dirname(LOCAL_STORE_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {}
  }
}

function readLocalRentals(): Ps5Rental[] {
  ensureDataDir();
  if (fs.existsSync(LOCAL_STORE_FILE)) {
    try {
      const data = fs.readFileSync(LOCAL_STORE_FILE, "utf-8");
      return JSON.parse(data) || [];
    } catch {}
  }
  return [];
}

function writeLocalRentals(rentals: Ps5Rental[]) {
  ensureDataDir();
  try {
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(rentals, null, 2));
  } catch {}
}

let tableInitialized = false;

async function ensureTable() {
  if (tableInitialized) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS ps5_rentals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rental_number VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(255),
        delivery_address TEXT NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        govt_id_type VARCHAR(50),
        govt_id_number VARCHAR(100),
        console_model VARCHAR(50) DEFAULT 'PS5 Disc Edition',
        start_date VARCHAR(50) NOT NULL,
        end_date VARCHAR(50) NOT NULL,
        total_days INT NOT NULL,
        extended_days INT DEFAULT 0,
        daily_rate NUMERIC DEFAULT 500,
        cd_count INT DEFAULT 0,
        cd_rate NUMERIC DEFAULT 100,
        selected_games JSONB DEFAULT '[]',
        extra_controllers BOOLEAN DEFAULT false,
        total_amount NUMERIC NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'PENDING_ON_DELIVERY',
        rental_status VARCHAR(50) DEFAULT 'BOOKED',
        assigned_agent_id VARCHAR(100),
        assigned_agent_name VARCHAR(255),
        pre_delivery_video_url TEXT,
        return_video_url TEXT,
        console_serial_number VARCHAR(100),
        controller1_serial_number VARCHAR(100),
        controller2_serial_number VARCHAR(100),
        accessories_delivered JSONB DEFAULT '{}',
        inspection_checklist JSONB DEFAULT '{}',
        customer_signature TEXT,
        agent_signature TEXT,
        signed_at TIMESTAMPTZ,
        reported_defects TEXT,
        repair_cost NUMERIC DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    tableInitialized = true;
  } catch (err) {
    console.warn("Could not ensure ps5_rentals table, using local file store fallback:", err);
  }
}

export async function getAllRentals(): Promise<Ps5Rental[]> {
  await ensureTable();
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        id, rental_number as "rentalNumber", customer_name as "customerName",
        customer_phone as "customerPhone", customer_email as "customerEmail",
        delivery_address as "deliveryAddress", pincode, govt_id_type as "govtIdType",
        govt_id_number as "govtIdNumber", console_model as "consoleModel",
        start_date as "startDate", end_date as "endDate", total_days as "totalDays",
        extended_days as "extendedDays", daily_rate as "dailyRate", cd_count as "cdCount",
        cd_rate as "cdRate", selected_games as "selectedGames", extra_controllers as "extraControllers",
        total_amount as "totalAmount", payment_status as "paymentStatus",
        rental_status as "rentalStatus", assigned_agent_id as "assignedAgentId",
        assigned_agent_name as "assignedAgentName", pre_delivery_video_url as "preDeliveryVideoUrl",
        return_video_url as "returnVideoUrl", console_serial_number as "consoleSerialNumber",
        controller1_serial_number as "controller1SerialNumber",
        controller2_serial_number as "controller2SerialNumber",
        accessories_delivered as "accessoriesDelivered",
        inspection_checklist as "inspectionChecklist",
        customer_signature as "customerSignature", agent_signature as "agentSignature",
        signed_at as "signedAt", reported_defects as "reportedDefects",
        repair_cost as "repairCost", created_at as "createdAt", updated_at as "updatedAt"
      FROM ps5_rentals
      ORDER BY created_at DESC;
    `);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => ({
        ...r,
        totalAmount: Number(r.totalAmount),
        dailyRate: Number(r.dailyRate),
        cdRate: Number(r.cdRate),
        repairCost: Number(r.repairCost || 0),
        selectedGames: typeof r.selectedGames === "string" ? JSON.parse(r.selectedGames) : r.selectedGames || [],
        accessoriesDelivered: typeof r.accessoriesDelivered === "string" ? JSON.parse(r.accessoriesDelivered) : r.accessoriesDelivered || {},
        inspectionChecklist: typeof r.inspectionChecklist === "string" ? JSON.parse(r.inspectionChecklist) : r.inspectionChecklist || {},
      }));
    }
  } catch (e) {
    console.warn("Postgres query failed, falling back to local file:", e);
  }
  return readLocalRentals();
}

export async function getRentalByNumber(rentalNumber: string): Promise<Ps5Rental | null> {
  await ensureTable();
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        id, rental_number as "rentalNumber", customer_name as "customerName",
        customer_phone as "customerPhone", customer_email as "customerEmail",
        delivery_address as "deliveryAddress", pincode, govt_id_type as "govtIdType",
        govt_id_number as "govtIdNumber", console_model as "consoleModel",
        start_date as "startDate", end_date as "endDate", total_days as "totalDays",
        extended_days as "extendedDays", daily_rate as "dailyRate", cd_count as "cdCount",
        cd_rate as "cdRate", selected_games as "selectedGames", extra_controllers as "extraControllers",
        total_amount as "totalAmount", payment_status as "paymentStatus",
        rental_status as "rentalStatus", assigned_agent_id as "assignedAgentId",
        assigned_agent_name as "assignedAgentName", pre_delivery_video_url as "preDeliveryVideoUrl",
        return_video_url as "returnVideoUrl", console_serial_number as "consoleSerialNumber",
        controller1_serial_number as "controller1SerialNumber",
        controller2_serial_number as "controller2SerialNumber",
        accessories_delivered as "accessoriesDelivered",
        inspection_checklist as "inspectionChecklist",
        customer_signature as "customerSignature", agent_signature as "agentSignature",
        signed_at as "signedAt", reported_defects as "reportedDefects",
        repair_cost as "repairCost", created_at as "createdAt", updated_at as "updatedAt"
      FROM ps5_rentals
      WHERE rental_number = $1
      LIMIT 1;
    `, rentalNumber);

    if (Array.isArray(rows) && rows.length > 0) {
      const r = rows[0];
      return {
        ...r,
        totalAmount: Number(r.totalAmount),
        dailyRate: Number(r.dailyRate),
        cdRate: Number(r.cdRate),
        repairCost: Number(r.repairCost || 0),
        selectedGames: typeof r.selectedGames === "string" ? JSON.parse(r.selectedGames) : r.selectedGames || [],
        accessoriesDelivered: typeof r.accessoriesDelivered === "string" ? JSON.parse(r.accessoriesDelivered) : r.accessoriesDelivered || {},
        inspectionChecklist: typeof r.inspectionChecklist === "string" ? JSON.parse(r.inspectionChecklist) : r.inspectionChecklist || {},
      };
    }
  } catch (e) {
    console.warn("Postgres query by number failed, checking local file:", e);
  }

  const locals = readLocalRentals();
  return locals.find((r) => r.rentalNumber.toUpperCase() === rentalNumber.toUpperCase()) || null;
}

export async function createRental(data: Omit<Ps5Rental, "id" | "createdAt" | "updatedAt">): Promise<Ps5Rental> {
  await ensureTable();
  const id = `ps5_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const rental: Ps5Rental = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  // 1. Save to local fallback
  const locals = readLocalRentals();
  locals.unshift(rental);
  writeLocalRentals(locals);

  // 2. Save to Postgres
  try {
    await prisma.$executeRawUnsafe(`
      INSERT INTO ps5_rentals (
        rental_number, customer_name, customer_phone, customer_email,
        delivery_address, pincode, govt_id_type, govt_id_number,
        console_model, start_date, end_date, total_days, extended_days,
        daily_rate, cd_count, cd_rate, selected_games, extra_controllers,
        total_amount, payment_status, rental_status, assigned_agent_name,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17::jsonb, $18, $19, $20, $21, $22, NOW(), NOW()
      );
    `,
      rental.rentalNumber,
      rental.customerName,
      rental.customerPhone,
      rental.customerEmail || null,
      rental.deliveryAddress,
      rental.pincode,
      rental.govtIdType || null,
      rental.govtIdNumber || null,
      rental.consoleModel,
      rental.startDate,
      rental.endDate,
      rental.totalDays,
      rental.extendedDays || 0,
      rental.dailyRate,
      rental.cdCount,
      rental.cdRate,
      JSON.stringify(rental.selectedGames || []),
      rental.extraControllers,
      rental.totalAmount,
      rental.paymentStatus,
      rental.rentalStatus,
      rental.assignedAgentName || null
    );
  } catch (err) {
    console.error("Failed to insert into ps5_rentals postgres:", err);
  }

  return rental;
}

export async function updateRental(
  rentalNumber: string,
  updates: Partial<Ps5Rental>
): Promise<Ps5Rental | null> {
  await ensureTable();
  const now = new Date().toISOString();

  // 1. Update local
  const locals = readLocalRentals();
  const idx = locals.findIndex((r) => r.rentalNumber.toUpperCase() === rentalNumber.toUpperCase());
  let updatedLocal: Ps5Rental | null = null;
  if (idx !== -1) {
    locals[idx] = { ...locals[idx], ...updates, updatedAt: now };
    writeLocalRentals(locals);
    updatedLocal = locals[idx];
  }

  // 2. Update Postgres
  try {
    const existing = await getRentalByNumber(rentalNumber);
    if (existing) {
      const merged: Ps5Rental = { ...existing, ...updates, updatedAt: now };
      await prisma.$executeRawUnsafe(`
        UPDATE ps5_rentals SET
          rental_status = $1,
          payment_status = $2,
          extended_days = $3,
          end_date = $4,
          total_amount = $5,
          assigned_agent_id = $6,
          assigned_agent_name = $7,
          pre_delivery_video_url = $8,
          return_video_url = $9,
          console_serial_number = $10,
          controller1_serial_number = $11,
          controller2_serial_number = $12,
          accessories_delivered = $13::jsonb,
          inspection_checklist = $14::jsonb,
          customer_signature = $15,
          agent_signature = $16,
          signed_at = $17,
          reported_defects = $18,
          repair_cost = $19,
          updated_at = NOW()
        WHERE rental_number = $20;
      `,
        merged.rentalStatus,
        merged.paymentStatus,
        merged.extendedDays,
        merged.endDate,
        merged.totalAmount,
        merged.assignedAgentId || null,
        merged.assignedAgentName || null,
        merged.preDeliveryVideoUrl || null,
        merged.returnVideoUrl || null,
        merged.consoleSerialNumber || null,
        merged.controller1SerialNumber || null,
        merged.controller2SerialNumber || null,
        JSON.stringify(merged.accessoriesDelivered || {}),
        JSON.stringify(merged.inspectionChecklist || {}),
        merged.customerSignature || null,
        merged.agentSignature || null,
        merged.signedAt ? new Date(merged.signedAt) : null,
        merged.reportedDefects || null,
        merged.repairCost || 0,
        rentalNumber
      );
      return merged;
    }
  } catch (err) {
    console.error("Failed to update ps5_rentals in Postgres:", err);
  }

  return updatedLocal;
}
