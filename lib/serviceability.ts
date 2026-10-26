export interface ServiceableDistrict {
  id: string;
  name: string;
  state: string;
  count: number;
  pincodes: string[];
}

// ==============================================================================
// CashALL VERIFIED MASTER SERVICEABLE PIN CODES
// Source: CashALL_VERIFIED_PIN_MASTER_Kolkata_Howrah_Hooghly_Barrackpore.xlsx
// Total Verified Coverage: 217 Unique West Bengal PIN Codes across 4 Regions
// ==============================================================================

// 1. Kolkata + Neighbouring 700xxx Belt (151 PIN codes)
export const KOLKATA_PINCODES: string[] = [
  "700001", "700002", "700003", "700004", "700005", "700006", "700007", "700008",
  "700009", "700010", "700011", "700012", "700013", "700014", "700015", "700016",
  "700017", "700019", "700020", "700021", "700022", "700024", "700025", "700026",
  "700027", "700028", "700029", "700030", "700031", "700032", "700033", "700034",
  "700035", "700036", "700037", "700038", "700039", "700040", "700041", "700042",
  "700045", "700046", "700047", "700048", "700049", "700050", "700051", "700052",
  "700053", "700054", "700055", "700056", "700057", "700058", "700059", "700060",
  "700061", "700062", "700063", "700064", "700065", "700067", "700068", "700069",
  "700070", "700071", "700072", "700073", "700074", "700075", "700076", "700077",
  "700078", "700079", "700080", "700081", "700082", "700083", "700084", "700085",
  "700086", "700087", "700088", "700089", "700090", "700091", "700092", "700093",
  "700094", "700095", "700096", "700097", "700098", "700099", "700100", "700101",
  "700102", "700105", "700106", "700107", "700108", "700135", "700136", "700156",
  "700157", "700159", "700160"
];

// 2. Howrah District (19 PIN codes)
export const HOWRAH_PINCODES: string[] = [
  "711101", "711102", "711103", "711104", "711105", "711106", "711107", "711108",
  "711109", "711110", "711111", "711112", "711113", "711201", "711202", "711203",
  "711204", "711206", "711227"
];

// 3. Hooghly District (24 PIN codes)
export const HOOGHLY_PINCODES: string[] = [
  "712101", "712102", "712103", "712105", "712124", "712125",
  "712136", "712137", "712138", "712139", "712201", "712202", "712203", "712204",
  "712221", "712222", "712232", "712233", "712234", "712235", "712246", "712248",
  "712249", "712258"
];

// 4. Barrackpore Subdivision (12 PIN codes)
export const BARRACKPORE_PINCODES: string[] = [
  "700035", "700049", "700051", "700056", "700057", "700058", "700065", "700076",
  "700077", "700083", "700090", "700108"
];

// 5. Gorakhpur, Uttar Pradesh (16 PIN codes)
export const GORAKHPUR_PINCODES: string[] = [
  "273001", "273002", "273003", "273004", "273005", "273006", "273007", "273008",
  "273009", "273010", "273012", "273013", "273014", "273015", "273016", "273017"
];

// 6. Ballia, Uttar Pradesh (2 PIN codes)
export const BALLIA_PINCODES: string[] = [
  "277001", "277506"
];

// 7. Patna, Bihar (2 PIN codes)
export const PATNA_PINCODES: string[] = [
  "800003", "800020"
];

// 8. Ranchi, Jharkhand (3 PIN codes)
export const RANCHI_PINCODES: string[] = [
  "834001", "834002", "834003"
];

export const SERVICEABLE_DISTRICTS: ServiceableDistrict[] = [
  {
    id: "dist-kolkata",
    name: "Kolkata",
    state: "West Bengal",
    count: KOLKATA_PINCODES.length,
    pincodes: KOLKATA_PINCODES,
  },
  {
    id: "dist-howrah",
    name: "Howrah",
    state: "West Bengal",
    count: HOWRAH_PINCODES.length,
    pincodes: HOWRAH_PINCODES,
  },
  {
    id: "dist-hooghly",
    name: "Hooghly",
    state: "West Bengal",
    count: HOOGHLY_PINCODES.length,
    pincodes: HOOGHLY_PINCODES,
  },
  {
    id: "dist-barrackpore",
    name: "Barrackpore",
    state: "West Bengal",
    count: BARRACKPORE_PINCODES.length,
    pincodes: BARRACKPORE_PINCODES,
  },
  {
    id: "dist-gorakhpur",
    name: "Gorakhpur",
    state: "Uttar Pradesh",
    count: GORAKHPUR_PINCODES.length,
    pincodes: GORAKHPUR_PINCODES,
  },
  {
    id: "dist-ballia",
    name: "Ballia",
    state: "Uttar Pradesh",
    count: BALLIA_PINCODES.length,
    pincodes: BALLIA_PINCODES,
  },
  {
    id: "dist-patna",
    name: "Patna",
    state: "Bihar",
    count: PATNA_PINCODES.length,
    pincodes: PATNA_PINCODES,
  },
  {
    id: "dist-ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    count: RANCHI_PINCODES.length,
    pincodes: RANCHI_PINCODES,
  },
];

// Specific locality metadata for corridor stations / hubs
export const NAMED_LOCALITIES: Record<string, string> = {
  "711201": "Bally",
  "711202": "Belur",
  "711203": "Bhattanagar",
  "711204": "Liluah",
  "712101": "Chinsurah",
  "712102": "Chinsurah",
  "712103": "Chinsurah",
  "712124": "Bhadreswar",
  "712136": "Chandannagar",
  "712139": "Mankundu",
  "712201": "Serampore",
  "712222": "Baidyabati",
  "712233": "Hindmotor",
  "712235": "Konnagar",
  "712248": "Rishra",
  "712258": "Uttarpara",
  "834001": "Main Road / Station",
  "834002": "Harmu Road",
  "834003": "Kanke / Morabadi",
  "800003": "Patna City",
  "800020": "Ram Krishna Nagar / Kankarbagh",
};

// ==============================================================================
// CashALL EXPLICIT UN-SERVICEABLE / RESTRICTED PIN CODES (ZERO DOORSTEP SERVICE)
// Customer entering any of these PIN codes will be shown UNSERVICEABLE immediately
// ==============================================================================
export const EXCLUDED_UNSERVICEABLE_PINCODES = new Set<string>([
  // 700111 TO 700134
  "700111", "700112", "700113", "700114", "700115", "700116", "700117", "700118",
  "700119", "700120", "700121", "700122", "700123", "700124", "700125", "700126",
  "700127", "700128", "700129", "700130", "700131", "700132", "700133", "700134",

  // 700137 TO 700140
  "700137", "700138", "700139", "700140",

  // 700141 TO 700150
  "700141", "700142", "700143", "700144", "700145", "700146", "700147", "700148",
  "700149", "700150",

  // 700151 TO 700155
  "700151", "700152", "700153", "700154", "700155",

  // 700158
  "700158",

  // 712104
  "712104",

  // 712123
  "712123",

  // Barrackpore 7431xx removed areas (21 pincodes)
  "743122", "743123", "743124", "743125",
  "743126", "743127", "743128", "743129",
  "743130", "743133", "743134", "743135",
  "743136", "743144", "743145", "743165",
  "743166", "743178", "743193", "743194",
  "743195",
]);

// Fast lookup map for all serviceable pincodes (O(1) lookups)
export interface PincodeDetails {
  city: string;
  state: string;
  district: string;
  locality?: string;
}

const PINCODE_MAP: Record<string, PincodeDetails> = {};

// Populate district records
SERVICEABLE_DISTRICTS.forEach((dist) => {
  dist.pincodes.forEach((pin) => {
    if (EXCLUDED_UNSERVICEABLE_PINCODES.has(pin)) return;
    if (!PINCODE_MAP[pin]) {
      PINCODE_MAP[pin] = {
        city: dist.name,
        state: dist.state,
        district: dist.name,
        locality: NAMED_LOCALITIES[pin] || undefined,
      };
    }
  });
});

export function isPincodeServiced(pincode: string): boolean {
  if (!pincode) return false;
  const cleanPin = pincode.trim().replace(/\D/g, "");
  if (EXCLUDED_UNSERVICEABLE_PINCODES.has(cleanPin)) {
    return false;
  }
  return Boolean(PINCODE_MAP[cleanPin]);
}

export function getPincodeDetails(pincode: string): PincodeDetails | null {
  if (!pincode) return null;
  const cleanPin = pincode.trim().replace(/\D/g, "");
  if (EXCLUDED_UNSERVICEABLE_PINCODES.has(cleanPin)) {
    return null;
  }
  return PINCODE_MAP[cleanPin] || null;
}

export function getAllServiceablePincodes(): string[] {
  return Object.keys(PINCODE_MAP);
}

/**
 * Resolves the Indian State / Union Territory from a 6-digit PIN code.
 * Checks verified serviceable master database first, then standard postal prefixes.
 */
export function getStateFromPincode(pincode: string): string | null {
  if (!pincode) return null;
  const pin = pincode.trim().replace(/\D/g, "");
  if (!pin || pin.length < 2) return null;

  // 1. Direct match from verified master database
  const details = PINCODE_MAP[pin];
  if (details?.state) {
    return details.state;
  }

  // 2. Exact Postal Prefix Mapping for Indian PIN codes
  const prefix3 = pin.slice(0, 3);
  const prefix2 = pin.slice(0, 2);
  const p3 = parseInt(prefix3, 10);
  const p2 = parseInt(prefix2, 10);

  // Specific 3-digit prefix overrides
  if (p3 === 737) return "Sikkim";
  if (p3 === 744) return "Andaman & Nicobar Islands";
  if (p3 === 605) return "Puducherry";
  if (p3 === 682) return "Lakshadweep";
  if (p3 === 403) return "Goa";
  if (p3 === 160) return "Chandigarh";
  if (p3 === 396) return "Dadra and Nagar Haveli and Daman and Diu";
  if (p3 >= 790 && p3 <= 792) return "Arunachal Pradesh";
  if (p3 >= 793 && p3 <= 794) return "Meghalaya";
  if (p3 === 795) return "Manipur";
  if (p3 === 796) return "Mizoram";
  if (p3 === 797) return "Nagaland";
  if (p3 === 799) return "Tripura";

  // Uttarakhand vs Uttar Pradesh
  if ((p3 >= 246 && p3 <= 249) || (p3 >= 262 && p3 <= 263)) return "Uttarakhand";

  // Bihar vs Jharkhand (Zone 8)
  if ((p3 >= 831 && p3 <= 835) || (p3 >= 825 && p3 <= 829) || (p3 >= 814 && p3 <= 816)) {
    return "Jharkhand";
  }
  if ((p3 >= 800 && p3 <= 805) || (p3 >= 811 && p3 <= 813) || (p3 >= 821 && p3 <= 824) || (p3 >= 841 && p3 <= 855)) {
    return "Bihar";
  }

  // Telangana vs Andhra Pradesh (Zone 5)
  if (p3 >= 500 && p3 <= 509) return "Telangana";
  if (p3 >= 515 && p3 <= 535) return "Andhra Pradesh";

  // Standard 2-digit regional mappings
  if (p2 === 11) return "Delhi";
  if (p2 >= 12 && p2 <= 13) return "Haryana";
  if (p2 >= 14 && p2 <= 15) return "Punjab";
  if (p2 === 16) return "Chandigarh";
  if (p2 === 17) return "Himachal Pradesh";
  if (p2 >= 18 && p2 <= 19) return "Jammu & Kashmir";
  if (p2 >= 20 && p2 <= 28) return "Uttar Pradesh";
  if (p2 >= 30 && p2 <= 34) return "Rajasthan";
  if (p2 >= 36 && p2 <= 39) return "Gujarat";
  if (p2 >= 40 && p2 <= 44) return "Maharashtra";
  if (p2 >= 45 && p2 <= 48) return "Madhya Pradesh";
  if (p2 === 49) return "Chhattisgarh";
  if (p2 >= 50 && p2 <= 53) return "Andhra Pradesh";
  if (p2 >= 56 && p2 <= 59) return "Karnataka";
  if (p2 >= 60 && p2 <= 64) return "Tamil Nadu";
  if (p2 >= 67 && p2 <= 69) return "Kerala";
  if (p2 >= 70 && p2 <= 74) return "West Bengal";
  if (p2 >= 75 && p2 <= 76) return "Odisha";
  if (p2 === 78) return "Assam";
  if (p2 >= 80 && p2 <= 85) return "Bihar";

  return null;
}
