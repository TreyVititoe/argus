"use client";

import { Region } from "@/lib/regions";

const TILE = 40;
const GAP = 5;

// Approximate geographic positions of the 9 tracked states on a small tile grid.
// Grid columns 0..3, rows 0..5.
const TILE_LAYOUT: { code: string; col: number; row: number }[] = [
  { code: "WV", col: 1, row: 0 },
  { code: "MD", col: 2, row: 0 },
  { code: "DC", col: 3, row: 0 },
  { code: "VA", col: 2, row: 1 },
  { code: "TN", col: 0, row: 1 },
  { code: "NC", col: 2, row: 2 },
  { code: "SC", col: 2, row: 3 },
  { code: "GA", col: 1, row: 4 },
  { code: "FL", col: 2, row: 5 },
];

const MAP_COLS = 4;
const MAP_ROWS = 6;
const MAP_W = MAP_COLS * (TILE + GAP) - GAP;
const MAP_H = MAP_ROWS * (TILE + GAP) - GAP;

function tx(col: number) {
  return col * (TILE + GAP);
}
function ty(row: number) {
  return row * (TILE + GAP);
}

interface RegionMapProps {
  selectedState: string;
  selectedRegion: Region | "all";
  onSelectState: (code: string) => void;
  onSelectRegion: (r: Region | "all") => void;
  stateCounts?: Record<string, number>;
}

export default function RegionMap({
  selectedState,
  selectedRegion,
  onSelectState,
  onSelectRegion,
  stateCounts = {},
}: RegionMapProps) {
  const isFL = selectedState === "FL";

  return (
    <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 flex flex-col">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant mb-1">
            Region map
          </div>
          <div className="font-headline text-[22px] leading-tight text-primary">
            {isFL ? "Florida" : selectedState === "ALL" ? "Southeast" : selectedState}
          </div>
        </div>
        {(selectedState !== "ALL" || selectedRegion !== "all") && (
          <button
            type="button"
            onClick={() => {
              onSelectRegion("all");
              onSelectState("ALL");
            }}
            className="text-[12px] font-medium text-[var(--accent)] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isFL ? (
          <FLView selectedRegion={selectedRegion} onSelectRegion={onSelectRegion} />
        ) : (
          <USView
            selectedState={selectedState}
            onSelectState={onSelectState}
            stateCounts={stateCounts}
          />
        )}
      </div>
    </div>
  );
}

function USView({
  selectedState,
  onSelectState,
  stateCounts,
}: {
  selectedState: string;
  onSelectState: (code: string) => void;
  stateCounts: Record<string, number>;
}) {
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ width: "100%", maxWidth: 240 }}>
      {TILE_LAYOUT.map((s) => {
        const active = selectedState === s.code;
        const count = stateCounts[s.code];
        return (
          <g
            key={s.code}
            transform={`translate(${tx(s.col)} ${ty(s.row)})`}
            onClick={() => onSelectState(active ? "ALL" : s.code)}
            style={{ cursor: "pointer" }}
          >
            <rect
              width={TILE}
              height={TILE}
              rx="7"
              fill={active ? "var(--accent)" : "var(--accent-bg)"}
              stroke={active ? "var(--accent)" : "var(--line-2)"}
              strokeWidth="1"
            />
            <text
              x={TILE / 2}
              y={count !== undefined ? TILE / 2 - 1 : TILE / 2 + 4}
              textAnchor="middle"
              fontSize="13"
              fontWeight="600"
              fill={active ? "#fff" : "var(--ink)"}
              style={{ pointerEvents: "none" }}
            >
              {s.code}
            </text>
            {count !== undefined && (
              <text
                x={TILE / 2}
                y={TILE / 2 + 11}
                textAnchor="middle"
                fontSize="8"
                fontWeight="500"
                fill={active ? "rgba(255,255,255,0.75)" : "var(--ink-3)"}
                style={{ pointerEvents: "none" }}
              >
                {count.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Simplified Florida shape with 3 interactive region areas.
// Panhandle runs across the NW, Peninsula hangs south; we split the peninsula
// at roughly Orlando's latitude.
const FL_REGION_PATHS = {
  north:
    "M 12 58 L 120 52 L 128 64 L 118 78 L 104 80 L 12 82 Z",
  central:
    "M 118 52 L 152 52 L 168 58 L 176 70 L 182 90 L 178 118 L 170 135 L 148 140 L 124 138 L 108 128 L 98 110 L 96 90 L 104 80 L 118 78 L 128 64 Z",
  south:
    "M 108 128 L 148 140 L 170 135 L 170 158 L 160 190 L 144 215 L 128 228 L 114 230 L 102 218 L 92 188 L 88 160 L 96 140 Z",
};

function FLView({
  selectedRegion,
  onSelectRegion,
}: {
  selectedRegion: Region | "all";
  onSelectRegion: (r: Region | "all") => void;
}) {
  const regions: { key: Region; label: string; d: string; labelX: number; labelY: number }[] = [
    { key: "North FL", label: "North", d: FL_REGION_PATHS.north, labelX: 60, labelY: 72 },
    { key: "Central FL", label: "Central", d: FL_REGION_PATHS.central, labelX: 144, labelY: 98 },
    { key: "South FL", label: "South", d: FL_REGION_PATHS.south, labelX: 130, labelY: 182 },
  ];
  return (
    <svg viewBox="0 0 200 250" style={{ width: "100%", maxWidth: 240 }}>
      {regions.map((r) => {
        const active = selectedRegion === r.key;
        return (
          <g
            key={r.key}
            onClick={() => onSelectRegion(active ? "all" : r.key)}
            style={{ cursor: "pointer" }}
          >
            <path
              d={r.d}
              fill={active ? "var(--accent)" : "var(--accent-bg)"}
              stroke={active ? "var(--accent)" : "var(--line-2)"}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <text
              x={r.labelX}
              y={r.labelY}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill={active ? "#fff" : "var(--ink)"}
              style={{ pointerEvents: "none" }}
            >
              {r.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
