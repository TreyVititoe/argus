"use client";

import styles from "./shell.module.css";
import { useSession } from "./SessionProvider";

interface TopAppBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  onMenuClick: () => void;
}

export default function TopAppBar({ search, onSearchChange, onMenuClick }: TopAppBarProps) {
  const user = useSession();
  const initials = user?.initials || "U";
  const label = user?.name || user?.email || "Signed in";
  return (
    <div className={styles.topbar}>
      <button
        type="button"
        onClick={onMenuClick}
        className={styles.menuBtn}
        aria-label="Open menu"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className={styles.search}>
        <svg
          className={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          className={styles.searchInput}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search agencies, vendors, contracts…"
        />
      </div>

      <div className={styles.avatar} title={label}>{initials}</div>
    </div>
  );
}
