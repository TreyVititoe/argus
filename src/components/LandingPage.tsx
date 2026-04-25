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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

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
            <a href="#product" onClick={(e) => smoothScroll(e, "product")}>Product</a>
            <a href="#coverage" onClick={(e) => smoothScroll(e, "coverage")}>Coverage</a>
            <a href="#how" onClick={(e) => smoothScroll(e, "how")}>How it works</a>
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
                <span className={styles.pvBrandMark} /> Argus
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
