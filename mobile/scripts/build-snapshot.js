#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Reads ../src/lib/data.json (the web app's data) and writes a tiny
// precomputed snapshot the mobile bundle ships with, instead of the
// 14MB raw transactions file. Run after data.json changes.
//
// Usage: node mobile/scripts/build-snapshot.js  (or: npm run snapshot from mobile/)

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..", "..");
const SRC = path.join(ROOT, "src", "lib", "data.json");
const OUT_DIR = path.join(__dirname, "..", "src", "data");

const CURRENT_YEAR = new Date().getFullYear();

const d = JSON.parse(fs.readFileSync(SRC, "utf8"));
const txs = d.transactions;

const totalSpend = txs.reduce((s, t) => s + t.totalPrice, 0);

const stateMap = new Map();
const agencyMap = new Map();
const companyMap = new Map();
const vendorMap = new Map();
const yearMap = new Map();

for (const t of txs) {
  const sv = stateMap.get(t.stateCode) || { count: 0, spend: 0, name: t.state };
  sv.count++; sv.spend += t.totalPrice; stateMap.set(t.stateCode, sv);

  const a = agencyMap.get(t.agency) || { spend: 0, count: 0, lastYear: 0, type: t.type, state: t.stateCode };
  a.spend += t.totalPrice; a.count++; a.lastYear = Math.max(a.lastYear, t.year);
  agencyMap.set(t.agency, a);

  const c = companyMap.get(t.company) || { spend: 0 };
  c.spend += t.totalPrice; companyMap.set(t.company, c);

  if (t.competitor && t.competitor !== "Medical Platforms") {
    const v = vendorMap.get(t.competitor) || { spend: 0 };
    v.spend += t.totalPrice; vendorMap.set(t.competitor, v);
  }
  yearMap.set(t.year, (yearMap.get(t.year) || 0) + t.totalPrice);
}

const states = [...stateMap.entries()]
  .map(([code, v]) => ({ code, name: v.name, count: v.count, spend: v.spend }))
  .sort((a, b) => b.spend - a.spend);

const topAgencies = [...agencyMap.entries()]
  .map(([name, v]) => ({ name, ...v }))
  .sort((a, b) => b.spend - a.spend)
  .slice(0, 50);

const topCompanies = [...companyMap.entries()]
  .map(([name, v]) => ({ name, ...v }))
  .sort((a, b) => b.spend - a.spend)
  .slice(0, 30);

const topVendors = [...vendorMap.entries()]
  .map(([name, v]) => ({ name, ...v }))
  .sort((a, b) => b.spend - a.spend)
  .slice(0, 20);

const yearSpend = [...yearMap.entries()]
  .map(([year, spend]) => ({ year, spend }))
  .sort((a, b) => a.year - b.year);

const expiring = [...agencyMap.values()].filter(
  (a) => a.spend >= 10_000 && CURRENT_YEAR - a.lastYear >= 3 && CURRENT_YEAR - a.lastYear <= 5
).length;
const active = [...agencyMap.values()].filter((a) => CURRENT_YEAR - a.lastYear <= 2).length;

const top100 = [...txs]
  .sort((a, b) => b.totalPrice - a.totalPrice)
  .slice(0, 100)
  .map((t) => ({
    agency: t.agency,
    state: t.stateCode,
    year: t.year,
    company: t.company,
    keyword: t.keyword || "",
    total: t.totalPrice,
  }));

const stats = {
  totalSpend,
  totalTransactions: txs.length,
  totalAgencies: agencyMap.size,
  expiringCount: expiring,
  activeCount: active,
  topAgencies,
  topCompanies,
  topVendors,
  yearSpend,
  states,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "dashboard-stats.json"), JSON.stringify(stats));
fs.writeFileSync(path.join(OUT_DIR, "top-transactions.json"), JSON.stringify(top100));

const stat = (f) => (fs.statSync(path.join(OUT_DIR, f)).size / 1024).toFixed(1);
console.log(`dashboard-stats.json: ${stat("dashboard-stats.json")} KB`);
console.log(`top-transactions.json: ${stat("top-transactions.json")} KB`);
