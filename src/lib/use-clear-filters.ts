"use client";

import { useEffect, useRef } from "react";

// Site-wide "Clear filters" mechanism. The Sidebar button dispatches the event
// and any filter-aware view subscribes via useClearFilters() to reset its state.
export const CLEAR_FILTERS_EVENT = "argus:clear-filters";

export function dispatchClearFilters() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CLEAR_FILTERS_EVENT));
  }
}

export function useClearFilters(reset: () => void) {
  const ref = useRef(reset);
  useEffect(() => {
    ref.current = reset;
  });
  useEffect(() => {
    const handler = () => ref.current();
    window.addEventListener(CLEAR_FILTERS_EVENT, handler);
    return () => window.removeEventListener(CLEAR_FILTERS_EVENT, handler);
  }, []);
}
