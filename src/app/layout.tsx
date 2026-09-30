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
    default: "VroomDealer - Platforma sprzedażowa dla komisów samochodowych",
    template: "%s",
  },
  description:
    "VroomDealer.pl - ultra-szybkie strony sprzedażowe dla komisów samochodowych. Zwiększ sprzedaż dzięki profesjonalnym ogłoszeniom z retargetingiem i integracją WhatsApp.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "VroomDealer",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    generator: getFullVersion(),
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={GeistSans.variable}>
      <body>
        <Toaster position="bottom-center" />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
