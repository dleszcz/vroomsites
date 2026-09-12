"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll immediately to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Fallback for async content/hydration layout shifts
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
