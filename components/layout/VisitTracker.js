"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function VisitTracker() {
  useEffect(() => {
    if (window.location.pathname === "/inventory" || window.location.pathname.startsWith("/inventory/")) return;
    fetch(`${API_URL}/api/track-visit`, { method: "POST", keepalive: true })
      .catch(() => {
        // Visitor tracking is best effort and must not affect the application.
      });
  }, []);

  return null;
}
