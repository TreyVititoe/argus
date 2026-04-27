"use client";

import { StateInfo } from "@/lib/types";

interface StateTabsProps {
  states: StateInfo[];
  // Empty array = no states selected, treated as "All states".
  selected: string[];
  onToggle: (code: string) => void;
  onClear: () => void;
  total: number;
}

export default function StateTabs({ states, selected, onToggle, onClear, total }: StateTabsProps) {
  const baseBtn =
    "shrink-0 inline-flex items-center gap-2.5 pl-4 pr-3.5 py-2 rounded-full text-[13px] font-medium border transition-colors";
  const inactive =
    "bg-surface-container-lowest border-outline-variant text-primary hover:border-[oklch(0.88_0.007_85)]";
  const active = "bg-primary border-primary text-on-primary";

  const allActive = selected.length === 0;

  return (
    <div className="flex items-center flex-wrap gap-2.5 pb-2">
      <button
        onClick={onClear}
        className={`${baseBtn} ${allActive ? active : inactive}`}
      >
        All states
        <span
          className={`text-[12px] font-medium rounded-full px-2 py-0.5 ${
            allActive ? "bg-on-primary/12 text-on-primary/80" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {total.toLocaleString()}
        </span>
      </button>

      {states.map((s) => {
        const isOn = selected.includes(s.code);
        return (
          <button
            key={s.code}
            onClick={() => onToggle(s.code)}
            aria-pressed={isOn}
            className={`${baseBtn} ${isOn ? active : inactive}`}
            title={`${s.name} — ${s.transactionCount.toLocaleString()} transactions`}
          >
            {s.code}
            <span
              className={`text-[12px] font-medium rounded-full px-2 py-0.5 ${
                isOn ? "bg-on-primary/12 text-on-primary/80" : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {s.transactionCount.toLocaleString()}
            </span>
          </button>
        );
      })}

      {selected.length > 1 && (
        <span className="text-[11px] font-medium text-on-surface-variant pl-1">
          {selected.length} selected
        </span>
      )}
    </div>
  );
}
