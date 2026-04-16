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
      ? "text-on-tertiary-container"
      : deltaType === "negative"
      ? "text-on-error-container"
      : "text-on-surface-variant";

  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm hover:bg-surface-container-high hover:-translate-y-0.5 transition-all duration-200">
      <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-xl font-headline font-bold text-primary truncate">{value}</p>
        {delta && <span className={`${deltaColor} text-[10px] font-bold shrink-0`}>{delta}</span>}
      </div>
    </div>
  );
}
