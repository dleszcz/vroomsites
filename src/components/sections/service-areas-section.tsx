"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { DealerTenant, SectionConfig, hasCarBuying } from "@/types/landing";
import { getTenantUrl } from "@/lib/urls";

interface Props {
  tenant: DealerTenant;
  config?: SectionConfig;
  isCustomDomain?: boolean;
}

export function ServiceAreasSection({ tenant, config, isCustomDomain }: Props) {
  const isCarBuyingEnabled = hasCarBuying(tenant);
  const primaryCity = tenant.localSeo?.primaryLocation?.city || tenant.location?.city || "";
  const locality = tenant.localSeo?.primaryLocation?.locality;
  const county = tenant.localSeo?.primaryLocation?.county || tenant.location?.county;

  const defaultSalesTitle = primaryCity
    ? `Komis samochodowy i sprzedaż aut — ${primaryCity} i okolice`
    : "Obsługiwane okolice i obszar działania";
  const defaultBuyingTitle = primaryCity
    ? `Skup aut w ${primaryCity} i okolicach`
    : "Obsługiwane okolice i obszar działania";

  const defaultSalesSubtitle = `${tenant.businessName} oferuje sprawdzone samochody używane z pewną historią, gwarancją i kompletem dokumentów dla mieszkańców ${
    locality ? `${locality}, ` : ""
  }${primaryCity}${county ? ` (powiat ${county})` : ""} oraz okolicznych miejscowości.`;

  const defaultBuyingSubtitle = `${tenant.businessName} oferuje darmowy dojazd, wycenę na miejscu oraz natychmiastową płatność gotówką w ${
    locality ? `${locality}, ` : ""
  }${primaryCity}${county ? ` (powiat ${county})` : ""} i sąsiednich miejscowościach.`;

  const title = config?.title || (isCarBuyingEnabled ? defaultBuyingTitle : defaultSalesTitle);
  const subtitle = config?.subtitle || (isCarBuyingEnabled ? defaultBuyingSubtitle : defaultSalesSubtitle);

  // Get active, indexable local pages that allow local area links
  const activeLocalPages =
    tenant.localSeo?.localPages?.filter(
      (lp) => lp.enabled && lp.indexable && lp.showInLocalAreaLinks !== false
    ) || [];

  if (activeLocalPages.length === 0) {
    return null;
  }

  return (
    <section id="service-areas" className="vd-section vd-section--bordered vd-section--soft">
      <div className="vd-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="vd-eyebrow">Obszar działania</span>
          <h2 className="vd-heading mb-3">{title}</h2>
          <p className="vd-copy">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {activeLocalPages.map((lp) => {
            const isSalesPage = lp.mode === "sales" || !isCarBuyingEnabled;
            const label = isSalesPage ? `Samochody używane ${lp.city}` : `Skup aut ${lp.city}`;

            return (
              <Link
                key={lp.slug}
                href={getTenantUrl(tenant.slug, `/${lp.slug}`, tenant.customDomain, isCustomDomain)}
                className="group flex items-center justify-between p-4 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors shrink-0 ml-2" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
