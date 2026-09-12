"use client";

import React from "react";
import { Clock3, MapPin, Phone } from "lucide-react";
import { DealerTenant } from "@/types/landing";

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.83V7.65a6.34 6.34 0 0 0-5.1 6.27 6.34 6.34 0 1 0 10.86-4.51v-4.1a8.27 8.27 0 0 0 4.35 1.38V6.69z"/>
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

import { APP_VERSION } from "@/lib/version";
import { getTenantUrl } from "@/lib/urls";

interface FooterProps {
  tenant?: DealerTenant | null;
  isCustomDomain?: boolean;
}

export function Footer({ tenant, isCustomDomain }: FooterProps) {
  const name = tenant?.businessName || "";
  const phone = tenant?.contact?.phone || "";
  const email = tenant?.contact?.email || "";
  const city = tenant?.location?.city || "";
  const address = tenant?.location?.address || "";
  const logo = tenant?.logoUrl || tenant?.branding?.logoUrl;

  const footerBg = tenant?.branding?.colors?.footerBg || "#080808";

  const getUrl = (path: string) =>
    getTenantUrl(tenant?.slug || "", path, tenant?.customDomain, isCustomDomain);

  // Active service areas for local SEO links
  const activeLocalPages =
    tenant?.localSeo?.localPages?.filter(
      (lp) => lp.enabled && lp.indexable && lp.showInFooter !== false
    ) || [];


  return (
    <footer id="footer" className="dealer-footer" style={{ background: footerBg }}>
      <div className="vd-container">
        <div className="dealer-footer__grid">
          <div>
            {logo ? (
              <img className="dealer-footer__logo" src={logo} alt={name} />
            ) : (
              <span style={{ fontWeight: 800, fontSize: "20px", color: "#fff", display: "block", marginBottom: "12px" }}>
                {name}
              </span>
            )}
            <p className="dealer-footer__description">Skup i sprzedaż samochodów. Szybko, uczciwie, bezpiecznie.</p>
            {(tenant?.contact?.facebook || tenant?.contact?.instagram || tenant?.contact?.tiktok || tenant?.contact?.youtube) && (
              <div className="dealer-footer__socials">
                {tenant.contact.facebook && (
                  <a href={tenant.contact.facebook} target="_blank" rel="noopener noreferrer" className="dealer-footer__social" aria-label="Facebook">
                    <FacebookIcon size={18} />
                  </a>
                )}
                {tenant.contact.instagram && (
                  <a href={tenant.contact.instagram} target="_blank" rel="noopener noreferrer" className="dealer-footer__social" aria-label="Instagram">
                    <InstagramIcon size={18} />
                  </a>
                )}
                {tenant.contact.tiktok && (
                  <a href={tenant.contact.tiktok} target="_blank" rel="noopener noreferrer" className="dealer-footer__social" aria-label="TikTok">
                    <TikTokIcon size={18} />
                  </a>
                )}
                {tenant.contact.youtube && (
                  <a href={tenant.contact.youtube} target="_blank" rel="noopener noreferrer" className="dealer-footer__social" aria-label="YouTube">
                    <YoutubeIcon size={18} />
                  </a>
                )}
              </div>
            )}
          </div>
          <div>
            <h3 className="dealer-footer__heading">Szybkie linki</h3>
            <div className="dealer-footer__links">
              <a href={getUrl("/")}>Strona główna</a>
              <a href={getUrl("/skup-aut")}>Skup aut</a>
              <a href={getUrl("/samochody")}>Samochody</a>
              <a href={getUrl("/#services")}>Usługi</a>
              <a href={getUrl("/#about")}>O nas</a>
              <a href={getUrl("/#footer")}>Kontakt</a>
              <a href={getUrl("/polityka-prywatnosci")}>Polityka prywatności</a>
              <a href={getUrl("/regulamin")}>Regulamin</a>
            </div>
          </div>
          {activeLocalPages.length > 0 ? (
            <div>
              <h3 className="dealer-footer__heading">Obsługiwane okolice</h3>
              <div className="dealer-footer__links">
                {activeLocalPages.map((lp) => (
                  <a key={lp.slug} href={getUrl(`/${lp.slug}`)}>
                    Skup aut {lp.city}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h3 className="dealer-footer__heading">Usługi</h3>
              <div className="dealer-footer__links">
                <a href={getUrl("/#lead-form")}>Skup aut</a>
                <a href={getUrl("/samochody")}>Sprzedaż aut</a>
                <a href={getUrl("/#services")}>Pomoc drogowa</a>
                <a href={getUrl("/#services")}>Transport aut</a>
                <a href={getUrl("/#services")}>Inne usługi</a>
              </div>
            </div>
          )}

          <div>
            <h3 className="dealer-footer__heading">Kontakt</h3>
            <div className="dealer-footer__links">
              {phone && <a className="dealer-footer__contact" href={`tel:${phone.replace(/\s/g, "")}`}><Phone size={12} /> {phone}</a>}
              {email && <a className="dealer-footer__contact" href={`mailto:${email}`}>✉ {email}</a>}
              {(address || city) && <span className="dealer-footer__contact"><MapPin size={12} /> {address}{address && city ? ", " : ""}{city}</span>}
              <span className="dealer-footer__contact"><Clock3 size={12} /> Pn–Pt: 8:00–20:00</span>
              <span className="dealer-footer__contact">Sob–Nd: 10:00–18:00</span>
            </div>
          </div>
        </div>

        <div className="dealer-footer__bottom">
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <span>© {new Date().getFullYear()} {name}</span>
            <a href={getUrl("/polityka-prywatnosci")} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "13px" }}>Polityka prywatności</a>
            <a href={getUrl("/regulamin")} style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "13px" }}>Regulamin</a>
          </div>

        </div>
      </div>
    </footer>
  );
}
