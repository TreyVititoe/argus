"use client";

import { StateInfo } from "@/lib/types";

interface StateTabsProps {
  states: StateInfo[];
  selected: string;
  onSelect: (code: string) => void;
  total: number;
}

export default function StateTabs({ states, selected, onSelect, total }: StateTabsProps) {
  const baseBtn =
    "shrink-0 inline-flex items-center gap-2.5 pl-4 pr-3.5 py-2 rounded-full text-[13px] font-medium border transition-colors";
  const inactive =
    "bg-surface-container-lowest border-outline-variant text-primary hover:border-[oklch(0.88_0.007_85)]";
  const active = "bg-primary border-primary text-white";

  return (
    <div className="flex items-center flex-wrap gap-2.5 pb-2">
      <button
        onClick={() => onSelect("ALL")}
        className={`${baseBtn} ${selected === "ALL" ? active : inactive}`}
      >
        All states
        <span
          className={`text-[12px] font-medium rounded-full px-2 py-0.5 ${
            selected === "ALL" ? "bg-white/12 text-white/80" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {total.toLocaleString()}
        </span>
      </button>

      {states.map((s) => (
        <button
          key={s.code}
          onClick={() => onSelect(s.code)}
          className={`${baseBtn} ${selected === s.code ? active : inactive}`}
          title={`${s.name} — ${s.transactionCount.toLocaleString()} transactions`}
        >
          {s.code}
          <span
            className={`text-[12px] font-medium rounded-full px-2 py-0.5 ${
              selected === s.code ? "bg-white/12 text-white/80" : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {s.transactionCount.toLocaleString()}
          </span>
        </button>
      ))}
    </div>
  );
}
