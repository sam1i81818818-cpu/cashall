/**
 * Centralized Pickup Date & Time Slot Management
 * Handles:
 * 1. Recording dates with explicit calendar dates (e.g., "Today, 29th Sep 2026", "Tomorrow, 30th Sep 2026")
 * 2. Dynamic auto-conversion of scheduled dates relative to the viewer's current date (Asia/Kolkata IST):
 *    - Orders booked yesterday for tomorrow automatically show as "Today, 29th Sep 2026" on the pickup day.
 *    - Orders booked for upcoming dates show "Tomorrow, ..." when 1 day away, and "Today, ..." on pickup day.
 * 3. Consistent time slot formatting so time slots are never missing or rendered with empty parentheses `()`.
 */

export const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const FULL_MONTH_NAMES: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Returns ordinal suffix for day: 1st, 2nd, 3rd, 4th, 21st, 22nd, 23rd, 29th, etc.
 */
export function getOrdinalSuffix(day: number): string {
  const j = day % 10;
  const k = day % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

/**
 * Format a day with its ordinal: 29 -> "29th"
 */
export function formatDayWithOrdinal(day: number): string {
  return `${day}${getOrdinalSuffix(day)}`;
}

export interface ISTDateComponents {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

/**
 * Returns current date in Asia/Kolkata (IST)
 */
export function getNowIST(): ISTDateComponents {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.format(new Date()).split("-");
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
    };
  } catch {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    };
  }
}

/**
 * Offset an IST date by N days
 */
export function addDaysIST(base: ISTDateComponents, days: number): ISTDateComponents {
  const d = new Date(Date.UTC(base.year, base.month - 1, base.day + days));
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/**
 * Format IST components to date string with ordinal: e.g. "29th Sep 2026"
 */
export function formatISTWithOrdinal(comp: ISTDateComponents): string {
  const monthName = MONTH_NAMES[comp.month - 1] || "Sep";
  return `${formatDayWithOrdinal(comp.day)} ${monthName} ${comp.year}`;
}

/**
 * Parses any date string or Date object into IST year, month, day components
 */
export function parseDateToIST(d?: string | Date | null): ISTDateComponents | null {
  if (!d) return null;
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return null;

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const parts = formatter.format(dateObj).split("-");
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10),
    };
  } catch {
    return {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
    };
  }
}

/**
 * Extract target scheduled calendar date from a pickupDate string and optional createdAt.
 */
export function extractPickupTargetDate(
  pickupDateStr?: string | null,
  createdAt?: string | Date | null
): ISTDateComponents | null {
  if (!pickupDateStr || !pickupDateStr.trim()) {
    if (createdAt) return parseDateToIST(createdAt);
    return null;
  }

  const raw = pickupDateStr.trim();
  const lower = raw.toLowerCase();

  // 1. Check for ISO or YYYY-MM-DD pattern: e.g. 2026-09-29
  const isoMatch = raw.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10),
      day: parseInt(isoMatch[3], 10),
    };
  }

  // 2. Check for DD/MM/YYYY or DD-MM-YYYY pattern
  const slashMatch = raw.match(/\b(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b/);
  if (slashMatch) {
    return {
      year: parseInt(slashMatch[3], 10),
      month: parseInt(slashMatch[2], 10),
      day: parseInt(slashMatch[1], 10),
    };
  }

  // 3. Check for Day Month Year: e.g. "29th Sep 2026" or "29 September 2026" or "Sep 29, 2026"
  const textDateMatch = raw.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)(?:\s*,?\s*(\d{4}))?\b/i);
  if (textDateMatch) {
    const day = parseInt(textDateMatch[1], 10);
    const mStr = textDateMatch[2].toLowerCase();
    const month = FULL_MONTH_NAMES[mStr] !== undefined ? FULL_MONTH_NAMES[mStr] + 1 : null;
    const year = textDateMatch[3] ? parseInt(textDateMatch[3], 10) : getNowIST().year;
    if (month !== null && day >= 1 && day <= 31) {
      return { year, month, day };
    }
  }

  // Check reversed: e.g. "Sep 29, 2026" or "September 29th 2026"
  const revTextMatch = raw.match(/\b([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s*,?\s*(\d{4}))?\b/i);
  if (revTextMatch) {
    const mStr = revTextMatch[1].toLowerCase();
    const day = parseInt(revTextMatch[2], 10);
    const month = FULL_MONTH_NAMES[mStr] !== undefined ? FULL_MONTH_NAMES[mStr] + 1 : null;
    const year = revTextMatch[3] ? parseInt(revTextMatch[3], 10) : getNowIST().year;
    if (month !== null && day >= 1 && day <= 31) {
      return { year, month, day };
    }
  }

  // 4. Try standard JS Date parsing on the raw string (stripping words like "Today", "Tomorrow")
  const cleaned = raw.replace(/\b(today|tomorrow|day after)\b/gi, "").replace(/^[,\s-]+|[,\s-]+$/g, "").trim();
  if (cleaned) {
    const parsed = new Date(cleaned);
    if (!isNaN(parsed.getTime())) {
      const comp = parseDateToIST(parsed);
      if (comp) return comp;
    }
  }

  // 5. If it's a relative keyword without a specific embedded date, compute relative to createdAt (or now)
  const baseIST = createdAt ? (parseDateToIST(createdAt) || getNowIST()) : getNowIST();

  if (lower.includes("day after") || lower === "day after tomorrow") {
    return addDaysIST(baseIST, 2);
  }
  if (lower.includes("tomorrow")) {
    return addDaysIST(baseIST, 1);
  }
  if (lower.includes("today")) {
    return baseIST;
  }

  // Fallback to today IST if unparseable
  return getNowIST();
}

/**
 * Generates the standardized string to be RECORDED in the database upon user selection:
 * E.g.
 * - "Today" -> "Today, 29th Sep 2026"
 * - "Tomorrow" -> "Tomorrow, 30th Sep 2026"
 * - "Day After" -> "1st Oct 2026"
 * - Date string / object -> "2nd Oct 2026"
 */
export function getRecordedPickupDate(selection: string | Date): string {
  const todayIST = getNowIST();
  if (selection instanceof Date) {
    const comp = parseDateToIST(selection) || todayIST;
    const diff = Math.round(
      (Date.UTC(comp.year, comp.month - 1, comp.day) - Date.UTC(todayIST.year, todayIST.month - 1, todayIST.day)) / 86400000
    );
    if (diff === 0) return `Today, ${formatISTWithOrdinal(comp)}`;
    if (diff === 1) return `Tomorrow, ${formatISTWithOrdinal(comp)}`;
    return formatISTWithOrdinal(comp);
  }

  const raw = String(selection || "").trim();
  const lower = raw.toLowerCase();

  if (lower === "today" || lower.startsWith("today,")) {
    return `Today, ${formatISTWithOrdinal(todayIST)}`;
  }

  const tomorrowIST = addDaysIST(todayIST, 1);
  if (lower === "tomorrow" || lower.startsWith("tomorrow,")) {
    return `Tomorrow, ${formatISTWithOrdinal(tomorrowIST)}`;
  }

  const dayAfterIST = addDaysIST(todayIST, 2);
  if (lower === "day after" || lower === "day after tomorrow") {
    return formatISTWithOrdinal(dayAfterIST);
  }

  // If already formatted with a valid date, parse and return clean format
  const parsed = extractPickupTargetDate(raw);
  if (parsed) {
    const diff = Math.round(
      (Date.UTC(parsed.year, parsed.month - 1, parsed.day) - Date.UTC(todayIST.year, todayIST.month - 1, todayIST.day)) / 86400000
    );
    if (diff === 0) return `Today, ${formatISTWithOrdinal(parsed)}`;
    if (diff === 1) return `Tomorrow, ${formatISTWithOrdinal(parsed)}`;
    return formatISTWithOrdinal(parsed);
  }

  return raw;
}

export const STANDARD_PICKUP_TIME_SLOTS = ["10 AM - 1 PM", "1 PM - 4 PM", "4 PM - 7 PM"] as const;

export interface ISTTimeComponents {
  hours: number;
  minutes: number;
}

/**
 * Returns current time in Asia/Kolkata (IST)
 */
export function getNowISTTime(): ISTTimeComponents {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const formatted = formatter.format(new Date());
    const parts = formatted.split(":");
    let hours = parseInt(parts[0], 10);
    if (hours === 24) hours = 0;
    const minutes = parseInt(parts[1], 10) || 0;
    return { hours, minutes };
  } catch {
    const now = new Date();
    return { hours: now.getHours(), minutes: now.getMinutes() };
  }
}

/**
 * Checks if a given pickup date string/Date/components represents TODAY in Asia/Kolkata
 */
export function isDateToday(d?: string | Date | ISTDateComponents | null): boolean {
  if (!d) return false;
  if (typeof d === "string") {
    const lower = d.toLowerCase().trim();
    if (lower === "today" || lower.startsWith("today,")) return true;
  }
  const target = d instanceof Date
    ? parseDateToIST(d)
    : (typeof d === "object" && "year" in d && "month" in d && "day" in d
        ? (d as ISTDateComponents)
        : extractPickupTargetDate(String(d)));
  if (!target) return false;
  const today = getNowIST();
  return target.year === today.year && target.month === today.month && target.day === today.day;
}

/**
 * Checks if a given pickup date string/Date/components represents a past date in Asia/Kolkata
 */
export function isDateInPast(d?: string | Date | ISTDateComponents | null): boolean {
  if (!d) return false;
  const target = d instanceof Date
    ? parseDateToIST(d)
    : (typeof d === "object" && "year" in d && "month" in d && "day" in d
        ? (d as ISTDateComponents)
        : extractPickupTargetDate(String(d)));
  if (!target) return false;
  const today = getNowIST();
  const targetUtc = Date.UTC(target.year, target.month - 1, target.day);
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  return targetUtc < todayUtc;
}

/**
 * Returns available time slots for a given date in real-time (IST).
 * 
 * Rules for TODAY:
 * - "10 AM - 1 PM": Available before 11:30 AM (at 12:00 PM it is closed).
 * - "1 PM - 4 PM": Available before 2:30 PM (14:30) (at 12:00 PM it is available).
 * - "4 PM - 7 PM": Available before 5:00 PM (17:00) (at 6:16 PM it is closed).
 * 
 * For tomorrow / future dates:
 * - All standard slots are available ("10 AM - 1 PM", "1 PM - 4 PM", "4 PM - 7 PM").
 * 
 * For past dates:
 * - Returns empty array [].
 */
export function getAvailableTimeSlotsForDate(
  dateSelection?: string | Date | ISTDateComponents | null,
  overrideNowTime?: ISTTimeComponents
): string[] {
  if (!dateSelection) {
    return [...STANDARD_PICKUP_TIME_SLOTS];
  }

  // If past date, no slots
  if (isDateInPast(dateSelection)) {
    return [];
  }

  // If not today, it's future -> all slots available
  if (!isDateToday(dateSelection)) {
    return [...STANDARD_PICKUP_TIME_SLOTS];
  }

  // It's TODAY: filter according to current IST time
  const nowTime = overrideNowTime || getNowISTTime();
  const currentMinutes = nowTime.hours * 60 + nowTime.minutes;

  const slots: string[] = [];

  // 10 AM - 1 PM: cutoff at 11:30 AM (690 minutes)
  if (currentMinutes < 11 * 60 + 30) {
    slots.push("10 AM - 1 PM");
  }

  // 1 PM - 4 PM: cutoff at 2:30 PM (14 * 60 + 30 = 870 minutes)
  if (currentMinutes < 14 * 60 + 30) {
    slots.push("1 PM - 4 PM");
  }

  // 4 PM - 7 PM: cutoff at 5:00 PM (17 * 60 = 1020 minutes)
  if (currentMinutes < 17 * 60) {
    slots.push("4 PM - 7 PM");
  }

  return slots;
}

/**
 * Checks if "Today" is still bookable (i.e. has at least 1 open time slot).
 */
export function isTodayAvailable(overrideNowTime?: ISTTimeComponents): boolean {
  return getAvailableTimeSlotsForDate("Today", overrideNowTime).length > 0;
}

/**
 * Minimum selectable date for the calendar <input type="date" min="..." />
 * Returns ISO format 'YYYY-MM-DD' in Asia/Kolkata.
 * If today has no slots left, returns tomorrow's date to completely block today and previous dates.
 */
export function getMinCalendarDateISO(overrideNowTime?: ISTTimeComponents): string {
  const todayIST = getNowIST();
  const base = isTodayAvailable(overrideNowTime) ? todayIST : addDaysIST(todayIST, 1);
  const yyyy = String(base.year).padStart(4, "0");
  const mm = String(base.month).padStart(2, "0");
  const dd = String(base.day).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns dynamic preset date options for selection UI.
 * - If Today is available:
 *   [Today, Tomorrow, Day After]
 * - If Today has expired (e.g. after 5 PM):
 *   [Tomorrow, Day After, Day 3]
 */
export function getPickupDatePresets(overrideNowTime?: ISTTimeComponents): { key: string; label: string; subLabel: string; value: string }[] {
  const todayIST = getNowIST();
  const todayHasSlots = isTodayAvailable(overrideNowTime);

  if (todayHasSlots) {
    const tomorrowIST = addDaysIST(todayIST, 1);
    const dayAfterIST = addDaysIST(todayIST, 2);
    return [
      {
        key: "Today",
        label: "Today",
        subLabel: `${todayIST.day} ${MONTH_NAMES[todayIST.month - 1]}`,
        value: `Today, ${formatISTWithOrdinal(todayIST)}`,
      },
      {
        key: "Tomorrow",
        label: "Tomorrow",
        subLabel: `${tomorrowIST.day} ${MONTH_NAMES[tomorrowIST.month - 1]}`,
        value: `Tomorrow, ${formatISTWithOrdinal(tomorrowIST)}`,
      },
      {
        key: "Day After",
        label: "Day After",
        subLabel: `${dayAfterIST.day} ${MONTH_NAMES[dayAfterIST.month - 1]}`,
        value: formatISTWithOrdinal(dayAfterIST),
      },
    ];
  }

  // Today is closed: Presets start from Tomorrow, Day After, Day 3
  const tomorrowIST = addDaysIST(todayIST, 1);
  const dayAfterIST = addDaysIST(todayIST, 2);
  const day3IST = addDaysIST(todayIST, 3);
  const d3 = new Date(Date.UTC(day3IST.year, day3IST.month - 1, day3IST.day));
  const d3Weekday = WEEKDAYS[d3.getUTCDay()];

  return [
    {
      key: "Tomorrow",
      label: "Tomorrow",
      subLabel: `${tomorrowIST.day} ${MONTH_NAMES[tomorrowIST.month - 1]}`,
      value: `Tomorrow, ${formatISTWithOrdinal(tomorrowIST)}`,
    },
    {
      key: "Day After",
      label: "Day After",
      subLabel: `${dayAfterIST.day} ${MONTH_NAMES[dayAfterIST.month - 1]}`,
      value: formatISTWithOrdinal(dayAfterIST),
    },
    {
      key: "Day 3",
      label: d3Weekday,
      subLabel: `${day3IST.day} ${MONTH_NAMES[day3IST.month - 1]}`,
      value: formatISTWithOrdinal(day3IST),
    },
  ];
}

/**
 * Returns the sensible default pickup date string:
 * - If Today is available, returns "Today, ..."
 * - If Today is expired, returns "Tomorrow, ..."
 */
export function getDefaultPickupDate(overrideNowTime?: ISTTimeComponents): string {
  if (isTodayAvailable(overrideNowTime)) {
    return getRecordedPickupDate("Today");
  }
  return getRecordedPickupDate("Tomorrow");
}

/**
 * DYNAMIC DATE RESOLVER:
 * Given a pickupDate (as stored in DB or state) and optional createdAt:
 * Automatically compares target date against current IST date:
 * - If target date is TODAY: returns "Today, 29th Sep 2026"
 * - If target date is TOMORROW: returns "Tomorrow, 30th Sep 2026"
 * - If target date is upcoming (> 1 day): returns e.g. "Thu, 1st Oct 2026" or "1st Oct 2026"
 * - If target date is in the past: returns "28th Sep 2026"
 */
export function formatPickupDateDisplay(
  pickupDateStr?: string | null,
  createdAt?: string | Date | null
): string {
  if (!pickupDateStr || !pickupDateStr.trim() || pickupDateStr === "—") {
    return "Scheduled";
  }

  const target = extractPickupTargetDate(pickupDateStr, createdAt);
  if (!target) {
    return pickupDateStr;
  }

  const todayIST = getNowIST();
  const targetUtc = Date.UTC(target.year, target.month - 1, target.day);
  const todayUtc = Date.UTC(todayIST.year, todayIST.month - 1, todayIST.day);
  const diffDays = Math.round((targetUtc - todayUtc) / (1000 * 60 * 60 * 24));

  const dateFormatted = formatISTWithOrdinal(target);

  if (diffDays === 0) {
    return `Today, ${dateFormatted}`;
  }
  if (diffDays === 1) {
    return `Tomorrow, ${dateFormatted}`;
  }
  if (diffDays > 1) {
    // Upcoming date
    const d = new Date(Date.UTC(target.year, target.month - 1, target.day));
    const weekday = WEEKDAYS[d.getUTCDay()];
    return `${weekday}, ${dateFormatted}`;
  }
  // Past date
  return dateFormatted;
}

/**
 * Formats both Date and Time Slot with clean fallbacks.
 * Prevents empty parentheses `()` when slot is missing.
 * E.g. "Today, 29th Sep 2026 (10 AM - 1 PM)"
 */
export function formatPickupDateTimeSlot(
  pickupDateStr?: string | null,
  pickupTimeSlot?: string | null,
  createdAt?: string | Date | null
): string {
  const dateDisplay = formatPickupDateDisplay(pickupDateStr, createdAt);
  const cleanSlot = pickupTimeSlot && pickupTimeSlot.trim() && pickupTimeSlot !== "—" ? pickupTimeSlot.trim() : "10 AM - 1 PM";
  return `${dateDisplay} (${cleanSlot})`;
}

/**
 * Check if two IST date components represent the exact same calendar day
 */
export function isSameISTDate(a: ISTDateComponents | null, b: ISTDateComponents | null): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Format ISTDateComponents as YYYY-MM-DD
 */
export function formatISTIso(comp: ISTDateComponents): string {
  const m = String(comp.month).padStart(2, "0");
  const d = String(comp.day).padStart(2, "0");
  return `${comp.year}-${m}-${d}`;
}

