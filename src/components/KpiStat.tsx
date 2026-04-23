"use client";

interface KpiStatProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
}

export default function KpiStat({ label, value, delta, deltaType = "positive" }: KpiStatProps) {
  const deltaColor =
    deltaType === "positive"
      ? "text-[oklch(0.55_0.14_150)]"
      : deltaType === "negative"
      ? "text-on-error-container"
      : "text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-5 min-h-[118px] flex flex-col gap-2.5 transition-colors hover:border-[oklch(0.88_0.007_85)]">
      <p className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-[0.12em] leading-tight">
        {label}
      </p>
      <div className="flex items-baseline gap-2.5 flex-wrap">
        <span className="font-headline font-normal text-[32px] leading-none tracking-tight text-primary">
          {value}
        </span>
        {delta && <span className={`${deltaColor} text-[13px] font-medium`}>{delta}</span>}
      </div>
    </div>
  );
}
