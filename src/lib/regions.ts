// Region classifier for state-level breakdowns.
// Currently only Florida is mapped; easy to extend for other states.

export type Region = "North FL" | "Central FL" | "South FL" | "State agencies" | "Unknown";

// Florida regions based on county/city geography
const FL_SOUTH = [
  "miami", "fort lauderdale", "ft lauderdale", "west palm", "miami-dade",
  "broward", "palm beach", "martin county", "st lucie", "st. lucie",
  "saint lucie", "collier", "lee county", "monroe county", "hendry",
  "glades", "okeechobee", "indian river", "charlotte county", "desoto",
  "highlands", "hardee", "naples", "fort myers", "ft myers", "key west",
  "boca raton", "pompano", "hollywood, florida", "jackson health",
  "south florida", "coral gables", "doral", "homestead", "hialeah",
  "weston", "boynton beach", "delray", "wellington",
];

const FL_CENTRAL = [
  "orlando", "tampa", "st petersburg", "st. petersburg", "saint petersburg",
  "orange county", "hillsborough", "pinellas", "polk county", "volusia",
  "brevard", "lake county", "seminole county", "osceola", "sumter",
  "citrus county", "hernando", "pasco", "manatee", "sarasota",
  "daytona", "lakeland", "kissimmee", "melbourne", "ocala",
  "clearwater", "bradenton", "winter park", "winter haven",
  "space coast", "central florida",
];

const FL_NORTH = [
  "jacksonville", "tallahassee", "pensacola", "gainesville",
  "escambia", "leon", "duval", "alachua", "bay county", "franklin",
  "okaloosa", "santa rosa", "walton", "hamilton county", "madison county",
  "taylor county", "jefferson county", "wakulla", "liberty county",
  "gulf county", "calhoun", "holmes county", "jackson county",
  "washington county", "gadsden", "suwannee", "lafayette", "columbia county",
  "baker county", "nassau county", "clay county", "bradford",
  "union county", "putnam", "dixie county", "gilchrist", "levy county",
  "marion county", "flagler", "st johns", "st. johns", "saint johns",
  "ormond beach", "panama city", "destin", "fort walton",
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
  // These don't have a regional anchor.
  if (/^florida (department|office|agency|board|commission|division|lottery|supreme court|department)/.test(a)) {
    return "State agencies";
  }

  if (matchAny(a, FL_SOUTH)) return "South FL";
  if (matchAny(a, FL_CENTRAL)) return "Central FL";
  if (matchAny(a, FL_NORTH)) return "North FL";

  // "X, Florida" with no city match → probably a less common municipality we haven't mapped
  return "Unknown";
}

// Regions per state. Extend as needed.
export function getRegion(agency: string, stateCode: string): Region | null {
  if (stateCode === "FL") return getFlRegion(agency);
  return null; // other states don't have a region classifier yet
}

export const FL_REGIONS: Region[] = ["North FL", "Central FL", "South FL", "State agencies"];
