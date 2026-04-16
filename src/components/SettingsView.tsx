"use client";

import { StateInfo } from "@/lib/types";
import rawData from "@/lib/data.json";
import AppShell from "./AppShell";
import { formatCurrency, CURRENT_YEAR } from "@/lib/data-utils";

const states = rawData.states as StateInfo[];
const stats = rawData.stats as {
  totalTransactions: number;
  totalSpend: number;
  uniqueAgencies: number;
  uniqueCompanies: number;
  stateCount: number;
};

export default function SettingsView() {
  return (
    <AppShell>
      <section className="px-4 md:px-8 py-6 md:py-8 max-w-[1440px] mx-auto">
        <div className="mb-6">
          <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">
            Configuration
          </span>
          <h3 className="text-2xl md:text-3xl font-headline font-extrabold text-primary tracking-tight">
            Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h4 className="text-base font-headline font-bold text-primary mb-4">Account</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary-container flex items-center justify-center text-white font-bold">
                  AW
                </div>
                <div>
                  <div className="font-bold text-primary text-sm">Alexander Wright</div>
                  <div className="text-xs text-on-surface-variant">Chief Procurement Officer</div>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-container">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Email
                </div>
                <div className="text-sm text-primary">alexander.wright@argus.demo</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Workspace
                </div>
                <div className="text-sm text-primary">Argus Demo Org</div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h4 className="text-base font-headline font-bold text-primary mb-4">Data Sources</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Total transactions
                  </div>
                  <div className="font-bold text-primary">
                    {stats.totalTransactions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Tracked spend
                  </div>
                  <div className="font-bold text-primary">{formatCurrency(stats.totalSpend)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Agencies
                  </div>
                  <div className="font-bold text-primary">
                    {stats.uniqueAgencies.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                States covered ({states.length})
              </div>
              <div className="space-y-1.5">
                {states.map((s) => (
                  <div key={s.code} className="flex items-center justify-between text-sm">
                    <span className="text-primary">
                      <span className="font-bold mr-2">{s.code}</span>
                      <span className="text-on-surface-variant">{s.name}</span>
                    </span>
                    <span className="text-on-surface-variant text-xs">
                      {s.transactionCount.toLocaleString()} txns
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm lg:col-span-2">
            <h4 className="text-base font-headline font-bold text-primary mb-4">Renewal Detection</h4>
            <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
              Argus classifies contracts as <span className="font-bold text-primary">expiring</span> when the
              last purchase was <span className="font-bold text-primary">3&ndash;5 years ago</span> and
              historical spend exceeds <span className="font-bold text-primary">$10,000</span>. This window
              catches typical 3- and 5-year government contract cycles as they approach renewal. The current
              year is hardcoded to <span className="font-bold text-primary">{CURRENT_YEAR}</span>.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-surface-container">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Active
                </div>
                <div className="text-sm text-primary">Last purchase ≤ 2 yrs ago</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Expiring
                </div>
                <div className="text-sm text-primary">3&ndash;5 yrs ago + significant spend</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                  Dormant
                </div>
                <div className="text-sm text-primary">&gt; 5 yrs ago or minimal spend</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
