"use client";

interface TopAppBarProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export default function TopAppBar({ search, onSearchChange }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#f8f9ff]/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-6 py-3 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-6">
          <h2 className="font-headline font-black text-[#041627] text-lg tracking-tight">
            Argus
          </h2>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              style={{ fontSize: "18px" }}
            >
              search
            </span>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-surface-container-low rounded-xl py-2 pl-10 pr-4 text-sm w-64 border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="Global search..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#eff4ff] transition-colors">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "22px" }}>
              notifications
            </span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#eff4ff] transition-colors">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "22px" }}>
              tune
            </span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-surface-container">
            <div className="text-right hidden xl:block">
              <p className="text-xs font-bold text-primary leading-none">Alexander Wright</p>
              <p className="text-[10px] text-on-surface-variant">Chief Procurement Officer</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary-container ring-2 ring-surface-container-high flex items-center justify-center text-white font-bold text-sm">
              AW
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#eff4ff] h-[1px] w-full" />
    </header>
  );
}
