"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import styles from "./LandingPage.module.css";

function BrandMarkSVG() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#faf8f3" />
      <rect x="46" y="20" width="8" height="60" rx="4" fill="#4A7A67" />
      <circle cx="50" cy="50" r="18" fill="#4A7A67" />
      <circle cx="50" cy="50" r="6" fill="#faf8f3" />
    </svg>
  );
}

type TopoPath = { d: string; thick: boolean };

// Topographic background — concentric organic loops around several "centers",
// with multi-frequency sinusoidal radius perturbation per ring for a
// hand-drawn / map-engraving feel. Ported from Landing Page v2.html.
function generateTopo(): TopoPath[] {
  type Center = {
    cx: number;
    cy: number;
    baseR: number;
    rings: number;
    freq: number[];
    phase: number[];
    wobble: number;
    ringStep: number;
  };

  const centers: Center[] = [
    { cx: 280,  cy: 760, baseR: 60, rings: 11, freq: [3, 5, 7],  phase: [0.3, 1.1, 2.4], wobble: 18, ringStep: 32 },
    { cx: 1380, cy: 240, baseR: 50, rings: 13, freq: [4, 6, 8],  phase: [1.7, 0.4, 2.0], wobble: 22, ringStep: 36 },
    { cx: 1480, cy: 880, baseR: 40, rings: 9,  freq: [3, 5, 9],  phase: [0.8, 2.6, 1.2], wobble: 14, ringStep: 30 },
    { cx: 180,  cy: 120, baseR: 45, rings: 8,  freq: [4, 7, 11], phase: [2.1, 0.5, 1.8], wobble: 16, ringStep: 28 },
    { cx: 820,  cy: 480, baseR: 30, rings: 14, freq: [5, 8, 12], phase: [1.0, 2.0, 0.6], wobble: 12, ringStep: 26 },
  ];

  function ringPath(
    cx: number,
    cy: number,
    r: number,
    freq: number[],
    phase: number[],
    wobble: number
  ): string {
    const N = 220;
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2;
      let dr = 0;
      for (let k = 0; k < freq.length; k++) {
        dr += Math.sin(a * freq[k] + phase[k]) * (wobble / (k + 1));
      }
      const stretchX = 1 + Math.sin(phase[0]) * 0.18;
      const stretchY = 1 + Math.cos(phase[1]) * 0.12;
      const rEff = r + dr;
      const x = cx + Math.cos(a) * rEff * stretchX;
      const y = cy + Math.sin(a) * rEff * stretchY;
      pts.push([x, y]);
    }
    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const cx1 = (p0[0] + p1[0]) / 2;
      const cy1 = (p0[1] + p1[1]) / 2;
      d += ` Q ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${cx1.toFixed(1)} ${cy1.toFixed(1)}`;
    }
    d += " Z";
    return d;
  }

  const out: TopoPath[] = [];
  for (const c of centers) {
    for (let i = 0; i < c.rings; i++) {
      const r = c.baseR + i * c.ringStep;
      const phase = c.phase.map((p, k) => p + i * 0.18 * (k + 1));
      const wobble = c.wobble * (0.7 + i * 0.06);
      const d = ringPath(c.cx, c.cy, r, c.freq, phase, wobble);
      out.push({ d, thick: i % 5 === 0 && i > 0 });
    }
  }
  return out;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [topoPaths, setTopoPaths] = useState<TopoPath[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setTopoPaths(generateTopo());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function smoothScroll(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    const el = document.getElementById(targetId);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 72,
      behavior: "smooth",
    });
  }

  function onCtaSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <div className={styles.topoBg} aria-hidden="true">
        <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
          {topoPaths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              className={p.thick ? styles.topoPathThick : styles.topoPath}
            />
          ))}
        </svg>
      </div>

      {/* NAV */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden="true">
              <BrandMarkSVG />
            </span>
            Argus
          </Link>
          <div className={styles.navLinks}>
            <Link href="/why-argus">Why Argus</Link>
            <Link href="/for-sales-leaders">For sales leaders</Link>
            <Link href="/for-reps">For reps</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          <div className={styles.navRight}>
            <Link className={`${styles.btn} ${styles.btnAccent}`} href="/login">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroEyebrow}>
          <span className={styles.dot}>✦</span>
          Procurement intelligence for the public sector
        </div>
        <h1 className={styles.heroTitle}>
          Stop looking at spreadsheets,
          <br />
          it&apos;s <em>2026</em>.
        </h1>
        <p className={styles.heroSub}>
          Argus turns a decade of public procurement records into a live map of who&apos;s buying
          what, from whom, and when it&apos;s up for renewal — so your team can show up early,
          with the right pitch.
        </p>
        <div className={styles.heroCta}>
          <Link className={`${styles.btn} ${styles.btnAccent}`} href="/login">
            Sign In →
          </Link>
          <a
            className={`${styles.btn} ${styles.btnLine}`}
            href="#product"
            onClick={(e) => smoothScroll(e, "product")}
          >
            See the product
          </a>
          <span className={styles.heroNote}>No credit card · 15-minute walkthrough</span>
        </div>
      </section>

      {/* PRODUCT PREVIEW */}
      <section className={styles.preview} id="product">
        <div className={styles.previewFrame}>
          <div className={styles.previewChrome}>
            <div className={styles.dots}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.previewUrl}>argus.bz</div>
          </div>
          <div className={styles.previewBody}>
            <aside className={styles.pvSide}>
              <div className={styles.pvBrand}>
                <span className={styles.pvBrandMark} aria-hidden="true">
                  <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <rect width="128" height="128" rx="28" ry="28" fill="#4A7A67" />
                    <rect x="30" y="30" width="68" height="68" rx="14" ry="14" fill="#F2EBDD" />
                    <rect x="62" y="42" width="4" height="14" rx="2" fill="#4A7A67" />
                    <rect x="62" y="72" width="4" height="14" rx="2" fill="#4A7A67" />
                    <circle cx="64" cy="64" r="6" fill="#4A7A67" />
                  </svg>
                </span>
                Argus
              </div>
              <a className={styles.on}>Dashboard</a>
              <a>Discovery</a>
              <a>Companies</a>
              <a>Analytics</a>
            </aside>
            <div className={styles.pvMain}>
              <div className={styles.pvEyebrow}>Market Overview</div>
              <div className={styles.pvH1}>Executive dashboard</div>
              <div className={styles.pvPills}>
                <span className={`${styles.pvPill} ${styles.on}`}>
                  All states<span className={styles.n}>33,912</span>
                </span>
                <span className={styles.pvPill}>
                  FL<span className={styles.n}>14,086</span>
                </span>
                <span className={styles.pvPill}>
                  GA<span className={styles.n}>6,209</span>
                </span>
                <span className={styles.pvPill}>
                  NC<span className={styles.n}>5,620</span>
                </span>
                <span className={styles.pvPill}>
                  VA<span className={styles.n}>3,190</span>
                </span>
              </div>
              <div className={styles.pvGrid}>
                <div className={styles.pvKpi}>
                  <div className={styles.lbl}>Total contract value</div>
                  <div className={styles.val}>
                    $2.1B<span className={`${styles.delta} ${styles.pos}`}>+11%</span>
                  </div>
                </div>
                <div className={styles.pvKpi}>
                  <div className={styles.lbl}>Expiring contracts</div>
                  <div className={styles.val}>
                    451<span className={styles.delta}>$231M</span>
                  </div>
                </div>
                <div className={styles.pvKpi}>
                  <div className={styles.lbl}>Win rate</div>
                  <div className={styles.val}>59.9%</div>
                </div>
              </div>
              <div className={styles.pvChart}>
                <div className={styles.t}>Procurement spending trends</div>
                <svg viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="landingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A7A67" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4A7A67" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 55 C 40 30 70 10 110 35 S 180 70 220 40 S 280 20 300 60 L 300 80 L 0 80 Z"
                    fill="url(#landingGrad)"
                  />
                  <path
                    d="M 0 55 C 40 30 70 10 110 35 S 180 70 220 40 S 280 20 300 60"
                    fill="none"
                    stroke="#4A7A67"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats} id="coverage">
        <div className={styles.statsInner}>
          <div>
            <div className={styles.statN}>$47B</div>
            <div className={styles.statL}>in contracts tracked across nine states</div>
          </div>
          <div>
            <div className={styles.statN}>1,704</div>
            <div className={styles.statL}>agencies indexed with live renewal data</div>
          </div>
          <div>
            <div className={styles.statN}>33,912</div>
            <div className={styles.statL}>transactions, updated daily from public filings</div>
          </div>
          <div>
            <div className={styles.statN}>8 yrs</div>
            <div className={styles.statL}>of historical spend to benchmark against</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>What Argus does</span>
          <h2>The parts of the procurement market that used to be invisible.</h2>
          <p>
            Public contracts leave a paper trail — it just lives in a thousand different portals.
            Argus stitches it together, keeps it current, and surfaces the signals that matter.
          </p>
        </div>
        <div className={styles.featGrid}>
          <div className={styles.feat}>
            <div className={styles.featIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h3>Discovery that reads between the line items.</h3>
            <p>
              Search across every agency, vendor, and contract line. Filter by product keyword,
              award date, renewal window, or dollar threshold.
            </p>
          </div>
          <div className={styles.feat}>
            <div className={styles.featIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <h3>Renewal radar, tuned to your pipeline.</h3>
            <p>
              Get notified the moment a contract enters its renewal window — months before the RFP
              hits a public portal. Route alerts to the right rep automatically.
            </p>
          </div>
          <div className={styles.feat}>
            <div className={styles.featIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            </div>
            <h3>Competitor footprints, mapped by county.</h3>
            <p>
              Who&apos;s winning where, and how much are they charging? See market share by product
              category, state, and agency tier — updated every week.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={styles.how} id="how">
        <div className={styles.sectionHead}>
          <span className={styles.eyebrow}>How it works</span>
          <h2>Three steps from raw filings to a ranked list of next week&apos;s meetings.</h2>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>01</div>
            <h3>We ingest the public record.</h3>
            <p>
              Agency by agency, portal by portal. Every new filing is normalized, deduplicated, and
              linked to the right vendor and contract line within hours.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>02</div>
            <h3>You tell us your ICP.</h3>
            <p>
              Which agencies, which product categories, which renewal windows matter. Argus learns
              your definition of a qualified opportunity.
            </p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>03</div>
            <h3>Your reps get a weekly target list.</h3>
            <p>
              Ranked by fit, fed into Salesforce or HubSpot, with the historical spend and
              decision-maker attached. No spreadsheets to maintain.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaBlock} id="demo">
        <div className={styles.ctaCard}>
          <div>
            <h2>See what Argus has on your territory.</h2>
            <p>
              A 15-minute walkthrough with our team, built around the states, agencies, and product
              categories you care about.
            </p>
          </div>
          <form className={styles.ctaForm} onSubmit={onCtaSubmit}>
            <input type="email" placeholder="Work email" required disabled={submitted} />
            <div className={styles.ctaRow}>
              <input type="text" placeholder="Company" disabled={submitted} />
              <button
                ref={btnRef}
                className={`${styles.btn} ${styles.btnAccent}`}
                type="submit"
                disabled={submitted}
              >
                {submitted ? "Request received ✓" : "Request demo →"}
              </button>
            </div>
            <div className={styles.fine}>We&apos;ll reply within one business day. No drip campaigns.</div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footInner}>
          <div className={styles.brand} style={{ fontSize: 14 }}>
            <span
              className={styles.brandMark}
              aria-hidden="true"
              style={{ width: 22, height: 22, borderRadius: 6 }}
            >
              <BrandMarkSVG />
            </span>
            Argus
          </div>
          <div className={styles.footLinks}>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/security">Security</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:me@treyvititoe.com">Contact</a>
          </div>
          <div>© {new Date().getFullYear()} Argus Intelligence</div>
        </div>
      </footer>
    </div>
  );
}
