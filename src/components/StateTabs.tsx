"use client";

import { StateInfo } from "@/lib/types";

interface StateTabsProps {
  states: StateInfo[];
  selected: string; // state code or "ALL"
  onSelect: (code: string) => void;
  total: number;
}

export default function StateTabs({ states, selected, onSelect, total }: StateTabsProps) {
  return (
    <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
      <button
        onClick={() => onSelect("ALL")}
        className={`shrink-0 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
          selected === "ALL"
            ? "bg-primary text-white shadow-sm"
            : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
        }`}
      >
        All States
        <span
          className={`ml-1.5 text-[10px] font-medium ${
            selected === "ALL" ? "text-white/70" : "text-on-surface-variant/70"
          }`}
        >
          {total.toLocaleString()}
        </span>
      </button>

      {states.map((s) => (
        <button
          key={s.code}
          onClick={() => onSelect(s.code)}
          className={`shrink-0 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${
            selected === s.code
              ? "bg-secondary text-white shadow-sm"
              : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high"
          }`}
          title={`${s.name} — ${s.transactionCount.toLocaleString()} transactions`}
        >
          {s.code}
          <span
            className={`ml-1.5 text-[10px] font-medium ${
              selected === s.code ? "text-white/70" : "text-on-surface-variant/70"
            }`}
          >
            {s.transactionCount.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  );
}
