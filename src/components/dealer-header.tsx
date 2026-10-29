"use client";

import React, { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DealerTenant, hasCarBuying } from "@/types/landing";
import { getTenantUrl } from "@/lib/urls";

interface DealerHeaderProps {
  tenant: DealerTenant;
  isCustomDomain?: boolean;
}

export function DealerHeader({ tenant, isCustomDomain }: DealerHeaderProps) {
  const [open, setOpen] = useState(false);
  const phone = tenant.contact.phone || "";
  const logo = tenant.logoUrl || tenant.branding.logoUrl;
  const isLocalOrKnownRemote =
    logo?.startsWith("/") ||
    logo?.includes("supabase.co") ||
    logo?.includes("unsplash.com") ||
    logo?.includes("olxcdn.com") ||
    logo?.includes("wikimedia.org");
  const primaryHref = tenant.contact.whatsapp
    ? `https://wa.me/${tenant.contact.whatsapp.replace(/\D/g, "")}`
    : phone
    ? `tel:${phone.replace(/\s/g, "")}`
    : "#hero";

  const getUrl = (path: string) =>
    getTenantUrl(tenant.slug, path, tenant.customDomain, isCustomDomain);

  const carBuying = hasCarBuying(tenant);
  const ctaLabel = carBuying ? "Sprzedaj auto" : "Zobacz auta";
  const ctaHref = carBuying ? primaryHref : getUrl("/samochody");

  const links = [
    ["Strona główna", getUrl("/")],
    ...(carBuying ? [["Skup aut", getUrl("/skup-aut")]] : []),
    ["Samochody", getUrl("/samochody")],
    ["Usługi", getUrl("/uslugi")],
    ["O nas", getUrl("/o-nas")],
    ["Kontakt", getUrl("/kontakt")],
  ];

  const headerBg = tenant.branding?.colors?.headerBg || "#09090b";

  return (
    <header className="dealer-header" style={{ background: headerBg }}>
      <div className="dealer-header__inner">
        <a href={getUrl("/")} aria-label={tenant.businessName} className="dealer-header__brand">
          {logo ? (
            <Image
              className="dealer-header__logo"
              src={logo}
              alt={tenant.businessName}
              width={180}
              height={62}
              priority
              unoptimized={!isLocalOrKnownRemote}
            />
          ) : (
            <span style={{ fontWeight: 800, fontSize: "18px", color: "var(--color-header-fg, #ffffff)" }}>
              {tenant.businessName}
            </span>
          )}
        </a>

        <nav className="dealer-header__nav" aria-label="Główna nawigacja">
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="dealer-header__actions">
          <a
            style={{ color: "#ffffff" }}
            className="h-9 px-4 rounded-md bg-[var(--color-primary,#1686E0)] hover:brightness-105 font-heading font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center transition-all shadow-xs"
            href={ctaHref}
          >
            {ctaLabel}
          </a>
          {phone && (
            <a className="dealer-header__phone" href={`tel:${phone.replace(/\s/g, "")}`}>
              <Phone size={15} strokeWidth={2.1} />
              <span>{phone}</span>
            </a>
          )}
          <button
            className="dealer-header__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="dealer-header__mobile-menu">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="font-heading">
              {label}
            </Link>
          ))}
          <a
            style={{ color: "#ffffff" }}
            className="h-10 px-4 rounded-md bg-[var(--color-primary,#1686E0)] hover:brightness-105 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all"
            href={ctaHref}
            onClick={() => setOpen(false)}
          >
            {ctaLabel}
          </a>
        </div>
      )}
    </header>
  );
}
