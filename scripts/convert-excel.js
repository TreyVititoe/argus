const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "../public/docs/Carrie_data_2026.xlsx");
const outputPath = path.join(__dirname, "../src/lib/data.json");

const wb = XLSX.readFile(inputPath);

// Parse FL raw sheet (main transaction data)
const rawSheet = wb.Sheets["FL raw"];
const rawRows = XLSX.utils.sheet_to_json(rawSheet);

const transactions = rawRows.map((row) => ({
  coverage: row["Coverage"] || "",
  competitor: row["Major Competitor"] || "",
  keyword: row["Keyword"] || "",
  year: Number(row["Year"]) || 0,
  agency: row["Agency Name"] || "",
  state: row["State"] || "",
  type: row["Type"] || "",
  company: row["Company Name"] || "",
  description: row["Description"] || "",
  quantity: Number(row["Quantity"]) || 0,
  unitPrice: Number(row["Unit Price"]) || 0,
  totalPrice: Number(row["Total Price"]) || 0,
  priceRange: row["Price Range"] || "",
})).filter((t) => t.agency && t.totalPrice > 0);

// Parse agency biggest spenders sheet
const agencySheet = wb.Sheets["agency biggest spenders"];
const agencyRows = XLSX.utils.sheet_to_json(agencySheet);

// Parse company by $ sheet
const companySheet = wb.Sheets["company by $"];
const companyRows = XLSX.utils.sheet_to_json(companySheet);

const output = {
  transactions,
  stats: {
    totalTransactions: transactions.length,
    totalSpend: transactions.reduce((s, t) => s + t.totalPrice, 0),
    yearRange: [
      Math.min(...transactions.map((t) => t.year).filter(Boolean)),
      Math.max(...transactions.map((t) => t.year).filter(Boolean)),
    ],
    uniqueAgencies: [...new Set(transactions.map((t) => t.agency))].length,
    uniqueCompanies: [...new Set(transactions.map((t) => t.company))].length,
  },
};

fs.writeFileSync(outputPath, JSON.stringify(output, null, 0));
console.log(`Converted ${transactions.length} transactions`);
console.log(`Total spend: $${(output.stats.totalSpend / 1e6).toFixed(1)}M`);
console.log(`Agencies: ${output.stats.uniqueAgencies}`);
console.log(`Companies: ${output.stats.uniqueCompanies}`);
console.log(`Years: ${output.stats.yearRange.join("-")}`);
console.log(`Output: ${outputPath}`);
