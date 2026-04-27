"use client";

import Image from "next/image";
import { StateInfo } from "@/lib/types";
import { Region } from "@/lib/regions";

interface StateMapProps {
  states: StateInfo[];
  // Empty array = no selection (placeholder shown). Single = map shown.
  // Multiple = "N states selected" hint, since we only have art for one at a time.
  selectedStates: string[];
  selectedRegion: Region | "all";
}

const STATE_IMAGE: Record<string, string> = {
  GA: "/maps/states/georgia.png",
  NC: "/maps/states/ncarolina.png",
  SC: "/maps/states/scarolina.png",
  VA: "/maps/states/virgina.png",
  MD: "/maps/states/maryland.png",
  TN: "/maps/states/tennessee.png",
  DC: "/maps/states/DC.png",
  WV: "/maps/states/wvirginia.png",
};

const FL_REGION_IMAGE: Record<string, string> = {
  all: "/maps/states/florida.png",
  "North FL": "/maps/states/Nflorida.png",
  "Central FL": "/maps/states/Cflorida.png",
  "South FL": "/maps/states/Sflorida.png",
  "State agencies": "/maps/states/florida.png",
};

function imageFor(selectedState: string, selectedRegion: Region | "all"): string | null {
  if (selectedState === "ALL") return null;
  if (selectedState === "FL") {
    return FL_REGION_IMAGE[selectedRegion] ?? FL_REGION_IMAGE.all;
  }
  return STATE_IMAGE[selectedState] ?? null;
}

export default function StateMap({ states, selectedStates, selectedRegion }: StateMapProps) {
  const singleCode = selectedStates.length === 1 ? selectedStates[0] : null;
  const info = singleCode ? states.find((s) => s.code === singleCode) : null;
  const hasSelection = !!info;
  const src = singleCode ? imageFor(singleCode, selectedRegion) : null;
  const totalCount = selectedStates.length > 1
    ? selectedStates.reduce((sum, c) => sum + (states.find((s) => s.code === c)?.transactionCount || 0), 0)
    : 0;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 h-full min-h-[180px] flex items-center justify-center">
      {selectedStates.length === 0 ? (
        <div
          className="text-[13px] font-medium tracking-[0.02em]"
          style={{ color: "var(--accent)", opacity: 0.7 }}
        >
          Choose a state
        </div>
      ) : !hasSelection ? (
        <div className="text-center">
          <div className="font-bold leading-none tracking-[-0.02em]" style={{ fontSize: "44px", color: "var(--accent)" }}>
            {selectedStates.length}
          </div>
          <div className="mt-2 text-[13px] font-semibold text-primary">states selected</div>
          <div className="text-[12px] text-on-surface-variant tabular-nums">
            {totalCount.toLocaleString()} transactions
          </div>
          <div className="mt-2 text-[11px] text-on-surface-variant truncate max-w-[180px] mx-auto">
            {selectedStates.join(" · ")}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 w-full">
          {src ? (
            <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
              <Image
                src={src}
                alt={info.name}
                fill
                sizes="120px"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          ) : (
            <div
              className="font-bold leading-none tracking-[-0.02em] shrink-0"
              style={{ fontSize: "56px", color: "var(--accent)" }}
            >
              {info.code}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-primary truncate">{info.name}</div>
            <div className="text-[12px] text-on-surface-variant tabular-nums">
              {info.transactionCount.toLocaleString()} transactions
            </div>
            {singleCode === "FL" && selectedRegion !== "all" && (
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
        </div>
      )}
    </div>
  );
}
