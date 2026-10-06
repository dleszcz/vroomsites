import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

import { getFullVersion } from "@/lib/version";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://vroomdealer.pl"
  ),
  title: {
    default: "VroomSites - Platforma SaaS dla komisów",
    template: "%s",
  },
  description:
    "VroomSites - ultra-szybkie strony dla komisów samochodowych.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "VroomSites",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    generator: getFullVersion(),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={GeistSans.variable}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
