"use client";

import { StateInfo } from "@/lib/types";
import { Region } from "@/lib/regions";

interface StateMapProps {
  states: StateInfo[];
  selectedState: string;
  selectedRegion: Region | "all";
}

export default function StateMap({ states, selectedState, selectedRegion }: StateMapProps) {
  const info = selectedState !== "ALL" ? states.find((s) => s.code === selectedState) : null;
  const hasSelection = !!info;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 h-full min-h-[180px] flex items-center justify-center">
      {!hasSelection ? (
        <div
          className="text-[13px] font-medium tracking-[0.02em]"
          style={{ color: "var(--accent)", opacity: 0.7 }}
        >
          Choose a state
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="font-bold leading-none tracking-[-0.02em]"
            style={{ fontSize: "64px", color: "var(--accent)" }}
          >
            {info.code}
          </div>
          <div className="mt-3 text-[14px] font-semibold text-primary">{info.name}</div>
          <div className="mt-0.5 text-[12px] text-on-surface-variant">
            {info.transactionCount.toLocaleString()} transactions
          </div>
          {selectedState === "FL" && selectedRegion !== "all" && (
            <div
              className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: "var(--accent-bg)", color: "var(--accent)" }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              {selectedRegion}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
