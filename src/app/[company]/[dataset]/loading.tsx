export default function Loading() {
  return (
    <div className="px-10 py-6" aria-label="Loading dashboard">
      <div className="grid grid-cols-12 gap-4 items-end mb-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <SkelLine width="120px" height="14px" />
          <SkelLine width="60%" height="56px" />
          <div className="flex gap-3">
            <SkelChip />
            <SkelChip />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-1">
          <div className="flex justify-end">
            <SkelLine width="180px" height="44px" />
          </div>
          <SkelCard height="180px" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-5">
        <SkelKpi /> <SkelKpi /> <SkelKpi /> <SkelKpi /> <SkelKpi />
      </div>

      <div className="grid grid-cols-12 gap-4 mb-5">
        <div className="col-span-12 lg:col-span-6"><SkelCard height="280px" /></div>
        <div className="col-span-12 lg:col-span-6"><SkelCard height="280px" /></div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12"><SkelCard height="320px" /></div>
      </div>
    </div>
  );
}

function SkelLine({ width, height }: { width: string; height: string }) {
  return (
    <div
      className="rounded-md skeleton-pulse"
      style={{ width, height, background: "var(--line)" }}
    />
  );
}

function SkelChip() {
  return (
    <div
      className="rounded-full skeleton-pulse"
      style={{ width: "140px", height: "34px", background: "var(--line)" }}
    />
  );
}

function SkelCard({ height }: { height: string }) {
  return (
    <div
      className="rounded-[14px] border skeleton-pulse"
      style={{ height, background: "var(--panel)", borderColor: "var(--line)" }}
    />
  );
}

function SkelKpi() {
  return (
    <div
      className="rounded-[14px] border p-5 flex flex-col gap-3"
      style={{ background: "var(--panel)", borderColor: "var(--line)" }}
    >
      <SkelLine width="80%" height="12px" />
      <SkelLine width="60%" height="28px" />
      <SkelLine width="40%" height="12px" />
    </div>
  );
}
