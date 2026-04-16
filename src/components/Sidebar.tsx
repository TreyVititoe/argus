"use client";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Discovery", icon: "explore", active: false },
  { label: "Companies", icon: "business", active: false },
  { label: "Analytics", icon: "monitoring", active: false },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen flex flex-col py-8 z-50 bg-[#041627] w-64 shadow-2xl">
      <div className="px-6 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
            <span
              className="material-symbols-outlined text-white text-sm"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "18px" }}
            >
              dashboard
            </span>
          </div>
          <div>
            <h1 className="font-headline text-white font-extrabold tracking-widest uppercase text-xs">
              Argus
            </h1>
            <p className="text-[10px] text-on-primary-container uppercase tracking-tighter">
              Intelligence Suite
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            className={`${
              item.active
                ? "nav-active text-white rounded-r-full"
                : "text-slate-400 hover:text-white hover:bg-[#1a2b3c]"
            } py-3 px-6 my-1 flex items-center gap-3 font-body text-sm font-medium transition-all duration-300`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              {item.icon}
            </span>
            {item.label}
          </a>
        ))}

        <div className="mt-8 px-2">
          <button className="w-full bg-gradient-to-br from-secondary to-primary-container text-white py-3 px-4 rounded-xl text-sm font-bold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              add_circle
            </span>
            New Analysis
          </button>
        </div>
      </nav>

      <div className="px-4 mt-auto">
        <div className="bg-[#1a2b3c] h-[1px] w-full mb-4" />
        <a
          href="#"
          className="text-slate-400 hover:text-white py-3 px-6 my-1 flex items-center gap-3 font-body text-sm font-medium transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            settings
          </span>
          Settings
        </a>
        <a
          href="#"
          className="text-slate-400 hover:text-white py-3 px-6 my-1 flex items-center gap-3 font-body text-sm font-medium transition-all"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            help_outline
          </span>
          Help
        </a>
      </div>
    </aside>
  );
}
