// Region classifier for state-level breakdowns.
// Currently only Florida is mapped; easy to extend for other states.

export type Region = "North FL" | "Central FL" | "South FL" | "State agencies" | "Unknown";

// Latitude-based split per product owner:
//   South FL = south of Orlando (≤ ~28.5°N), Tampa Bay included
//   Central FL = Orlando lat and north through the peninsula (Ocala, Gainesville,
//                Jacksonville, St Johns, etc.) — excludes the panhandle
//   North FL = Tallahassee and west (panhandle only)

const FL_SOUTH = [
  // SE metros
  "miami", "fort lauderdale", "ft lauderdale", "west palm", "miami-dade",
  "broward", "palm beach", "hialeah", "weston", "boca raton", "pompano",
  "hollywood, florida", "coral gables", "doral", "homestead",
  "boynton beach", "delray", "wellington", "jackson health",
  // Tampa Bay / Gulf coast south of Orlando
  "tampa", "st petersburg", "st. petersburg", "saint petersburg",
  "hillsborough", "pinellas", "manatee", "sarasota", "clearwater",
  "bradenton", "pasco", "hernando",
  // Central east coast south of Orlando (Space Coast / Treasure Coast)
  "brevard", "space coast", "melbourne", "vero beach",
  "indian river", "st lucie", "st. lucie", "saint lucie", "port st lucie",
  "martin county",
  // SW / interior south
  "collier", "lee county", "monroe county", "hendry", "glades", "okeechobee",
  "charlotte county", "desoto", "highlands", "hardee", "naples",
  "fort myers", "ft myers", "cape coral", "key west",
  // I-4 south strip
  "polk county", "lakeland", "winter haven",
  "south florida",
];

const FL_CENTRAL = [
  // Orlando metro
  "orlando", "orange county", "seminole county", "osceola", "kissimmee",
  "winter park", "lake county",
  // East coast north of Orlando
  "volusia", "daytona", "ormond beach", "flagler",
  // Central peninsula going north
  "sumter", "citrus county", "marion county", "ocala",
  // NE FL / First Coast
  "alachua", "gainesville", "duval", "jacksonville",
  "st johns", "st. johns", "saint johns", "st augustine",
  "clay county", "putnam", "nassau county", "baker county",
  "bradford", "union county",
  // North-central peninsula (not panhandle)
  "suwannee", "lafayette", "columbia county", "dixie county", "gilchrist",
  "levy county", "hamilton county", "madison county", "taylor county",
  "jefferson county",
  "central florida",
];

const FL_NORTH = [
  "tallahassee", "leon", "wakulla", "liberty county",
  "gulf county", "franklin", "calhoun", "holmes county",
  "jackson county", "washington county", "gadsden",
  "bay county", "panama city",
  "walton", "okaloosa", "destin", "fort walton",
  "santa rosa", "escambia", "pensacola",
  "north florida", "panhandle",
];

function matchAny(text: string, needles: string[]): boolean {
  for (const n of needles) {
    if (text.includes(n)) return true;
  }
  return false;
}

export function getFlRegion(agency: string): Region {
  const a = agency.toLowerCase();

  // State-level agencies: "Florida Department of X", "Florida Office of X", etc.
  if (/^florida (department|office|agency|board|commission|division|lottery|supreme court|department)/.test(a)) {
    return "State agencies";
  }

  if (matchAny(a, FL_SOUTH)) return "South FL";
  if (matchAny(a, FL_CENTRAL)) return "Central FL";
  if (matchAny(a, FL_NORTH)) return "North FL";

  return "Unknown";
}

export function getRegion(agency: string, stateCode: string): Region | null {
  if (stateCode === "FL") return getFlRegion(agency);
  return null;
}

export const FL_REGIONS: Region[] = ["North FL", "Central FL", "South FL", "State agencies"];
