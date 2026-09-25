"use client";

import { Analytics } from "@vercel/analytics/next";

export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const path = new URL(event.url, "https://local.invalid").pathname;
        return path.startsWith("/admin") || path.startsWith("/dashboard") ? null : event;
      }}
    />
  );
}
