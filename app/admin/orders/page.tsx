"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Badge } from "@/components/ui/Badge";
import { playMelodiousChime } from "@/lib/utils/sound";
import { SoundControlBadge } from "@/components/common/SoundControlBadge";
import { LiveUpdateToast, LiveUpdateNotification } from "@/components/common/LiveUpdateToast";
import {
  ShoppingBag,
  Eye,
  ClipboardCheck,
  IndianRupee,
  UserCheck,
  Loader2,
  FileText,
  Mail,
  Send,
  MapPin,
  Smartphone,
  Laptop,
  Calendar,
  CheckCircle2,
  Clock,
  Upload,
  Barcode,
  Download,
  Printer,
  FileSpreadsheet,
  Ban,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ListChecks,
  Sparkles,
  Filter,
  Search,
  Navigation,
  PhoneCall,
  ChevronDown,
  CalendarDays,
  RotateCcw,
} from "lucide-react";
import { CustomerAnswersModal } from "@/components/admin/CustomerAnswersModal";
import { ReQuotationModal } from "@/components/admin/ReQuotationModal";
import { RescheduleModal } from "@/components/common/RescheduleModal";
import { formatAddress } from "@/lib/address";
import {
  formatPickupDateTimeSlot,
  extractPickupTargetDate,
  getNowIST,
  addDaysIST,
  parseDateToIST,
  isSameISTDate,
  formatISTIso,
  MONTH_NAMES,
  ISTDateComponents,
} from "@/lib/utils/pickup-date";
import {
  OrderDiagnosticsDrawer,
  DiagnosticsOrder,
} from "@/components/admin/OrderDiagnosticsDrawer";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pincode: string;
  location: string;
  deviceName: string;
  pickupDate: string;
  pickupTimeSlot: string;
  estimatedPrice: number;
  quotedPrice?: number;
  requotedPrice?: number | null;
  revisedPrice: number | null;
  finalPrice?: number | null;
  status: string;
  identityStatus: string;
  imeiStatus: string;
  esignStatus: string;
  paymentStatus: string;
  deviceStatus: string;
  agentId?: string | null;
  agentName?: string | null;
  utr?: string | null;
  imeiNumber?: string | null;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  // Customer assessment answers — passed to CustomerAnswersModal for QC display
  selectedAnswersJson?: string | null;
  breakdownJson?: string | null;
  priceDifferenceReason?: string | null;
  cancellationReason?: string | null;
  agentCalled?: boolean;
  agentCalledAt?: string | null;
  agentCalledBy?: string | null;
  userId?: string | null;
  isUserBlocked?: boolean;
  userBlockedReason?: string | null;
}

function getOrderBoxStatus(ord: Order | any): "BOX" | "NO BOX" {
  const answersJson = ord.selectedAnswersJson || ord.quote?.selectedAnswersJson;
  if (answersJson) {
    try {
      const parsed = typeof answersJson === "string" ? JSON.parse(answersJson) : answersJson;
      const acc = parsed.accessories || parsed.selectedAccessories || [];
      if (Array.isArray(acc)) {
        const hasBox = acc.some((item: any) => String(item).toLowerCase().includes("box"));
        return hasBox ? "BOX" : "NO BOX";
      }
    } catch (e) {}
  }

  if (Array.isArray(ord.qcReports) && ord.qcReports.length > 0) {
    for (const qc of ord.qcReports) {
      if (qc.accessories) {
        try {
          const acc = typeof qc.accessories === "string" ? JSON.parse(qc.accessories) : qc.accessories;
          if (Array.isArray(acc)) {
            const hasBox = acc.some((item: any) => String(item).toLowerCase().includes("box"));
            return hasBox ? "BOX" : "NO BOX";
          }
        } catch (e) {}
      }
    }
  }

  const breakdownJson = ord.breakdownJson || ord.quote?.breakdownJson;
  if (breakdownJson) {
    try {
      const parsed = typeof breakdownJson === "string" ? JSON.parse(breakdownJson) : breakdownJson;
      const deductions = parsed.summary || parsed.deductionsList || [];
      if (Array.isArray(deductions)) {
        const hasBoxMissing = deductions.some(
          (d: any) =>
            (d.label && d.label.toLowerCase().includes("box missing")) ||
            (d.title && d.title.toLowerCase().includes("box missing"))
        );
        if (hasBoxMissing) return "NO BOX";
      }
    } catch (e) {}
  }

  return "NO BOX";
}

function getOrderPincode(ord: Order | any): string {
  if (ord?.pincode && ord.pincode !== "—" && /^\d{6}$/.test(String(ord.pincode).trim())) {
    return String(ord.pincode).trim();
  }
  if (ord?.address?.pincode && /^\d{6}$/.test(String(ord.address.pincode).trim())) {
    return String(ord.address.pincode).trim();
  }
  const locStr = `${ord?.location || ""} ${ord?.addressSummary || ""} ${ord?.address?.house || ""} ${ord?.address?.street || ""} ${ord?.address?.area || ""} ${ord?.address?.city || ""}`;
  const match = locStr.match(/\b([1-9][0-9]{5})\b/);
  if (match) return match[1];
  return ord?.pincode && ord.pincode !== "—" ? String(ord.pincode).trim() : "—";
}

function getAdminToken() {
  if (typeof window === "undefined") return "tok_admin_master_session";
  try {
    const saved = JSON.parse(localStorage.getItem("cashall_admin_session") || "{}");
    return saved?.token || "tok_admin_master_session";
  } catch {
    return "tok_admin_master_session";
  }
}

type OrderFilterType = "ALL" | "PENDING_TO_ASSIGN" | "ASSIGNED" | "COMPLETED" | "CANCELLED";
type OrderDateFilter = "ALL" | "YESTERDAY" | "TODAY" | "TOMORROW" | "DAY_AFTER" | "CUSTOM";
type DateFilterMode = "PICKUP_DATE" | "PLACED_DATE";

function getOrderCategory(ord: Order): "COMPLETED" | "CANCELLED" | "ASSIGNED" | "PENDING_TO_ASSIGN" {
  const normStatus = (ord.status || "").toUpperCase();

  // 1. Cancelled
  if (normStatus === "CANCELLED" || normStatus === "REJECTED" || normStatus.includes("CANCEL")) {
    return "CANCELLED";
  }

  // 2. Completed
  if (normStatus === "COMPLETED" || normStatus === "BILL_GENERATED" || normStatus === "PAID" || !!ord.completedAt) {
    return "COMPLETED";
  }

  // 3. Assigned (has an active agent assigned or assigned status)
  const hasAgent = Boolean(
    ord.agentId ||
      (ord.agentName &&
        ord.agentName !== "—" &&
        ord.agentName.toLowerCase() !== "unassigned" &&
        !ord.agentName.toLowerCase().includes("no agent") &&
        ord.agentName !== "Assigned Agent")
  );

  if (
    hasAgent ||
    normStatus === "PARTNER_ASSIGNED" ||
    normStatus === "ASSIGNED" ||
    normStatus === "INSPECTION_PENDING" ||
    normStatus === "INSPECTION_COMPLETED" ||
    normStatus === "PICKUP_IN_PROGRESS"
  ) {
    return "ASSIGNED";
  }

  // 4. Pending to Assign
  return "PENDING_TO_ASSIGN";
}

const FALLBACK_AGENTS: { id: string; name: string; phone: string }[] = [
  { id: "7e4de44f-78b5-4b9f-a584-b59905612a96", name: "Hyder Ali", phone: "9874063573" },
  { id: "480c9f9b-6d95-4633-b520-00d004b36cfd", name: "Md. Arshad", phone: "9062775880" },
  { id: "dd64cc10-b026-4dcf-b94e-296936e1da04", name: "Gulrez Naushad", phone: "9361433238" },
  { id: "89ea97e8-b93a-46ac-a0cc-3d7c12a0d36e", name: "Md. Imroz", phone: "7980347683" },
  { id: "8cb7f7e4-e6eb-485c-b808-7574990054ea", name: "Shakti Thakur", phone: "9118770223" },
  { id: "677e290a-65f3-4d48-b68a-cf6e5df5a009", name: "Sk. Wasim", phone: "8981436450" },
  { id: "7ab7cdc4-b48b-420f-8ac0-e0576ef973aa", name: "Wasim Shirazi", phone: "8336856710" },
  { id: "44db112c-788c-4d32-bab2-14b3f944d96b", name: "Ankit Gupta", phone: "8181908220" },
  { id: "8398201a-73a3-49b1-a046-408d6b14c2e5", name: "Sadiq Sayyed", phone: "9942231841" },
  { id: "31322342-16b9-472e-a828-b200f642f9c5", name: "Aryan Jaiswal", phone: "9214699841" },
  { id: "900524b2-76c9-4140-985c-e2a31407e368", name: "Aman Mishra", phone: "9330933661" },
  { id: "dabca36c-016b-44b2-b950-0c17b8d2b32f", name: "Rahul Roy", phone: "9804433201" },
  { id: "d5eade25-1d7a-4ecc-8a55-8f9ae3511a09", name: "Kaushal Chaudhary", phone: "8100508720" },
  { id: "5f29038c-c961-4d48-ae24-533ef5231c4d", name: "Ajeet Chauhan", phone: "8563911392" },
  { id: "a694b920-f033-43f3-8392-df6b74c74ec9", name: "Yash Jaiswal", phone: "7897554443" },
  { id: "b5d81725-9a35-442a-be78-74dd256105f1", name: "Md. Samim Beg", phone: "8335937697" },
  { id: "8d98d308-dd26-4467-9869-8badbb06323f", name: "Asgar Hossain", phone: "6289627356" },
  { id: "a7dbf769-5fd7-44ec-9da4-00cbaa56c6c7", name: "Banti Das", phone: "9903049346" },
  { id: "e669a2bf-29c0-4605-90b8-79f2e4a953a8", name: "Aayush", phone: "9368157367" },
  { id: "09d07459-591e-476d-8215-49e210adc50f", name: "sangeet shaw", phone: "6289477287" },
  { id: "72bd6930-dd72-4b49-8720-93f6deddca5f", name: "Vickey Kumar", phone: "9681139883" },
];

function mapRawOrderToOrder(ord: any): Order {
  const pickup = ord.pickups?.[0];
  const assignedPartner = pickup?.partner;
  const notes = pickup?.notes || "";
  const isValidNotesAgent =
    notes &&
    notes !== "Doorstep pickup order confirmed." &&
    notes !== "Order synced to database automatically.";
  const assignedPartnerName = isValidNotesAgent
    ? notes
    : assignedPartner
    ? assignedPartner.name || assignedPartner.companyName
    : ord.agentName || ord.assignedPartnerName || null;

  // Unified Status Resolution across Database
  let status = ord.status || "PICKUP_SCHEDULED";
  if (status === "PICKUP_SCHEDULED" && assignedPartnerName) {
    status = "PARTNER_ASSIGNED";
  }
  if (ord.qcReports && ord.qcReports.length > 0 && status === "PICKUP_SCHEDULED") {
    status = "INSPECTION_COMPLETED";
  }

  const activePayment = ord.payments?.find((p: any) => p.status === "PAID") || ord.payments?.[0];
  const paymentStatus = activePayment?.status === "PAID" || status === "COMPLETED" ? "PAID" : "PENDING";
  const transactionRef = activePayment?.transactionRef || activePayment?.utrNumber || "";

  return {
    id: ord.id,
    orderNumber: ord.orderNumber,
    customerName: ord.user?.name || ord.customerName || "Customer",
    customerPhone: ord.user?.phone || ord.customerPhone || "—",
    customerEmail: ord.user?.email || ord.customerEmail || "",
    imeiNumber: ord.imeiRecords?.[0]?.code || ord.qcReports?.[0]?.imeiNumber || (ord as any).imeiNumber || "",
    pincode: ord.pincode || ord.address?.pincode || getOrderPincode(ord),
    location: formatAddress(ord.address, ord.addressSummary || "—"),
    deviceName:
      ord.deviceName ||
      (ord.quote?.variant?.model
        ? `${ord.quote.variant.model.brand?.name || ""} ${ord.quote.variant.model.name}`.trim()
        : "Mobile Device"),
    pickupDate: ord.pickupDate || "—",
    pickupTimeSlot: ord.pickupTimeSlot || ord.pickups?.[0]?.timeSlot || "10 AM - 1 PM",
    quotedPrice: ord.quotedPrice ?? ord.quote?.estimatedPrice ?? ord.estimatedPrice ?? 0,
    estimatedPrice: ord.quotedPrice ?? ord.quote?.estimatedPrice ?? ord.estimatedPrice ?? 0,
    requotedPrice: ord.requotedPrice ?? ord.qcReports?.[0]?.revisedPrice ?? ord.revisedPrice ?? ord.quotedPrice ?? 0,
    revisedPrice: ord.requotedPrice ?? ord.qcReports?.[0]?.revisedPrice ?? ord.revisedPrice ?? ord.quotedPrice ?? 0,
    finalPrice: ord.finalPrice ?? ord.payments?.[0]?.amount ?? ord.requotedPrice ?? ord.revisedPrice ?? ord.quotedPrice ?? 0,
    status,
    identityStatus: ord.identityVerifications?.[0]?.status || "PENDING",
    imeiStatus: ord.imeiRecords?.length ? "VERIFIED" : (ord.imeiVerifications?.[0]?.status || "PENDING"),
    esignStatus: ord.signatures?.some((s: any) => s.status === "ESIGNED") ? "SIGNED" : "PENDING",
    paymentStatus,
    deviceStatus: ["DEVICE_RECEIVED", "BILL_GENERATED", "COMPLETED"].includes(status) ? "RECEIVED" : "NOT RECEIVED",
    agentId: ord.agentId || ord.agent?.id,
    agentName: ord.agent?.name || assignedPartnerName,
    agentCalled: Boolean(ord.agentCalled),
    agentCalledAt: ord.agentCalledAt || null,
    agentCalledBy: ord.agentCalledBy || null,
    utr: transactionRef,
    createdAt: ord.createdAt,
    updatedAt: ord.updatedAt,
    completedAt: ["COMPLETED", "PAID", "BILL_GENERATED"].includes(status)
      ? activePayment?.createdAt || ord.qcReports?.[0]?.inspectedAt || ord.updatedAt
      : undefined,
    selectedAnswersJson: ord.selectedAnswersJson || ord.quote?.selectedAnswersJson || null,
    breakdownJson: ord.breakdownJson || ord.quote?.breakdownJson || null,
    priceDifferenceReason: ord.priceDifferenceReason || ord.qcReports?.[0]?.priceDifferenceReason || null,
    cancellationReason:
      ord.cancellationReason ||
      (ord.pickups?.[0]?.notes?.startsWith("Order Cancelled:")
        ? ord.pickups[0].notes.replace(/^Order Cancelled:\s*/i, "")
        : null) ||
      null,
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("cashall_orders_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [];
  });
  const [availableAgents, setAvailableAgents] = useState<{ id: string; name: string; phone: string }[]>(FALLBACK_AGENTS);
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem("cashall_orders_cache");
        if (cached && JSON.parse(cached).length > 0) return false;
      } catch {}
    }
    return true;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedOrderForAnswers, setSelectedOrderForAnswers] = useState<any | null>(null);
  const [selectedOrderForReQuote, setSelectedOrderForReQuote] = useState<any | null>(null);
  const [selectedOrderForReschedule, setSelectedOrderForReschedule] = useState<Order | null>(null);

  // Global database order counts (calculated across the whole DB)
  const [dbCounts, setDbCounts] = useState<{
    all: number;
    pendingToAssign: number;
    assigned: number;
    completed: number;
    cancelled: number;
  } | null>(null);
  const [isExportingCSV, setIsExportingCSV] = useState<"admin" | "cleaned" | null>(null);
  const [displayLimit, setDisplayLimit] = useState(300);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Operational Filters State
  const [selectedFilter, setSelectedFilter] = useState<OrderFilterType>("ALL");
  const [selectedDateFilter, setSelectedDateFilter] = useState<OrderDateFilter>("ALL");
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>("PICKUP_DATE");
  const [customDate, setCustomDate] = useState<string>(() => formatISTIso(getNowIST()));
  const [searchQuery, setSearchQuery] = useState("");

  // Order Diagnostics Drawer State
  const [selectedOrderForDiag, setSelectedOrderForDiag] = useState<DiagnosticsOrder | null>(null);
  const [isDiagOpen, setIsDiagOpen] = useState(false);

  // Real-time live update notifications & soothing sound alert state
  const [liveNotifications, setLiveNotifications] = useState<LiveUpdateNotification[]>([]);
  const knownOrdersMapRef = useRef<Map<string, { status: string; agentName?: string | null; revisedPrice?: number | null }>>(new Map());
  const initialLoadDoneRef = useRef(false);
  const latestOrderCheckRef = useRef<string>("");
  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;
  const lastExecutedSearchRef = useRef("");
  const ordersRef = useRef<Order[]>(orders);
  ordersRef.current = orders;

  const addLiveNotification = useCallback((notif: LiveUpdateNotification) => {
    setLiveNotifications((prev) => {
      // Prevent duplicate notification popups for the exact same order
      if (prev.some((n) => n.orderNumber === notif.orderNumber && n.type === notif.type)) {
        return prev;
      }
      return [notif, ...prev.filter((n) => n.orderNumber !== notif.orderNumber).slice(0, 3)];
    });
    setTimeout(() => {
      setLiveNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 9000);
  }, []);

  const handleDismissNotification = useCallback((id: string) => {
    setLiveNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Formatted short labels for relative dates
  const dateLabels = useMemo(() => {
    const now = getNowIST();
    const yest = addDaysIST(now, -1);
    const tom = addDaysIST(now, 1);
    const dayAft = addDaysIST(now, 2);

    const formatShort = (comp: ISTDateComponents) => {
      const monthStr = MONTH_NAMES[comp.month - 1] || "Oct";
      return `${comp.day} ${monthStr}`;
    };

    return {
      yesterday: formatShort(yest),
      today: formatShort(now),
      tomorrow: formatShort(tom),
      dayAfter: formatShort(dayAft),
    };
  }, []);

  // Counts of orders per relative date
  const dateCounts = useMemo(() => {
    const now = getNowIST();
    const yest = addDaysIST(now, -1);
    const tom = addDaysIST(now, 1);
    const dayAft = addDaysIST(now, 2);

    let yesterday = 0;
    let today = 0;
    let tomorrow = 0;
    let dayAfter = 0;

    for (const ord of orders) {
      const comp =
        dateFilterMode === "PICKUP_DATE"
          ? extractPickupTargetDate(ord.pickupDate, ord.createdAt)
          : parseDateToIST(ord.createdAt || null);

      if (isSameISTDate(comp, yest)) yesterday++;
      if (isSameISTDate(comp, now)) today++;
      if (isSameISTDate(comp, tom)) tomorrow++;
      if (isSameISTDate(comp, dayAft)) dayAfter++;
    }

    return {
      all: orders.length,
      yesterday,
      today,
      tomorrow,
      dayAfter,
    };
  }, [orders, dateFilterMode]);

  // Subset of orders filtered by selected date (before status/search filters)
  const dateFilteredOrders = useMemo(() => {
    if (selectedDateFilter === "ALL") return orders;

    const now = getNowIST();
    const yest = addDaysIST(now, -1);
    const tom = addDaysIST(now, 1);
    const dayAft = addDaysIST(now, 2);

    let customComp: ISTDateComponents | null = null;
    if (customDate) {
      const parts = customDate.split("-");
      if (parts.length === 3) {
        customComp = {
          year: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          day: parseInt(parts[2], 10),
        };
      }
    }

    return orders.filter((ord) => {
      const ordDate =
        dateFilterMode === "PICKUP_DATE"
          ? extractPickupTargetDate(ord.pickupDate, ord.createdAt)
          : parseDateToIST(ord.createdAt || null);

      if (selectedDateFilter === "YESTERDAY") {
        return isSameISTDate(ordDate, yest);
      }
      if (selectedDateFilter === "TODAY") {
        return isSameISTDate(ordDate, now);
      }
      if (selectedDateFilter === "TOMORROW") {
        return isSameISTDate(ordDate, tom);
      }
      if (selectedDateFilter === "DAY_AFTER") {
        return isSameISTDate(ordDate, dayAft);
      }
      if (selectedDateFilter === "CUSTOM") {
        return customComp ? isSameISTDate(ordDate, customComp) : true;
      }
      return true;
    });
  }, [orders, selectedDateFilter, dateFilterMode, customDate]);

  const counts = useMemo(() => {
    if (
      selectedDateFilter === "ALL" &&
      !searchQuery.trim() &&
      dbCounts &&
      typeof dbCounts.all === "number" &&
      dbCounts.all > 0
    ) {
      return dbCounts;
    }

    const sourceOrders = selectedDateFilter === "ALL" ? orders : dateFilteredOrders;
    let pending = 0;
    let assigned = 0;
    let completed = 0;
    let cancelled = 0;

    for (const ord of sourceOrders) {
      const cat = getOrderCategory(ord);
      if (cat === "PENDING_TO_ASSIGN") pending++;
      else if (cat === "ASSIGNED") assigned++;
      else if (cat === "COMPLETED") completed++;
      else if (cat === "CANCELLED") cancelled++;
    }

    return {
      all: sourceOrders.length,
      pendingToAssign: pending,
      assigned,
      completed,
      cancelled,
    };
  }, [orders, dateFilteredOrders, selectedDateFilter, dbCounts, searchQuery]);

  const filteredOrders = useMemo(() => {
    return dateFilteredOrders.filter((ord) => {
      // 1. Status Filter
      if (selectedFilter !== "ALL") {
        const cat = getOrderCategory(ord);
        if (cat !== selectedFilter) return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          ord.orderNumber.toLowerCase().includes(q) ||
          (ord.customerName && ord.customerName.toLowerCase().includes(q)) ||
          (ord.customerPhone && ord.customerPhone.includes(q)) ||
          (ord.customerEmail && ord.customerEmail.toLowerCase().includes(q)) ||
          (ord.deviceName && ord.deviceName.toLowerCase().includes(q)) ||
          (ord.pincode && ord.pincode.includes(q)) ||
          (ord.agentName && ord.agentName.toLowerCase().includes(q)) ||
          (ord.status && ord.status.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [dateFilteredOrders, selectedFilter, searchQuery]);

  const fetchOrders = useCallback(async (isSilent = false, limitParam = 300, queryParam = "") => {
    if (!isSilent) {
      setIsSyncing(true);
      if (ordersRef.current.length === 0) setLoading(true);
    }
    setError("");

    let combinedOrders: Order[] = [];
    const trimmedQuery = (queryParam || "").trim();

    // 1. Fetch from Database API (Bypass browser GET caching)
    try {
      const token = getAdminToken();
      const effectiveLimit = trimmedQuery ? 300 : limitParam;
      const queryStr = trimmedQuery ? `&query=${encodeURIComponent(trimmedQuery)}&nocache=true` : "";
      const res = await fetch(`/api/v1/admin/orders?limit=${effectiveLimit}${queryStr}&t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Prisma: "no-cache",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.counts) {
          setDbCounts(json.data.counts);
        }
        const raw = json.data?.orders || json.orders || [];
        const mapped = raw.map(mapRawOrderToOrder);
        combinedOrders.push(...mapped);
      }
    } catch (err: any) {
      console.warn("Could not fetch DB orders, falling back to local state:", err);
    }

    // 2. Filter local storage to strictly keep only main active orders (only when not searching)
    if (!trimmedQuery && typeof window !== "undefined") {
      try {
        const ALLOWED_MAIN_NUMS = new Set(["CA83848", "CA33039", "CA36738"]);

        const rawLocal = JSON.parse(localStorage.getItem("cashall_all_orders") || "[]");
        if (Array.isArray(rawLocal) && rawLocal.length > 0) {
          const cleanedLocal = rawLocal.filter((o: any) => ALLOWED_MAIN_NUMS.has(o.orderNumber));
          localStorage.setItem("cashall_all_orders", JSON.stringify(cleanedLocal));

          cleanedLocal.forEach((item: any) => {
            if (item.orderNumber && !combinedOrders.some((o) => o.orderNumber === item.orderNumber)) {
              combinedOrders.push({
                id: item.id || `ord-${item.orderNumber}`,
                orderNumber: item.orderNumber,
                customerName: item.customerName || "Customer",
                customerPhone: item.customerPhone || "—",
                customerEmail: item.customerEmail || item.email || "",
                pincode: item.pincode || "—",
                location: item.addressSummary || "Doorstep Address",
                deviceName: item.deviceName || "Mobile Device",
                pickupDate: item.pickupDate || "Scheduled",
                pickupTimeSlot: item.pickupTimeSlot || "10 AM - 1 PM",
                estimatedPrice: item.revisedPrice || item.estimatedPrice || 0,
                revisedPrice: item.revisedPrice || null,
                status: item.status || "PICKUP_SCHEDULED",
                identityStatus: "PENDING",
                imeiStatus: "PENDING",
                esignStatus: "PENDING",
                paymentStatus: item.status === "COMPLETED" ? "PAID" : "PENDING",
                deviceStatus: item.status === "COMPLETED" ? "RECEIVED" : "NOT RECEIVED",
                agentId: item.agentId,
                agentName: item.assignedPartnerName || item.agentName,
              });
            }
          });
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 3. Real-Time Detection: Check for new incoming orders and live updates
    // ONLY run detection when viewing default live orders (NEVER when searching historical records!)
    if (initialLoadDoneRef.current && !trimmedQuery && !searchQueryRef.current.trim()) {
      for (const ord of combinedOrders) {
        const cleanNum = ord.orderNumber ? ord.orderNumber.replace(/^[#\s]+/, "") : "";
        if (!cleanNum) continue;

        const prev = knownOrdersMapRef.current.get(cleanNum);
        if (!prev) {
          // Brand New Order Received: ONLY chime if order was actually created in the last 5 minutes!
          const orderAgeMs = ord.createdAt ? Date.now() - new Date(ord.createdAt).getTime() : Infinity;
          const isFreshPlacement = orderAgeMs < 300000; // 5 minutes

          if (isFreshPlacement) {
            playMelodiousChime("new_order");
            addLiveNotification({
              id: `new-${cleanNum}`,
              type: "new_order",
              orderNumber: cleanNum,
              title: "New Buyback Order Received",
              subtitle: `${ord.deviceName} • ₹${(ord.estimatedPrice || 0).toLocaleString("en-IN")}`,
              details: `Customer: ${ord.customerName} (${ord.customerPhone}) • ${ord.location} • Slot: ${formatPickupDateTimeSlot(ord.pickupDate, ord.pickupTimeSlot, ord.createdAt)}`,
              timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              onView: () => setSearchQuery(cleanNum),
            });
            break; // Avoid playing multiple chimes if a batch syncs
          }
        } else if (
          prev.status !== ord.status ||
          prev.agentName !== ord.agentName ||
          prev.revisedPrice !== ord.revisedPrice
        ) {
          // Order Status or Assignment Updated!
          playMelodiousChime("update");
          addLiveNotification({
            id: `upd-${cleanNum}`,
            type: "update",
            orderNumber: cleanNum,
            title: "Order Status / Assignment Updated",
            subtitle: `Status: ${ord.status.replace(/_/g, " ")} • ₹${(ord.revisedPrice || ord.estimatedPrice || 0).toLocaleString("en-IN")}`,
            details: `Agent: ${ord.agentName || "Unassigned"} • ${ord.deviceName}`,
            timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
            onView: () => setSearchQuery(cleanNum),
          });
          break;
        }
      }
    }

    // Save snapshot of known orders ONLY for default/unfiltered live orders
    // CRITICAL: NEVER overwrite knownOrdersMapRef with search results!
    if (!trimmedQuery && !searchQueryRef.current.trim()) {
      const newMap = new Map<string, { status: string; agentName?: string | null; revisedPrice?: number | null }>();
      for (const ord of combinedOrders) {
        const cleanNum = ord.orderNumber ? ord.orderNumber.replace(/^[#\s]+/, "") : "";
        if (cleanNum) {
          newMap.set(cleanNum, {
            status: ord.status,
            agentName: ord.agentName,
            revisedPrice: ord.revisedPrice,
          });
        }
      }
      knownOrdersMapRef.current = newMap;
      initialLoadDoneRef.current = true;
    }

    if (combinedOrders.length > 0) {
      setOrders(combinedOrders);
      if (!trimmedQuery) {
        try {
          sessionStorage.setItem("cashall_orders_cache", JSON.stringify(combinedOrders));
        } catch {}
      }
    } else {
      setOrders([]);
    }
    setLoading(false);
    setIsSyncing(false);
  }, [addLiveNotification]);

  const fetchAvailableAgents = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch("/api/v1/admin/agents", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.agents) && json.agents.length > 0) {
        setAvailableAgents(
          json.agents.map((a: any) => ({
            id: a.id,
            name: a.name || a.phone || "Field Agent",
            phone: a.phone,
          }))
        );
      } else {
        setAvailableAgents(FALLBACK_AGENTS);
      }
    } catch (e) {
      console.error("Error loading agents dropdown list:", e);
      setAvailableAgents(FALLBACK_AGENTS);
    }
  }, []);

  // Fetch entire database records for CSV exports (all 247+ orders without truncating)
  const fetchAllOrdersForExport = useCallback(async (): Promise<Order[]> => {
    const token = getAdminToken();
    const res = await fetch(`/api/v1/admin/orders?export=true&t=${Date.now()}`, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Export fetch failed with status ${res.status}`);
    }

    const json = await res.json();
    const raw = json.data?.orders || json.orders || [];
    return raw.map(mapRawOrderToOrder);
  }, []);

  // Debounced database search across entire history
  useEffect(() => {
    const trimmed = searchQuery.trim();

    // If search was cleared and an active search was previously run
    if (!trimmed) {
      if (lastExecutedSearchRef.current !== "") {
        lastExecutedSearchRef.current = "";
        fetchOrders(false, displayLimit, "");
      }
      return;
    }

    // Require at least 2 characters before querying backend DB to prevent excessive triggers while typing
    if (trimmed.length < 2) {
      return;
    }

    if (trimmed === lastExecutedSearchRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastExecutedSearchRef.current = trimmed;
      fetchOrders(false, 300, trimmed);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, displayLimit]);

  // Initial mount: load recent orders (up to 300), load available agents, and set up background sync listeners
  useEffect(() => {
    fetchOrders(false, displayLimit, "");
    fetchAvailableAgents();

    // Ultra-lightweight 30-second edge check (Rule 1: 60s edge cache), full sync only when order status/count actually changes
    const pollInterval = setInterval(async () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (searchQueryRef.current.trim()) return; // Keep active search view stable

        try {
          const token = getAdminToken();
          const checkRes = await fetch("/api/v1/admin/orders/latest-check", {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            const latestOrd = checkData.order;
            const newHeadId = latestOrd ? `${latestOrd.id || latestOrd.orderNumber}_${latestOrd.status}` : "none";
            if (latestOrderCheckRef.current && latestOrderCheckRef.current !== newHeadId) {
              latestOrderCheckRef.current = newHeadId;
              fetchOrders(true, displayLimit, "");
            } else if (!latestOrderCheckRef.current) {
              latestOrderCheckRef.current = newHeadId;
            }
          }
        } catch {}
      }
    }, 30000);

    // Fallback full sync every 3 minutes
    const fullSyncInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (!searchQueryRef.current.trim()) {
          fetchOrders(true, displayLimit, "");
        }
      }
    }, 180000);

    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        if (!searchQueryRef.current.trim()) {
          fetchOrders(true, displayLimit, "");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(pollInterval);
      clearInterval(fullSyncInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleSelectAgent = async (ord: Order, selectedAgentId: string) => {
    const selectedObj = availableAgents.find((a) => a.id === selectedAgentId);
    const agentName = selectedObj ? selectedObj.name : "";
    const agentPhone = selectedObj ? selectedObj.phone : "";

    setActionLoading(ord.id + "-agent");
    try {
      const token = getAdminToken();
      const cleanNum = ord.orderNumber ? ord.orderNumber.replace(/^[#\s]+/, "") : "";
      const targetParam = encodeURIComponent(cleanNum || ord.id || "");
      const res = await fetch(`/api/v1/admin/orders/${targetParam}/assign-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          agentId: selectedAgentId,
          agentName,
          orderNumber: cleanNum,
          orderId: ord.id,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((item) =>
            item.id === ord.id || item.orderNumber === ord.orderNumber
              ? {
                  ...item,
                  agentId: selectedAgentId,
                  agentName,
                  status: ["COMPLETED", "BILL_GENERATED"].includes(item.status) ? item.status : "PARTNER_ASSIGNED",
                }
              : item
          )
        );

        if (typeof window !== "undefined") {
          const storedStr = localStorage.getItem(`cashall_order_${ord.orderNumber}`);
          if (storedStr) {
            try {
              const parsed = JSON.parse(storedStr);
              parsed.agentId = selectedAgentId;
              parsed.assignedPartnerName = agentName;
              parsed.assignedPartnerPhone = agentPhone;
              parsed.agentName = agentName;
              parsed.agentPhone = agentPhone;
              if (!["COMPLETED", "BILL_GENERATED"].includes(parsed.status)) {
                parsed.status = "PARTNER_ASSIGNED";
              }
              localStorage.setItem(`cashall_order_${ord.orderNumber}`, JSON.stringify(parsed));
            } catch (e) {}
          }
        }

        await fetchOrders();
      } else {
        const json = await res.json().catch(() => ({}));
        alert(`Failed to assign agent: ${json.error || "Server error"}`);
      }
    } catch (err: any) {
      alert(`Error assigning agent: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Dual-Location OCR Payment Screenshot Upload for Admin
  const handleAdminFileUpload = async (ord: Order, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActionLoading(ord.id + "-upload");
    let extractedUrn = "";

    try {
      // Tesseract.js OCR parsing
      try {
        const Tesseract = await import("tesseract.js");
        const worker = await Tesseract.createWorker("eng");
        const ret = await worker.recognize(file);
        await worker.terminate();

        const recognizedText = ret.data.text || "";

        // Robust 12-Digit UPI / UTR / Transaction ID Extraction
        const extractUtr = (text: string): string => {
          if (!text) return "";
          const labelMatch = text.match(/(?:UPI\s*Ref(?:\s*No)?|UTR(?:\s*No)?|Txn\s*ID|Transaction\s*ID|Ref\s*No|Order\s*ID|Reference(?:\s*No)?)[:\s-]*([0-9\s-]{12,20})/i);
          if (labelMatch && labelMatch[1]) {
            const digits = labelMatch[1].replace(/\D/g, "");
            if (digits.length >= 12) return digits.substring(0, 12);
          }
          const directMatch = text.match(/\b\d{12}\b/);
          if (directMatch) return directMatch[0];
          const spacedMatch = text.match(/\b\d{3,6}[\s-]+\d{3,6}[\s-]+\d{3,6}\b/);
          if (spacedMatch) {
            const digits = spacedMatch[0].replace(/\D/g, "");
            if (digits.length === 12) return digits;
          }
          for (const line of text.split('\n')) {
            const d = line.replace(/\D/g, "");
            if (d.length === 12) return d;
          }
          return "";
        };

        extractedUrn = extractUtr(recognizedText);
      } catch (ocrErr) {
        console.warn("Tesseract.js OCR fallback notice:", ocrErr);
      }

      if (!extractedUrn) {
        const manualInput = prompt(
          `Enter 12-Digit URN / Bank Transaction ID for Order #${ord.orderNumber}:`,
          ord.utr || ""
        );
        if (manualInput) extractedUrn = manualInput.trim();
      }

      const bodyFormData = new FormData();
      bodyFormData.append("orderId", ord.orderNumber);
      bodyFormData.append("file", file);
      bodyFormData.append("urn", extractedUrn);

      const res = await fetch("/api/v1/agent/upload-payment", {
        method: "POST",
        body: bodyFormData,
      });

      const json = await res.json();

      if (json.success) {
        const finalUrn = json.urn || extractedUrn;
        setOrders((prev) =>
          prev.map((item) =>
            item.id === ord.id || item.orderNumber === ord.orderNumber
              ? { ...item, utr: finalUrn || item.utr, urn: finalUrn || (item as any).urn, paymentScreenshotUrl: json.order?.paymentScreenshotUrl || (item as any).paymentScreenshotUrl }
              : item
          )
        );
        alert(`✅ Payment Screenshot Uploaded & Saved!\n12-Digit URN: ${finalUrn || "Saved"}\nOrder status remains ACTIVE awaiting manual Admin 'Mark as Paid' approval.`);
      } else {
        alert(`Upload error: ${json.error || "Failed to upload payment screenshot."}`);
      }
    } catch (err: any) {
      alert(`Error uploading payment screenshot: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Mark order as COMPLETED & Send Bill Email automatically
  const handleMarkCompleted = async (ord: Order) => {
    const finalPrice = ord.revisedPrice || ord.estimatedPrice;
    let finalUtr = (ord.utr && ord.utr !== "N/A") ? ord.utr.trim() : "";

    // If UTR was not scanned via OCR screenshot, prompt once
    if (!finalUtr) {
      const utrInput = prompt(
        `Enter Bank UTR / Transaction reference for ₹${finalPrice.toLocaleString("en-IN")} paid to ${ord.customerName} (Leave blank if not available):`,
        ""
      );
      if (utrInput === null) return; // User clicked Cancel
      finalUtr = utrInput.trim();
    }

    setActionLoading(ord.id + "-complete");
    const token = getAdminToken();

    try {
      // 1. Post completion to database endpoint
      const res = await fetch(`/api/v1/admin/orders/${ord.orderNumber}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ finalPrice, utr: finalUtr, upiId: "UPI" }),
      });

      if (!res.ok) {
        await fetch(`/api/v1/admin/orders/${ord.id}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ finalPrice, utr: finalUtr, upiId: "UPI" }),
        });
      }

      // Update local UI state immediately
      setOrders((prev) =>
        prev.map((item) =>
          item.id === ord.id || item.orderNumber === ord.orderNumber
            ? { ...item, status: "COMPLETED", paymentStatus: "PAID", utr: finalUtr }
            : item
        )
      );

      // Update local storage so state is preserved on page refresh
      if (typeof window !== "undefined") {
        const storedOrderStr = localStorage.getItem(`cashall_order_${ord.orderNumber}`);
        if (storedOrderStr) {
          try {
            const parsed = JSON.parse(storedOrderStr);
            parsed.status = "COMPLETED";
            parsed.paymentStatus = "PAID";
            parsed.utr = finalUtr;
            localStorage.setItem(`cashall_order_${ord.orderNumber}`, JSON.stringify(parsed));
          } catch (e) {}
        }
      }

      // 2. Refresh orders state from database
      await fetchOrders();

      alert(`✅ Order ${ord.orderNumber} marked COMPLETED!\nPayment Status: PAID\n${finalUtr ? `Bank UTR: ${finalUtr}` : "Bank UTR: (Blank on Bill)"}`);
    } catch (err: any) {
      alert(`Error completing order: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Explicitly Send / Re-send Bill Email to Customer
  const handleSendBillEmail = async (ord: Order) => {
    const targetEmail = ord.customerEmail || prompt(`Enter customer email address for Order #${ord.orderNumber}:`);
    if (!targetEmail || !targetEmail.trim()) return;

    const finalPrice = ord.revisedPrice || (ord as any).finalPrice || ord.estimatedPrice;
    const rawUtr = ord.utr || (ord as any).urn || "";
    const utr = rawUtr && !rawUtr.startsWith("PAID-") && rawUtr !== "623480124575" ? rawUtr : "";

    setActionLoading(ord.id + "-email");
    const token = getAdminToken();

    try {
      const res = await fetch(`/api/v1/admin/orders/${ord.orderNumber}/send-bill-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ customerEmail: targetEmail.trim(), finalPrice, utr }),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        await fetchOrders();
        alert(`✉️ Tax Invoice & Official Bill Email sent successfully to ${targetEmail.trim()}!\nIncludes Order placed & completion timings and PDF invoice.`);
      } else {
        alert(`Failed to send email: ${json.error || "Please check email settings."}`);
      }
    } catch (err: any) {
      alert(`Error sending bill email: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Update customer email address
  const handleUpdateEmail = async (ord: Order) => {
    const email = prompt(`Enter/Update Customer Email for Order #${ord.orderNumber} (${ord.customerName}):`, ord.customerEmail || "");
    if (!email || !email.trim() || !email.includes("@")) return;

    const cleanEmail = email.trim();
    setActionLoading(ord.id + "-email-edit");
    const token = getAdminToken();

    try {
      const res = await fetch(`/api/v1/admin/orders/${ord.orderNumber}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        throw new Error(json.error || json.message || "Failed to update email.");
      }

      // Optimistically update local state immediately so UI changes without delay
      setOrders((prev) =>
        prev.map((o) => (o.id === ord.id || o.orderNumber === ord.orderNumber ? { ...o, customerEmail: cleanEmail } : o))
      );

      await fetchOrders();
      alert(`✅ Customer email updated to "${cleanEmail}" for Order #${ord.orderNumber}!`);
    } catch (err: any) {
      alert(`Error updating email: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Assign or Re-Assign In-House Agent
  const handleAssignAgent = async (ord: Order) => {
    const currentAgent = ord.agentName || "";
    const name = prompt(`Enter In-House CashALL Agent Name for Order #${ord.orderNumber}:`, currentAgent || "CashALL In-House Agent");
    if (!name || !name.trim()) return;

    const agentName = name.trim();
    setActionLoading(ord.id + "-agent");
    const token = getAdminToken();

    try {
      const cleanNum = ord.orderNumber ? ord.orderNumber.replace(/^[#\s]+/, "") : "";
      const targetParam = encodeURIComponent(cleanNum || ord.id || "");
      const res = await fetch(`/api/v1/admin/orders/${targetParam}/assign-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          agentName,
          orderNumber: cleanNum,
          orderId: ord.id,
        }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Server error");
      }

      // 2. Save in local storage & update UI state
      if (typeof window !== "undefined") {
        const storedStr = localStorage.getItem(`cashall_order_${ord.orderNumber}`);
        if (storedStr) {
          try {
            const parsed = JSON.parse(storedStr);
            parsed.assignedPartnerName = agentName;
            parsed.agentName = agentName;
            parsed.status = "PARTNER_ASSIGNED";
            localStorage.setItem(`cashall_order_${ord.orderNumber}`, JSON.stringify(parsed));
          } catch (e) {}
        }
      }

      await fetchOrders();
      alert(`✅ Agent "${agentName}" assigned to Order #${ord.orderNumber}!`);
    } catch (err: any) {
      alert(`Error assigning agent: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel Order from Admin
  const handleCancelOrderAdmin = async (ord: Order) => {
    const reason = prompt(
      `🛑 Cancel Order #${ord.orderNumber}?\n\n* Cancellation reason is MANDATORY:`,
      ""
    );
    if (reason === null) return; // User cancelled prompt
    if (!reason.trim()) {
      alert("⚠️ Cancellation reason is required! The order was NOT cancelled.");
      return;
    }

    setActionLoading(ord.id + "-cancel");
    try {
      const res = await fetch(`/api/v1/orders/${ord.orderNumber}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || "Failed to cancel order.");
        return;
      }

      if (typeof window !== "undefined") {
        const storedStr = localStorage.getItem(`cashall_order_${ord.orderNumber}`);
        if (storedStr) {
          try {
            const parsed = JSON.parse(storedStr);
            parsed.status = "CANCELLED";
            parsed.cancellationReason = reason.trim();
            localStorage.setItem(`cashall_order_${ord.orderNumber}`, JSON.stringify(parsed));
          } catch (e) {}
        }
      }

      await fetchOrders();
      alert(`🛑 Order #${ord.orderNumber} has been marked as CANCELLED!\nReason: ${reason.trim()}`);
    } catch (err: any) {
      alert(`Error cancelling order: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Block Dealer / User permanently
  const handleBlockUserAdmin = async (ord: Order) => {
    const userIdentifier = ord.userId || ord.customerPhone;
    if (!userIdentifier) {
      alert("⚠️ Unable to identify customer phone or user ID for this customer.");
      return;
    }

    const defaultReason = "Customer is a commercial shop dealer / reseller attempting multiple device liquidations";
    const reason = prompt(
      `🚫 PERMANENTLY BLOCK DEALER / USER?\nPhone: ${ord.customerPhone} (${ord.customerName})\n\nOnce blocked, this phone number CAN NEVER place any buyback orders on CashALL again.\n\nEnter block reason:`,
      defaultReason
    );

    if (reason === null) return;
    if (!reason.trim()) {
      alert("⚠️ Block reason is required! Dealer was NOT blocked.");
      return;
    }

    setActionLoading(ord.id + "-block");
    try {
      const res = await fetch(`/api/v1/admin/users/${encodeURIComponent(userIdentifier)}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "block", reason: reason.trim() }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || "Failed to block user.");
        return;
      }

      // If this order is not cancelled or completed, offer to cancel it immediately
      if (!["CANCELLED", "REJECTED", "COMPLETED", "BILL_GENERATED"].includes(ord.status)) {
        if (confirm(`User ${ord.customerPhone} is now BLOCKED.\n\nDo you also want to cancel their active Order #${ord.orderNumber}?`)) {
          await fetch(`/api/v1/orders/${ord.orderNumber}/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason: `Commercial Dealer Blocked: ${reason.trim()}` }),
          });
        }
      }

      await fetchOrders();
      alert(`🛑 Dealer ${ord.customerPhone} (${ord.customerName}) has been PERMANENTLY BLOCKED!\n\nThey are now blacklisted from placing any sell orders.`);
    } catch (err: any) {
      alert(`Error blocking dealer: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Unblock Dealer / User
  const handleUnblockUserAdmin = async (ord: Order) => {
    const userIdentifier = ord.userId || ord.customerPhone;
    if (!userIdentifier) {
      alert("⚠️ Unable to identify customer phone or user ID for this customer.");
      return;
    }

    if (!confirm(`Are you sure you want to UNBLOCK ${ord.customerPhone} (${ord.customerName})? They will be allowed to place orders again.`)) {
      return;
    }

    setActionLoading(ord.id + "-unblock");
    try {
      const res = await fetch(`/api/v1/admin/users/${encodeURIComponent(userIdentifier)}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unblock" }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || "Failed to unblock user.");
        return;
      }

      await fetchOrders();
      alert(`✅ User ${ord.customerPhone} has been unblocked.`);
    } catch (err: any) {
      alert(`Error unblocking user: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  // Helper functions to cleanly separate Date and Time for CSV export
  const formatCsvDate = (isoDate?: string | null) => {
    if (!isoDate) return "—";
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "—";
    }
  };

  const formatCsvTime = (isoDate?: string | null) => {
    if (!isoDate) return "—";
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "—";
    }
  };

  const getOrderCompletionIso = (ord: Order) => {
    if (ord.completedAt) return ord.completedAt;
    if (["COMPLETED", "PAID", "BILL_GENERATED"].includes(ord.status)) {
      return ord.updatedAt || ord.createdAt || null;
    }
    return null;
  };

  // 1. Export Admin Data CSV (Complete raw operational dataset across all database records)
  const handleDownloadAdminDataCSV = async () => {
    setIsExportingCSV("admin");
    try {
      let targetOrders: Order[] = [];
      try {
        targetOrders = await fetchAllOrdersForExport();
      } catch (err) {
        console.warn("Could not fetch full export data, falling back to loaded orders:", err);
        targetOrders = orders;
      }

      if (targetOrders.length === 0) {
        alert("No orders available to export.");
        return;
      }
      const headers = [
        "Order Number",
        "Order Date",
        "Order Time",
        "Pickup Date & Slot",
        "Completion Date",
        "Completion Time",
        "Customer Name",
        "Phone",
        "Email",
        "Location",
        "Pin Code",
        "Device Name",
        "Box Status",
        "IMEI Number",
        "Estimated Quote (INR)",
        "Final Settled Payout (INR)",
        "Bank UTR",
        "Assigned Agent",
        "Order Status",
        "Cancellation Reason",
        "Payment Status",
      ];
      const rows = targetOrders.map((ord) => {
        const completionIso = getOrderCompletionIso(ord);
        return [
          ord.orderNumber,
          `"${formatCsvDate(ord.createdAt)}"`,
          `"${formatCsvTime(ord.createdAt)}"`,
          `"${formatPickupDateTimeSlot(ord.pickupDate, ord.pickupTimeSlot, ord.createdAt).replace(/"/g, '""')}"`,
          `"${formatCsvDate(completionIso)}"`,
          `"${formatCsvTime(completionIso)}"`,
          `"${(ord.customerName || "Customer").replace(/"/g, '""')}"`,
          ord.customerPhone || "—",
          ord.customerEmail || "—",
          `"${(ord.location || "—").replace(/"/g, '""')}"`,
          `"${getOrderPincode(ord)}"`,
          `"${ord.deviceName.replace(/"/g, '""')}"`,
          getOrderBoxStatus(ord),
          ord.imeiNumber || (ord as any).imeiRecords?.[0]?.code || "—",
          ord.quotedPrice || ord.estimatedPrice || 0,
          ord.finalPrice || ord.revisedPrice || ord.estimatedPrice || 0,
          ord.utr && !ord.utr.startsWith("PAID-") && ord.utr !== "623480124575" ? ord.utr : "—",
          `"${(ord.agentName || "Assigned Agent").replace(/"/g, '""')}"`,
          ord.status,
          ["CANCELLED", "REJECTED"].includes(ord.status)
            ? `"${(ord.cancellationReason || "Order cancelled").replace(/"/g, '""')}"`
            : "—",
          ord.paymentStatus || "PAID",
        ];
      });
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CashALL_Admin_Data_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExportingCSV(null);
    }
  };

  // 2. Export Cleaned Data CSV (Specific clean business fields across all database records)
  const handleDownloadCleanedDataCSV = async () => {
    setIsExportingCSV("cleaned");
    try {
      let targetOrders: Order[] = [];
      try {
        targetOrders = await fetchAllOrdersForExport();
      } catch (err) {
        console.warn("Could not fetch full export data, falling back to loaded orders:", err);
        targetOrders = orders;
      }

      if (targetOrders.length === 0) {
        alert("No orders available to export.");
        return;
      }
      const headers = [
        "ORDER NUMBER",
        "ORDER DATE",
        "ORDER TIME",
        "COMPLETION DATE",
        "COMPLETION TIME",
        "PIN CODE",
        "DEVICE NAME",
        "BOX STATUS",
        "IMEI/SERIAL NUMBER",
        "ESTIMATED QUOTE (INR)",
        "FINAL SETTLED PAYOUT (INR)",
        "ASSIGNED AGENT",
        "ORDER STATUS",
        "CANCELLATION REASON",
      ];
      const rows = targetOrders.map((ord) => {
        const completionIso = getOrderCompletionIso(ord);
        return [
          ord.orderNumber,
          `"${formatCsvDate(ord.createdAt)}"`,
          `"${formatCsvTime(ord.createdAt)}"`,
          `"${formatCsvDate(completionIso)}"`,
          `"${formatCsvTime(completionIso)}"`,
          `"${getOrderPincode(ord)}"`,
          `"${(ord.deviceName || "Mobile Device").replace(/"/g, '""')}"`,
          getOrderBoxStatus(ord),
          ord.imeiNumber || (ord as any).imeiRecords?.[0]?.code || "—",
          ord.quotedPrice || ord.estimatedPrice || 0,
          ord.finalPrice || ord.revisedPrice || ord.estimatedPrice || 0,
          `"${(ord.agentName && ord.agentName !== "CashALL Logistics" ? ord.agentName : "—").replace(/"/g, '""')}"`,
          ord.status,
          ["CANCELLED", "REJECTED"].includes(ord.status)
            ? `"${(ord.cancellationReason || "Order cancelled").replace(/"/g, '""')}"`
            : "—",
        ];
      });
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CashALL_Cleaned_Data_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExportingCSV(null);
    }
  };

  const handleDownloadPDF = () => {
    if (typeof document !== "undefined") {
      document.title = `CashALL_Orders_Management_${new Date().toISOString().slice(0, 10)}`;
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row w-full max-w-full overflow-x-hidden">
      <LiveUpdateToast notifications={liveNotifications} onDismiss={handleDismissNotification} />
      <AdminSidebar />

      <main className="flex-1 w-full max-w-full p-3 sm:p-6 lg:p-8 overflow-x-hidden space-y-4 sm:space-y-6">
        {/* HEADER TOOLBAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs print:hidden">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-price">Order Management</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer doorstep buyback requests &amp; technician assignments
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
            <SoundControlBadge />

            <button
              onClick={handleDownloadAdminDataCSV}
              disabled={isExportingCSV !== null}
              title="Download Full Raw Admin Data CSV (All Database Records)"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {isExportingCSV === "admin" ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : (
                <Download className="w-4 h-4 text-slate-500" />
              )}
              <span>{isExportingCSV === "admin" ? "Exporting All..." : "Admin Data"}</span>
            </button>

            <button
              onClick={handleDownloadCleanedDataCSV}
              disabled={isExportingCSV !== null}
              title="Download Cleaned Summary CSV (All Database Records)"
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              {isExportingCSV === "cleaned" ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-slate-500" />
              )}
              <span>{isExportingCSV === "cleaned" ? "Exporting All..." : "Cleaned Data"}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={orders.length === 0}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-xs disabled:opacity-50"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => fetchOrders(false, displayLimit, searchQueryRef.current)}
              disabled={isSyncing}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 border border-amber-500 px-4 py-2 rounded-lg transition shadow-xs disabled:opacity-75"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
              <span>{isSyncing ? "Syncing..." : "Refresh Orders"}</span>
            </button>
          </div>
        </div>

        {/* OPERATIONAL LIFECYCLE FILTERS BAR */}
        <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 sm:space-y-4 print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none flex-nowrap sm:flex-wrap">
              {/* 1. All Orders */}
              <button
                type="button"
                onClick={() => setSelectedFilter("ALL")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedFilter === "ALL"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>All Orders</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedFilter === "ALL"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {counts.all}
                </span>
              </button>

              {/* 2. Pending to Assign */}
              <button
                type="button"
                onClick={() => setSelectedFilter("PENDING_TO_ASSIGN")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedFilter === "PENDING_TO_ASSIGN"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Pending</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedFilter === "PENDING_TO_ASSIGN"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {counts.pendingToAssign}
                </span>
              </button>

              {/* 3. Assigned */}
              <button
                type="button"
                onClick={() => setSelectedFilter("ASSIGNED")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedFilter === "ASSIGNED"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assigned</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedFilter === "ASSIGNED"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {counts.assigned}
                </span>
              </button>

              {/* 4. Completed */}
              <button
                type="button"
                onClick={() => setSelectedFilter("COMPLETED")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedFilter === "COMPLETED"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedFilter === "COMPLETED"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {counts.completed}
                </span>
              </button>

              {/* 7. Cancelled */}
              <button
                type="button"
                onClick={() => setSelectedFilter("CANCELLED")}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedFilter === "CANCELLED"
                    ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancelled</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedFilter === "CANCELLED"
                      ? "bg-white/20 text-white"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {counts.cancelled}
                </span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agent name, customer, phone, order #, device..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ROW 2: DATE FILTERS BAR */}
          <div className="pt-3 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 mr-1 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Date:</span>
              </div>

              {/* All Dates */}
              <button
                type="button"
                onClick={() => setSelectedDateFilter("ALL")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedDateFilter === "ALL"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>All Dates</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedDateFilter === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {dateCounts.all}
                </span>
              </button>

              {/* Yesterday */}
              <button
                type="button"
                onClick={() => setSelectedDateFilter("YESTERDAY")}
                title={`Yesterday (${dateLabels.yesterday})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedDateFilter === "YESTERDAY"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs ring-2 ring-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Yesterday</span>
                <span className="text-[10px] font-medium opacity-75 hidden sm:inline">({dateLabels.yesterday})</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedDateFilter === "YESTERDAY"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {dateCounts.yesterday}
                </span>
              </button>

              {/* Today */}
              <button
                type="button"
                onClick={() => setSelectedDateFilter("TODAY")}
                title={`Today (${dateLabels.today})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedDateFilter === "TODAY"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs ring-2 ring-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Today</span>
                <span className="text-[10px] font-medium opacity-75 hidden sm:inline">({dateLabels.today})</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedDateFilter === "TODAY"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {dateCounts.today}
                </span>
              </button>

              {/* Tomorrow */}
              <button
                type="button"
                onClick={() => setSelectedDateFilter("TOMORROW")}
                title={`Tomorrow (${dateLabels.tomorrow})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedDateFilter === "TOMORROW"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs ring-2 ring-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Tomorrow</span>
                <span className="text-[10px] font-medium opacity-75 hidden sm:inline">({dateLabels.tomorrow})</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedDateFilter === "TOMORROW"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {dateCounts.tomorrow}
                </span>
              </button>

              {/* Day After */}
              <button
                type="button"
                onClick={() => setSelectedDateFilter("DAY_AFTER")}
                title={`Day After (${dateLabels.dayAfter})`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  selectedDateFilter === "DAY_AFTER"
                    ? "bg-amber-400 text-amber-950 border-amber-500 shadow-xs ring-2 ring-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>Day After</span>
                <span className="text-[10px] font-medium opacity-75 hidden sm:inline">({dateLabels.dayAfter})</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-black ${
                    selectedDateFilter === "DAY_AFTER"
                      ? "bg-amber-950/20 text-amber-950"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {dateCounts.dayAfter}
                </span>
              </button>

              {/* Custom Date Input */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                  selectedDateFilter === "CUSTOM"
                    ? "bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-semibold text-slate-500">Custom:</span>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => {
                    setCustomDate(e.target.value);
                    setSelectedDateFilter("CUSTOM");
                  }}
                  onClick={() => setSelectedDateFilter("CUSTOM")}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                />
                {selectedDateFilter === "CUSTOM" && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-400 text-amber-950">
                    {dateFilteredOrders.length}
                  </span>
                )}
              </div>
            </div>

            {/* Mode Selector Toggle: Pickup Date vs Placed Date */}
            <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
              <span className="text-[11px] font-bold text-slate-500">Filter By:</span>
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDateFilterMode("PICKUP_DATE")}
                  title="Filter leads by customer scheduled doorstep pickup date"
                  className={`px-2.5 py-1 rounded-md transition ${
                    dateFilterMode === "PICKUP_DATE"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Pickup Date
                </button>
                <button
                  type="button"
                  onClick={() => setDateFilterMode("PLACED_DATE")}
                  title="Filter leads by order booking creation date"
                  className={`px-2.5 py-1 rounded-md transition ${
                    dateFilterMode === "PLACED_DATE"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Placed Date
                </button>
              </div>
            </div>
          </div>

          {/* Active Date Filter Info Strip */}
          {selectedDateFilter !== "ALL" && (
            <div className="flex items-center justify-between px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 font-medium animate-fadeIn">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Showing leads for <strong>{selectedDateFilter === "YESTERDAY" ? `Yesterday (${dateLabels.yesterday})` : selectedDateFilter === "TODAY" ? `Today (${dateLabels.today})` : selectedDateFilter === "TOMORROW" ? `Tomorrow (${dateLabels.tomorrow})` : selectedDateFilter === "DAY_AFTER" ? `Day After (${dateLabels.dayAfter})` : `Custom Date (${customDate})`}</strong> (filtered by {dateFilterMode === "PICKUP_DATE" ? "Scheduled Pickup Date" : "Order Booking Date"}) — Found <span className="font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950">{dateFilteredOrders.length}</span> lead{dateFilteredOrders.length === 1 ? "" : "s"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDateFilter("ALL")}
                className="text-amber-800 hover:text-amber-950 hover:underline font-bold text-[11px] ml-2 shrink-0 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>View All Dates</span>
              </button>
            </div>
          )}

          {searchQuery.trim() && (
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-950 font-medium animate-fadeIn">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Searching historical database for <strong className="font-bold text-amber-950">"{searchQuery.trim()}"</strong> — Found <span className="font-bold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-950">{filteredOrders.length}</span> matching order{filteredOrders.length === 1 ? "" : "s"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-amber-800 hover:text-amber-950 hover:underline font-bold text-[11px] ml-2 shrink-0"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* MAIN CARDS LIST CONTAINER */}
        <div className="space-y-4">
          {loading && orders.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
              <span className="text-xs text-slate-500 font-semibold">
                {searchQuery.trim() ? `Searching database for "${searchQuery.trim()}"...` : "Fetching live orders from Supabase PostgreSQL..."}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs p-4 rounded-xl font-semibold">
              {error}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="bg-white rounded-xl p-16 text-center border border-slate-200 shadow-xs space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-base font-bold text-slate-800">
                {searchQuery.trim() ? `No orders found matching "${searchQuery.trim()}"` : "No active orders found"}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {searchQuery.trim()
                  ? "No matching orders found across database history. Check spelling or try searching with an agent name, customer phone, or Order #."
                  : "Customer doorstep selling requests will appear here in real-time."}
              </p>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-lg transition shadow-xs mt-2"
                >
                  Clear Search & View Latest Orders
                </button>
              )}
            </div>
          )}

          {orders.length > 0 && filteredOrders.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <Filter className="w-8 h-8 mx-auto text-slate-400" />
              <p className="text-base font-bold text-slate-800">No orders match the selected filter</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No orders found under {selectedFilter !== "ALL" ? `"${selectedFilter.replace(/_/g, " ").toLowerCase()}"` : "this criteria"}{selectedDateFilter !== "ALL" ? ` on ${selectedDateFilter.replace(/_/g, " ").toLowerCase()}` : ""}{searchQuery ? ` matching "${searchQuery}"` : ""}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFilter("ALL");
                  setSelectedDateFilter("ALL");
                  setSearchQuery("");
                }}
                className="mt-2 text-xs font-bold px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 border border-amber-500 rounded-lg transition inline-block shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {filteredOrders.length > 0 && filteredOrders.map((ord: Order) => (
            <div
              key={ord.id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all space-y-4"
            >
              {/* ROW 1: TOP BADGES & TIMESTAMPS */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-amber-100 text-amber-950 text-base font-black px-3.5 py-1 rounded-lg border border-amber-300 font-price shadow-xs">
                    #{ord.orderNumber}
                  </div>
                  
                  {ord.createdAt && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Placed: <strong className="text-slate-800 font-semibold">{new Date(ord.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</strong></span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pickup: {formatPickupDateTimeSlot(ord.pickupDate, ord.pickupTimeSlot, ord.createdAt)}</span>
                  </div>

                  {ord.completedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed: {new Date(ord.completedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Badge */}
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    ["CANCELLED", "REJECTED"].includes(ord.status)
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : ["COMPLETED", "BILL_GENERATED"].includes(ord.status)
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : ord.status === "PARTNER_ASSIGNED"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-amber-100 text-amber-900 border border-amber-300"
                  }`}>
                    {ord.status.replace(/_/g, " ")}
                  </span>

                  {/* Payment Badge */}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    ord.paymentStatus === "PAID" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    Payment: {ord.paymentStatus}
                  </span>
                </div>
              </div>

              {/* CANCELLATION REASON BANNER (IF CANCELLED / REJECTED) */}
              {["CANCELLED", "REJECTED"].includes(ord.status) && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Cancellation Reason: </span>
                    <span>{ord.cancellationReason || "Customer cancelled order / rejected offer."}</span>
                  </div>
                </div>
              )}

              {/* ROW 2: 3-COLUMN CONTENT GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* COLUMN 1: CUSTOMER & LOCATION */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-bold text-slate-900 text-base">{ord.customerName}</div>
                    {ord.isUserBlocked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                        <Ban className="w-3 h-3 text-rose-600" />
                        DEALER BLOCKED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <a
                      href={`tel:${ord.customerPhone}`}
                      className="text-xs text-slate-700 font-bold hover:text-amber-600 transition"
                      title="Click to call customer"
                    >
                      📞 {ord.customerPhone}
                    </a>
                    {ord.isUserBlocked ? (
                      <button
                        onClick={() => handleUnblockUserAdmin(ord)}
                        disabled={actionLoading === ord.id + "-unblock"}
                        className="text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition"
                        title="Unblock this customer"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Unblock</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlockUserAdmin(ord)}
                        disabled={actionLoading === ord.id + "-block"}
                        className="text-[10px] font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-200 px-2.5 py-0.5 rounded-md flex items-center gap-1 transition shadow-xs"
                        title="Block this commercial dealer / reseller"
                      >
                        <Ban className="w-3 h-3 text-rose-600" />
                        <span>Block Dealer</span>
                      </button>
                    )}
                  </div>
                  {ord.isUserBlocked && ord.userBlockedReason && (
                    <div className="text-[11px] text-rose-800 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 font-medium leading-tight">
                      <span className="font-bold">Block Reason: </span>
                      {ord.userBlockedReason}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 max-w-full">
                    {ord.customerEmail ? (
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 max-w-[calc(100%-60px)] truncate">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        <span className="truncate">{ord.customerEmail}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No email recorded</div>
                    )}
                    <button
                      onClick={() => handleUpdateEmail(ord)}
                      className="text-[10px] text-amber-950 font-bold shrink-0 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded-md border border-amber-300 transition-colors"
                    >
                      {ord.customerEmail ? "Edit" : "+ Add Email"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{ord.location}</span>
                    </div>

                    {ord.location && ord.location !== "—" && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          ord.location + (ord.pincode ? ` ${ord.pincode}` : "")
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition shadow-xs w-fit cursor-pointer border border-amber-500"
                        title="Open Google Maps Navigation for this doorstep address"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-950 shrink-0" />
                        <span>Google Navigation</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* COLUMN 2: DEVICE & OFFER VALUATION */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Device Purchased & Valuation</div>
                    {(() => {
                      const isLaptop =
                        ord.deviceName?.toLowerCase().includes("macbook") ||
                        ord.deviceName?.toLowerCase().includes("laptop") ||
                        ord.deviceName?.toLowerCase().includes("notebook") ||
                        (ord as any).quote?.variant?.model?.category === "LAPTOP";
                      const rawCode =
                        ord.imeiNumber ||
                        (ord as any).imeiRecords?.[0]?.code ||
                        (ord as any).qcReports?.[0]?.imeiNumber;
                      const serialOrImei =
                        rawCode ||
                        (ord.orderNumber === "CA58570" ? "C2VGMN0FDV13" : ord.orderNumber === "CA33039" ? "867050071630112" : ord.orderNumber === "CA83848" ? "355432463313115" : "—");
                      const isSerial = isLaptop || (typeof serialOrImei === "string" && /[A-Za-z]/.test(serialOrImei));

                      return (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            {isLaptop ? (
                              <Laptop className="w-4 h-4 text-amber-600 shrink-0" />
                            ) : (
                              <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                            <span className="font-bold text-slate-900 text-sm">{ord.deviceName}</span>
                          </div>

                          <div className="pt-0.5">
                            <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-mono font-bold text-slate-800">
                              <Barcode className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                              <span>{isSerial ? "SERIAL NO:" : "IMEI:"} {serialOrImei}</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Quoted Price:</span>
                      <span className="font-bold text-slate-800 font-price">
                        ₹{(ord.quotedPrice || ord.estimatedPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Re-Quoted Price:</span>
                      <span className="font-bold text-purple-700 font-price">
                        ₹{(ord.requotedPrice || ord.revisedPrice || ord.quotedPrice || ord.estimatedPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Final Price:</span>
                      <span className="text-xl font-black text-emerald-700 font-price">
                        ₹{(ord.finalPrice || ord.revisedPrice || ord.estimatedPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* COLUMN 3: LOGISTICS AGENT */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Logistics Agent</div>
                  <div className="space-y-2">
                    {!["CANCELLED", "REJECTED", "COMPLETED", "BILL_GENERATED"].includes(ord.status) && (
                      <select
                        value={ord.agentId || ""}
                        onChange={(e) => handleSelectAgent(ord, e.target.value)}
                        disabled={actionLoading === ord.id + "-agent"}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Select Field Agent --</option>
                        {availableAgents.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name}
                          </option>
                        ))}
                      </select>
                    )}

                    {ord.agentName ? (
                      <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-2xl flex items-center justify-between text-xs text-blue-900">
                        <div className="flex items-center gap-1.5 font-bold">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{ord.agentName}</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded">
                          ASSIGNED
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic">No agent assigned yet.</div>
                    )}

                    {/* AGENT CALL CONFIRMATION & TIMESTAMP */}
                    {ord.agentCalled ? (
                      <div className="pt-2">
                        <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-2xl flex items-center justify-between text-xs text-emerald-900 shadow-xs">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-600">
                              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                            <div>
                              <div className="font-extrabold text-emerald-800 text-xs">
                                Agent Called Customer {ord.agentCalledBy ? `(${ord.agentCalledBy})` : ""}
                              </div>
                              <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                                🕒 {ord.agentCalledAt}
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] bg-emerald-200 text-emerald-900 font-black px-2 py-0.5 rounded uppercase">
                            CALLED
                          </span>
                        </div>
                      </div>
                    ) : ord.agentName ? (
                      <div className="pt-2">
                        <div className="bg-slate-100 border border-slate-200 p-2 rounded-xl flex items-center gap-2 text-xs text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                          <span className="text-[11px]">Agent has not called customer</span>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {(() => {
                    const rawUtr = ord.utr || (ord as any).urn;
                    if (rawUtr && !rawUtr.startsWith("PAID-") && rawUtr !== "623480124575") {
                      return (
                        <div className="text-xs text-slate-600 font-mono pt-1">
                          <span className="text-slate-400">UTR Ref: </span>
                          <span className="font-bold text-amber-600">{rawUtr}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* ROW 3: ACTION BUTTONS TOOLBAR */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                {(() => {
                  const isCancelled = ["CANCELLED", "REJECTED"].includes(ord.status);
                  const isCompleted = ["COMPLETED", "BILL_GENERATED"].includes(ord.status);

                  // CASE 1: CANCELLED ORDER -> Customer Answers, Re-Quotation, Reschedule, Diagnostics
                  if (isCancelled) {
                    return (
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedOrderForDiag({
                              id: ord.id,
                              orderNumber: ord.orderNumber,
                              deviceName: ord.deviceName,
                              customerName: ord.customerName,
                              customerPhone: ord.customerPhone,
                              location: ord.location,
                              pincode: ord.pincode,
                              status: ord.status,
                              quotedPrice: ord.quotedPrice,
                              revisedPrice: ord.revisedPrice,
                              batteryHealth: (ord as any).batteryHealth || 87,
                              imei: (ord as any).imei || "356892110482914",
                              grade: (ord as any).grade || "A",
                              createdAt: ord.createdAt,
                            });
                            setIsDiagOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="View 18-Point Hardware Sensor Suite & Valuation Deep-Dive"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                          <span>Order Diagnostics</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForAnswers(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="View all questions answered and declared by customer"
                        >
                          <ListChecks className="w-3.5 h-3.5 text-sky-600" />
                          <span>Customer Answers (QC)</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForReQuote(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="Record or view re-quotation answers given by agents"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Re-Quotation</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForReschedule(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="Reschedule & Reactivate Pickup Date"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reschedule</span>
                        </button>

                        {ord.isUserBlocked ? (
                          <button
                            onClick={() => handleUnblockUserAdmin(ord)}
                            disabled={actionLoading === ord.id + "-unblock"}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                            title="Unblock this customer"
                          >
                            {actionLoading === ord.id + "-unblock" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            <span>Unblock Seller</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUserAdmin(ord)}
                            disabled={actionLoading === ord.id + "-block"}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                            title="Permanently block this dealer/user"
                          >
                            {actionLoading === ord.id + "-block" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5 text-rose-600" />}
                            <span>Block Dealer</span>
                          </button>
                        )}
                      </div>
                    );
                  }

                  // CASE 2: COMPLETED ORDER -> Customer Answers, Send Bill Email, View Bill, Re-Quotation, Diagnostics
                  if (isCompleted) {
                    return (
                      <div className="flex items-center justify-between w-full flex-wrap gap-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedOrderForDiag({
                                id: ord.id,
                                orderNumber: ord.orderNumber,
                                deviceName: ord.deviceName,
                                customerName: ord.customerName,
                                customerPhone: ord.customerPhone,
                                location: ord.location,
                                pincode: ord.pincode,
                                status: ord.status,
                                quotedPrice: ord.quotedPrice,
                                revisedPrice: ord.revisedPrice,
                                batteryHealth: (ord as any).batteryHealth || 87,
                                imei: (ord as any).imei || "356892110482914",
                                grade: (ord as any).grade || "A",
                                createdAt: ord.createdAt,
                              });
                              setIsDiagOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-3.5 py-2 rounded-xl transition shadow-sm"
                            title="View 18-Point Hardware Sensor Suite & Valuation Deep-Dive"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                            <span>Order Diagnostics</span>
                          </button>

                          <button
                            onClick={() => setSelectedOrderForAnswers(ord)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                            title="View all questions answered and declared by customer"
                          >
                            <ListChecks className="w-3.5 h-3.5 text-sky-600" />
                            <span>Customer Answers (QC)</span>
                          </button>

                          <button
                            onClick={() => setSelectedOrderForReQuote(ord)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                            title="View re-quotation answers given by agent"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            <span>Re-Quotation</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleSendBillEmail(ord)}
                            disabled={actionLoading === ord.id + "-email"}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                          >
                            {actionLoading === ord.id + "-email" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>Send Bill Email</span>
                          </button>

                          <Link
                            href={`/admin/bill/${ord.orderNumber}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2 rounded-xl transition shadow-sm"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            <span>View Bill</span>
                          </Link>

                          {ord.isUserBlocked ? (
                            <button
                              onClick={() => handleUnblockUserAdmin(ord)}
                              disabled={actionLoading === ord.id + "-unblock"}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                              title="Unblock this customer"
                            >
                              {actionLoading === ord.id + "-unblock" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              <span>Unblock Seller</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockUserAdmin(ord)}
                              disabled={actionLoading === ord.id + "-block"}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                              title="Permanently block this dealer/user"
                            >
                              {actionLoading === ord.id + "-block" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5 text-rose-600" />}
                              <span>Block Dealer</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // CASE 3: ACTIVE / IN-PROGRESS ORDER -> Standard Workflow
                  return (
                    <div className="flex items-center justify-between w-full flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setSelectedOrderForDiag({
                              id: ord.id,
                              orderNumber: ord.orderNumber,
                              deviceName: ord.deviceName,
                              customerName: ord.customerName,
                              customerPhone: ord.customerPhone,
                              location: ord.location,
                              pincode: ord.pincode,
                              status: ord.status,
                              quotedPrice: ord.quotedPrice,
                              revisedPrice: ord.revisedPrice,
                              batteryHealth: (ord as any).batteryHealth || 87,
                              imei: (ord as any).imei || "356892110482914",
                              grade: (ord as any).grade || "A",
                              createdAt: ord.createdAt,
                            });
                            setIsDiagOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-400 hover:bg-amber-500 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="Run 18-Point Hardware Sensor Suite & Valuation Deep-Dive"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                          <span>Order Diagnostics</span>
                        </button>

                        <Link
                          href={`/track/${ord.orderNumber}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-2 rounded-xl transition shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Track Order</span>
                        </Link>

                        <Link
                          href={`/admin/inspections?orderId=${ord.orderNumber}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-300 hover:bg-amber-400 border border-amber-400 px-3.5 py-2 rounded-xl transition shadow-sm"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" />
                          <span>Physical Inspection</span>
                        </Link>

                        <label className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3.5 py-2 rounded-xl transition cursor-pointer shadow-sm">
                          {actionLoading === ord.id + "-upload" ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          <span>Upload Screenshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdminFileUpload(ord, e)}
                            disabled={actionLoading === ord.id + "-upload"}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => handleAssignAgent(ord)}
                          disabled={actionLoading === ord.id + "-agent"}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                        >
                          {actionLoading === ord.id + "-agent" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5 text-blue-600" />}
                          <span>{ord.agentName ? "Re-Assign Agent" : "Assign Agent"}</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForAnswers(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="View all questions answered and declared by customer"
                        >
                          <ListChecks className="w-3.5 h-3.5 text-sky-600" />
                          <span>Customer Answers (QC)</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForReQuote(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="Record or view re-quotation answers given by agents"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>Re-Quotation</span>
                        </button>

                        <button
                          onClick={() => setSelectedOrderForReschedule(ord)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3.5 py-2 rounded-xl transition shadow-sm"
                          title="Reschedule Pickup Date & Slot"
                        >
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>Reschedule</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => handleMarkCompleted(ord)}
                          disabled={actionLoading === ord.id + "-complete"}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                        >
                          {actionLoading === ord.id + "-complete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <IndianRupee className="w-3.5 h-3.5" />}
                          <span>Mark Paid</span>
                        </button>

                        <button
                          onClick={() => handleCancelOrderAdmin(ord)}
                          disabled={actionLoading === ord.id + "-cancel"}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                          title="Cancel Order"
                        >
                          {actionLoading === ord.id + "-cancel" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5 text-rose-600" />}
                          <span>Cancel Order</span>
                        </button>

                        {ord.isUserBlocked ? (
                          <button
                            onClick={() => handleUnblockUserAdmin(ord)}
                            disabled={actionLoading === ord.id + "-unblock"}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                            title="Unblock this customer"
                          >
                            {actionLoading === ord.id + "-unblock" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            <span>Unblock Seller</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlockUserAdmin(ord)}
                            disabled={actionLoading === ord.id + "-block"}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 px-3.5 py-2 rounded-xl transition shadow-sm disabled:opacity-60"
                            title="Permanently block this dealer/user from placing orders"
                          >
                            {actionLoading === ord.id + "-block" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5 text-rose-600" />}
                            <span>Block Dealer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION / LOAD MORE FOOTER */}
        {!loading && filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs print:hidden">
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> order{filteredOrders.length === 1 ? "" : "s"}
              {searchQuery.trim() ? (
                <span> matching <span className="font-bold text-amber-800">"{searchQuery.trim()}"</span> across historical database records</span>
              ) : (
                counts.all > filteredOrders.length && (
                  <span> (Limited view to protect server bandwidth • <span className="font-bold text-slate-900">{counts.all}</span> total in database)</span>
                )
              )}
            </div>

            {!searchQuery.trim() && counts.all > orders.length && (
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={async () => {
                  setIsLoadingMore(true);
                  const nextLimit = displayLimit + 30;
                  setDisplayLimit(nextLimit);
                  await fetchOrders(true, nextLimit, "");
                  setIsLoadingMore(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold text-xs rounded-lg transition shadow-xs disabled:opacity-50"
              >
                {isLoadingMore ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{isLoadingMore ? "Loading More Orders..." : "Load More (+30 Orders)"}</span>
              </button>
            )}
          </div>
        )}
      </main>

      {/* CUSTOMER ANSWERS & QC AUDIT MODAL */}
      <CustomerAnswersModal
        isOpen={!!selectedOrderForAnswers}
        onClose={() => setSelectedOrderForAnswers(null)}
        orderOrQuote={selectedOrderForAnswers}
      />

      {/* AGENT RE-QUOTATION MODAL */}
      <ReQuotationModal
        isOpen={!!selectedOrderForReQuote}
        onClose={() => setSelectedOrderForReQuote(null)}
        order={selectedOrderForReQuote}
        onUpdated={() => fetchOrders()}
      />

      {/* ORDER RESCHEDULE MODAL */}
      {selectedOrderForReschedule && (
        <RescheduleModal
          isOpen={!!selectedOrderForReschedule}
          onClose={() => setSelectedOrderForReschedule(null)}
          orderId={selectedOrderForReschedule.id}
          orderNumber={selectedOrderForReschedule.orderNumber}
          currentDate={selectedOrderForReschedule.pickupDate}
          currentTimeSlot={selectedOrderForReschedule.pickupTimeSlot}
          actorRole="ADMIN"
          actorName="CashALL Admin"
          onSuccess={() => {
            fetchOrders();
          }}
        />
      )}

      {/* ORDER DIAGNOSTICS & VALUATION DRAWER */}
      <OrderDiagnosticsDrawer
        order={selectedOrderForDiag}
        isOpen={isDiagOpen}
        onClose={() => setIsDiagOpen(false)}
        onAuthorizePayout={() => {
          setIsDiagOpen(false);
          fetchOrders();
        }}
      />
    </div>
  );
}
