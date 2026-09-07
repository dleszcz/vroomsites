"use client";

import React from "react";
import Script from "next/script";
import { DealerTenant } from "@/types/landing";

interface AnalyticsScriptsProps {
  tenant?: DealerTenant | null;
}

export function AnalyticsScripts({ tenant }: AnalyticsScriptsProps) {
  const gaMeasurementId =
    tenant?.analytics?.googleAnalyticsId ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    "";

  const gtmId =
    process.env.NEXT_PUBLIC_GTM_ID || "";

  return (
    <>
      {/* 1. Google Analytics (GA4) Script */}
      {gaMeasurementId && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}

      {/* 3. Google Tag Manager (GTM) Script */}
      {gtmId && (
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `,
          }}
        />
      )}
    </>
  );
}
