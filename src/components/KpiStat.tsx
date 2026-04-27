"use client";

interface KpiStatProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  tooltip?: string;
}

export default function KpiStat({ label, value, delta, deltaType = "positive", tooltip }: KpiStatProps) {
  const deltaColor =
    deltaType === "positive"
      ? "text-[oklch(0.55_0.14_150)]"
      : deltaType === "negative"
      ? "text-on-error-container"
      : "text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 min-h-[118px] flex flex-col gap-2.5 transition-colors hover:border-[oklch(0.88_0.007_85)]">
      <div className="flex items-start gap-1.5">
        <p className="text-on-surface-variant text-[11px] font-bold uppercase tracking-[0.12em] leading-tight flex-1">
          {label}
        </p>
        {tooltip && (
          <span
            className="group relative shrink-0 text-on-surface-variant cursor-help"
            tabIndex={0}
            aria-label={tooltip}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full mt-1.5 z-20 w-56 rounded-[10px] border px-3 py-2 text-[12px] font-normal normal-case tracking-normal leading-[1.5] opacity-0 translate-y-1 transition-opacity transition-transform duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus:opacity-100 group-focus:translate-y-0"
              style={{
                background: "var(--panel)",
                color: "var(--ink-2)",
                borderColor: "var(--line)",
                boxShadow: "0 8px 24px oklch(0.20 0.01 85 / 0.10)",
              }}
            >
              {tooltip}
            </span>
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2.5 flex-wrap">
        <span className="font-headline font-semibold text-[28px] leading-none tracking-[-0.01em] text-primary">
          {value}
        </span>
        {delta && <span className={`${deltaColor} text-[13px] font-medium`}>{delta}</span>}
      </div>
    </div>
  );
}
