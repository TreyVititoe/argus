"use client";

import Link from "next/link";
import AppShell from "./AppShell";
import PageHeader from "./PageHeader";

const SECTIONS = [
  {
    icon: "dashboard",
    title: "Dashboard",
    href: "/",
    body: "Executive overview. KPIs at a glance, spending trends, top agencies, and a pulsing insight panel calling out expiring contracts. Click 'View All Opportunities' to jump straight to renewal targets.",
  },
  {
    icon: "explore",
    title: "Discovery",
    href: "/discovery",
    body: "Raw transaction explorer. Search across every agency, vendor, keyword, or description. Filter by year or product. Click any row to see the full transaction details — including the original PO description from the Excel source.",
  },
  {
    icon: "business",
    title: "Companies",
    href: "/companies",
    body: "Vendor-first view. All companies sorted by total spend, with product keywords and the top agencies that buy from each one. Click a vendor to see which agencies drive their revenue.",
  },
  {
    icon: "monitoring",
    title: "Analytics",
    href: "/analytics",
    body: "Deep-dive charts. Spending trends, keyword battles (which products are winning over time), competitor market share, agency type breakdown, and deal size distribution. All filterable by state.",
  },
];

const FAQ = [
  {
    q: "How does Argus flag an 'expiring' contract?",
    a: "Public sector contracts typically run 3–5 years. An agency whose last purchase was 3–5 years ago and had meaningful historical spend (> $10K) is very likely to be in the renewal window right now. Argus surfaces these automatically.",
  },
  {
    q: "What does the opportunity score mean?",
    a: "Opportunity score = historical spend × recency-in-renewal-window. An agency that spent $5M four years ago scores higher than one that spent $100K five years ago. It's not a probability — it's a prioritization signal.",
  },
  {
    q: "How do I switch between states?",
    a: "Use the state pills at the top of every page. 'All States' aggregates the dataset; selecting a single state filters every chart, list, and KPI.",
  },
  {
    q: "When I'm in Florida, can I filter further?",
    a: "Yes — a Region row appears with North / Central / South / State agencies pills. State-level agencies (Florida Department of X) are tagged State agencies since they don't anchor to a specific city.",
  },
];

export default function HelpView() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Documentation"
        title="Help"
        meta="What Argus does and how to use it effectively."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {SECTIONS.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all block"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: "18px" }}>
                    {s.icon}
                  </span>
                </div>
                <h4 className="font-headline font-bold text-primary">{s.title}</h4>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
            </Link>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <h4 className="font-headline font-bold text-primary mb-4">Frequently Asked</h4>
          <div className="space-y-4">
            {FAQ.map((f) => (
              <div key={f.q} className="pb-4 border-b border-surface-container last:border-b-0">
                <div className="font-bold text-primary text-sm mb-1">{f.q}</div>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
    </AppShell>
  );
}
