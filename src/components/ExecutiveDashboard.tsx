"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./ExecutiveDashboard.module.css";

type StateKey = "all" | "FL" | "GA" | "NC" | "VA" | "MD" | "TN" | "SC" | "DC" | "WV";

type StateRow = {
  tcv: string;
  delta: string;
  exp: string;
  expAmt: string;
  agencies: string;
  of: string;
  win: string;
  deal: string;
  txns: string;
  vendor: string;
  vendorAmt: string;
  txnCount: string;
};

const STATE_DATA: Record<StateKey, StateRow> = {
  all: { tcv: "$2.1B", delta: "+11%", exp: "451", expAmt: "$231.3M", agencies: "1,020", of: "of 1,704", win: "59.9%", deal: "$61.5K", txns: "33.9K txns", vendor: "CDWG", vendorAmt: "$233.4M", txnCount: "33,912" },
  FL:  { tcv: "$842M", delta: "+14%", exp: "187", expAmt: "$98.2M",  agencies: "412",   of: "of 621",   win: "62.1%", deal: "$59.8K", txns: "14.1K txns", vendor: "CDWG", vendorAmt: "$92.4M",  txnCount: "14,086" },
  GA:  { tcv: "$512M", delta: "+8%",  exp: "92",  expAmt: "$48.5M",  agencies: "238",   of: "of 352",   win: "58.4%", deal: "$62.1K", txns: "6.2K txns",  vendor: "Dell", vendorAmt: "$61.8M",  txnCount: "6,209" },
  NC:  { tcv: "$388M", delta: "+6%",  exp: "78",  expAmt: "$41.1M",  agencies: "182",   of: "of 284",   win: "55.7%", deal: "$63.4K", txns: "5.6K txns",  vendor: "CDWG", vendorAmt: "$44.2M",  txnCount: "5,620" },
  VA:  { tcv: "$214M", delta: "+13%", exp: "54",  expAmt: "$26.8M",  agencies: "98",    of: "of 158",   win: "61.2%", deal: "$65.2K", txns: "3.2K txns",  vendor: "SHI",  vendorAmt: "$22.9M",  txnCount: "3,190" },
  MD:  { tcv: "$112M", delta: "+4%",  exp: "22",  expAmt: "$11.3M",  agencies: "54",    of: "of 142",   win: "57.0%", deal: "$57.9K", txns: "1.6K txns",  vendor: "CDWG", vendorAmt: "$9.8M",   txnCount: "1,590" },
  TN:  { tcv: "$98M",  delta: "+9%",  exp: "18",  expAmt: "$5.4M",   agencies: "36",    of: "of 147",   win: "60.2%", deal: "$61.8K", txns: "1.6K txns",  vendor: "Dell", vendorAmt: "$14.1M",  txnCount: "1,578" },
  SC:  { tcv: "$2.1B", delta: "+11%", exp: "451", expAmt: "$231.3M", agencies: "1,020", of: "of 1,704", win: "59.9%", deal: "$61.5K", txns: "33.9K txns", vendor: "CDWG", vendorAmt: "$233.4M", txnCount: "33,912" },
  DC:  { tcv: "$2.1B", delta: "+11%", exp: "451", expAmt: "$231.3M", agencies: "1,020", of: "of 1,704", win: "59.9%", deal: "$61.5K", txns: "33.9K txns", vendor: "CDWG", vendorAmt: "$233.4M", txnCount: "33,912" },
  WV:  { tcv: "$2.1B", delta: "+11%", exp: "451", expAmt: "$231.3M", agencies: "1,020", of: "of 1,704", win: "59.9%", deal: "$61.5K", txns: "33.9K txns", vendor: "CDWG", vendorAmt: "$233.4M", txnCount: "33,912" },
};

const CHART_DATA: Record<StateKey, number[]> = {
  all: [180, 245, 328, 195, 262, 310, 95],
  FL:  [75, 98, 138, 82, 109, 131, 42],
  GA:  [44, 58, 82, 48, 64, 77, 24],
  NC:  [38, 52, 71, 41, 55, 67, 20],
  VA:  [22, 28, 40, 23, 31, 38, 12],
  MD:  [12, 16, 21, 12, 16, 20, 6],
  TN:  [10, 14, 18, 11, 14, 18, 5],
  SC:  [180, 245, 328, 195, 262, 310, 95],
  DC:  [180, 245, 328, 195, 262, 310, 95],
  WV:  [180, 245, 328, 195, 262, 310, 95],
};

const YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

const PRIMARY_PILLS: { key: StateKey; label: string; count: string }[] = [
  { key: "all", label: "All states", count: "33,912" },
  { key: "FL", label: "FL", count: "14,086" },
  { key: "GA", label: "GA", count: "6,209" },
  { key: "NC", label: "NC", count: "5,620" },
  { key: "VA", label: "VA", count: "3,190" },
  { key: "MD", label: "MD", count: "1,590" },
  { key: "TN", label: "TN", count: "1,578" },
];

const MORE_PILLS: { key: StateKey; label: string; count: string }[] = [
  { key: "SC", label: "SC", count: "504" },
  { key: "DC", label: "DC", count: "501" },
  { key: "WV", label: "WV", count: "234" },
];

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Discovery", href: "/discovery" },
  { label: "Companies", href: "/companies" },
  { label: "Analytics", href: "/analytics" },
];

const CHART_W = 700;
const CHART_H = 240;
const PAD_L = 54;
const PAD_R = 18;
const PAD_T = 18;
const PAD_B = 32;
const INNER_W = CHART_W - PAD_L - PAD_R;
const INNER_H = CHART_H - PAD_T - PAD_B;
const HIGHLIGHT_INDEX = 4;

function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function useBodyBackground(color: string) {
  useEffect(() => {
    const prevBody = document.body.style.background;
    const prevHtml = document.documentElement.style.background;
    document.body.style.background = color;
    document.documentElement.style.background = color;
    return () => {
      document.body.style.background = prevBody;
      document.documentElement.style.background = prevHtml;
    };
  }, [color]);
}

export default function ExecutiveDashboard() {
  const [activeState, setActiveState] = useState<StateKey>("all");
  const [showMore, setShowMore] = useState(false);
  const pathname = usePathname();

  useBodyBackground("oklch(0.985 0.004 85)");

  const data = STATE_DATA[activeState];
  const series = CHART_DATA[activeState];

  const chart = useMemo(() => {
    const pts = [...series, series[series.length - 1] * 0.3];
    const max = Math.max(...pts) * 1.15;
    const x = (i: number) => PAD_L + (i / (pts.length - 1)) * INNER_W;
    const y = (v: number) => PAD_T + INNER_H - (v / max) * INNER_H;
    const coords: [number, number][] = pts.map((v, i) => [x(i), y(v)]);
    const linePath = smoothPath(coords);
    const areaPath = `${linePath} L ${coords[coords.length - 1][0]} ${PAD_T + INNER_H} L ${coords[0][0]} ${PAD_T + INNER_H} Z`;
    const maxM = Math.ceil(max);
    const ticks = [0, 90, 180, 270, 360].filter((t) => t <= maxM).map((t) => ({ t, y: y(t) }));
    const xLabels = YEARS.map((yr, i) => ({ yr, x: x(i) }));
    return { linePath, areaPath, ticks, xLabels, coords };
  }, [series]);

  const statesCount = activeState === "all" ? 9 : 1;
  const pillList = showMore ? [...PRIMARY_PILLS, ...MORE_PILLS] : PRIMARY_PILLS;

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark} aria-hidden="true" />
          <div className={styles.brandName}>Argus</div>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              >
                <span className={styles.dot} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button type="button" className={styles.newAnalysis}>
          + New analysis
        </button>

        <div className={styles.sidebarFooter}>
          <Link href="/settings" className={styles.footerLink}>
            Settings
          </Link>
          <Link href="/help" className={styles.footerLink}>
            Help
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <div className={styles.search}>
            <svg
              className={styles.searchIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              className={styles.searchInput}
              placeholder="Search agencies, vendors, contracts…"
            />
          </div>
          <div className={styles.avatar} title="Alexander Wright">AW</div>
        </div>

        <div className={styles.eyebrow}>Market Overview</div>
        <div className={styles.h1Row}>
          <h1 className={styles.headline}>Executive dashboard</h1>
          <div className={styles.h1Meta}>
            {statesCount} states · {data.txnCount} transactions
          </div>
        </div>

        <div className={styles.pills}>
          {pillList.map((p) => {
            const isActive = activeState === p.key;
            return (
              <button
                key={p.key}
                type="button"
                className={`${styles.pill} ${isActive ? styles.pillActive : ""}`}
                onClick={() => setActiveState(p.key)}
              >
                {p.label}
                <span className={styles.pillCount}>{p.count}</span>
              </button>
            );
          })}
          {!showMore && (
            <button
              type="button"
              className={`${styles.pill} ${styles.pillMore}`}
              onClick={() => setShowMore(true)}
            >
              +3 more
            </button>
          )}
        </div>

        <div className={styles.kpiGrid}>
          <Kpi label={<>Total contract<br />value</>} num={data.tcv}>
            <span className={`${styles.kpiSub} ${styles.kpiSubPos}`}>{data.delta}</span>
          </Kpi>
          <Kpi label="Expiring contracts" num={data.exp}>
            <span className={styles.kpiSub}>{data.expAmt}</span>
          </Kpi>
          <Kpi label="Active agencies" num={data.agencies}>
            <span className={styles.kpiSub}>{data.of}</span>
          </Kpi>
          <Kpi label="Win rate" num={data.win}>
            <span className={`${styles.kpiSub} ${styles.kpiSubPos}`}>
              <span className={styles.tri} />
            </span>
          </Kpi>
          <Kpi label="Avg deal size" num={data.deal}>
            <span className={styles.kpiSub}>{data.txns}</span>
          </Kpi>
          <Kpi label="Top vendor" num={data.vendor}>
            <span className={styles.kpiSub}>{data.vendorAmt}</span>
          </Kpi>
        </div>

        <div className={styles.split}>
          <div className={styles.chartCard}>
            <div className={styles.chartHead}>
              <div className={styles.chartTitle}>Procurement spending trends</div>
              <div className={styles.chartSub}>Aggregated spend across all agencies by year</div>
            </div>
            <div className={styles.chartWrap}>
              <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
                  </linearGradient>
                </defs>
                {chart.ticks.map(({ t, y }) => (
                  <g key={t}>
                    <line
                      x1={PAD_L}
                      x2={CHART_W - PAD_R}
                      y1={y}
                      y2={y}
                      stroke="var(--line)"
                      strokeDasharray="2 4"
                    />
                    <text
                      x={PAD_L - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="var(--ink-4)"
                      fontFamily="Inter"
                    >
                      ${t}M
                    </text>
                  </g>
                ))}
                <path d={chart.areaPath} fill="url(#areaGrad)" />
                <path
                  d={chart.linePath}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <circle
                  cx={chart.coords[HIGHLIGHT_INDEX][0]}
                  cy={chart.coords[HIGHLIGHT_INDEX][1]}
                  r="6"
                  fill="#fff"
                  stroke="var(--accent)"
                  strokeWidth="2.2"
                />
                {chart.xLabels.map(({ yr, x }) => (
                  <text
                    key={yr}
                    x={x}
                    y={CHART_H - 10}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--ink-4)"
                    fontFamily="Inter"
                  >
                    {yr}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          <aside className={styles.alertCard}>
            <span className={styles.alertBadge}>Renewal alert</span>
            <div className={styles.alertTitle}>
              {data.exp} contracts
              <br />
              expiring soon
            </div>
            <div className={styles.alertBody}>
              {data.expAmt} in historical spend is in the renewal window. These agencies are prime
              targets for outreach now.
            </div>
            <button type="button" className={styles.alertCta}>
              View all opportunities →
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Kpi({
  label,
  num,
  children,
}: {
  label: React.ReactNode;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiValue}>
        <span className={styles.kpiNum}>{num}</span>
        {children}
      </div>
    </div>
  );
}
