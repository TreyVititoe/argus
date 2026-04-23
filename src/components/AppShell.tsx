"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";
import styles from "./shell.module.css";

interface AppShellProps {
  children: ReactNode;
  search?: string;
  onSearchChange?: (v: string) => void;
}

export default function AppShell({ children, search = "", onSearchChange }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.app}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className={styles.main}>
        <TopAppBar
          search={search}
          onSearchChange={onSearchChange || (() => {})}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {children}
      </main>
    </div>
  );
}
