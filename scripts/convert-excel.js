const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname, "../public/docs");
const outputPath = path.join(__dirname, "../src/lib/data.json");

// Map each Excel file to its raw sheet name
const FILES = [
  { file: "Carrie_data_2026.xlsx", rawSheet: "FL raw" },
  { file: "DC_MD_2025.xlsx", rawSheet: "DC+MD raw" },
  { file: "GA_2025.xlsx", rawSheet: "GA raw" },
  { file: "NC_SC_2025.xlsx", rawSheet: "NC+SC raw" },
  { file: "TN_2025.xlsx", rawSheet: "TN raw" },
  { file: "VA_2025.xlsx", rawSheet: "VA raw" },
  { file: "WVA_2025.xlsx", rawSheet: "WVa raw" },
];

const STATE_CODES = {
  Florida: "FL",
  "District of Columbia": "DC",
  Maryland: "MD",
  Georgia: "GA",
  "North Carolina": "NC",
  "South Carolina": "SC",
  Tennessee: "TN",
  Virginia: "VA",
  "West Virginia": "WV",
};

function parseRows(rows) {
  return rows
    .map((row) => {
      const keyword = row["Keyword"] || row["Keywords"] || "";
      const stateFull = String(row["State"] || "").trim();
      const stateCode = STATE_CODES[stateFull] || stateFull.slice(0, 2).toUpperCase();
      const totalPrice = Number(row["Total Price"] || row["Sum of Total Price"] || 0);
      return {
        coverage: row["Coverage"] || "",
        competitor: row["Major Competitor"] || "",
        keyword,
        year: Number(row["Year"]) || 0,
        agency: row["Agency Name"] || "",
        state: stateFull,
        stateCode,
        type: row["Type"] || "",
        company: row["Company Name"] || "",
        description: row["Description"] || "",
        quantity: Number(row["Quantity"]) || 0,
        unitPrice: Number(row["Unit Price"]) || 0,
        totalPrice,
        priceRange: row["Price Range"] || "",
      };
    })
    .filter((t) => t.agency && t.totalPrice > 0);
}

const allTransactions = [];

for (const { file, rawSheet } of FILES) {
  const fullPath = path.join(docsDir, file);
  if (!fs.existsSync(fullPath)) {
    console.warn(`Missing file: ${file}`);
    continue;
  }
  const wb = XLSX.readFile(fullPath);
  const sheet = wb.Sheets[rawSheet];
  if (!sheet) {
    console.warn(`Missing sheet '${rawSheet}' in ${file}. Available: ${wb.SheetNames.join(", ")}`);
    continue;
  }
  const rows = XLSX.utils.sheet_to_json(sheet);
  const parsed = parseRows(rows);
  allTransactions.push(...parsed);
  console.log(`${file}: ${parsed.length} transactions`);
}

const stateCounts = new Map();
for (const t of allTransactions) {
  if (!t.stateCode) continue;
  stateCounts.set(t.stateCode, (stateCounts.get(t.stateCode) || 0) + 1);
}
const states = Array.from(stateCounts.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([code, count]) => ({
    code,
    name: Object.keys(STATE_CODES).find((n) => STATE_CODES[n] === code) || code,
    transactionCount: count,
  }));

const output = {
  transactions: allTransactions,
  states,
  stats: {
    totalTransactions: allTransactions.length,
    totalSpend: allTransactions.reduce((s, t) => s + t.totalPrice, 0),
    uniqueAgencies: new Set(allTransactions.map((t) => t.agency)).size,
    uniqueCompanies: new Set(allTransactions.map((t) => t.company)).size,
    stateCount: states.length,
  },
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 0));
console.log(`\nTotal: ${output.stats.totalTransactions} transactions`);
console.log(`Total spend: $${(output.stats.totalSpend / 1e6).toFixed(1)}M`);
console.log(`States: ${states.map((s) => `${s.code} (${s.transactionCount})`).join(", ")}`);
console.log(`Output: ${outputPath}`);
