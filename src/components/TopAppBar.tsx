"use client";

interface TopAppBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  onMenuClick: () => void;
}

export default function TopAppBar({ search, onSearchChange, onMenuClick }: TopAppBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#f8f9ff]/80 backdrop-blur-md shadow-sm">
      <div className="flex justify-between items-center w-full px-4 md:px-6 py-3 max-w-[1440px] mx-auto gap-3">
        <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-1">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-full hover:bg-[#eff4ff] shrink-0"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "22px" }}>
              menu
            </span>
          </button>

          <h2 className="font-headline font-black text-[#041627] text-lg tracking-tight shrink-0">
            Argus
          </h2>

          <div className="relative hidden sm:block min-w-0 flex-1 max-w-xs">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              style={{ fontSize: "18px" }}
            >
              search
            </span>
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-surface-container-low rounded-xl py-2 pl-10 pr-4 text-sm w-full border-none outline-none focus:ring-2 focus:ring-secondary/20 transition-all"
              placeholder="Global search..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button className="sm:hidden p-2 rounded-full hover:bg-[#eff4ff] transition-colors" aria-label="Search">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "22px" }}>
              search
            </span>
          </button>
          <button className="p-2 rounded-full hover:bg-[#eff4ff] transition-colors" aria-label="Notifications">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "22px" }}>
              notifications
            </span>
          </button>
          <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-[#eff4ff] transition-colors" aria-label="Settings">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: "22px" }}>
              tune
            </span>
          </button>
          <div className="flex items-center gap-3 sm:pl-4 sm:border-l border-surface-container">
            <div className="text-right hidden xl:block">
              <p className="text-xs font-bold text-primary leading-none">Alexander Wright</p>
              <p className="text-[10px] text-on-surface-variant">Chief Procurement Officer</p>
            </div>
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-secondary to-primary-container ring-2 ring-surface-container-high flex items-center justify-center text-white font-bold text-sm">
              AW
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#eff4ff] h-[1px] w-full" />
    </header>
  );
}
