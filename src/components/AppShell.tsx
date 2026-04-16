"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopAppBar from "./TopAppBar";

interface AppShellProps {
  children: ReactNode;
  search?: string;
  onSearchChange?: (v: string) => void;
}

export default function AppShell({ children, search = "", onSearchChange }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:ml-64 min-h-screen pb-12">
        <TopAppBar
          search={search}
          onSearchChange={onSearchChange || (() => {})}
          onMenuClick={() => setSidebarOpen(true)}
        />
        {children}
      </main>
    </>
  );
}
