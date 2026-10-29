import React from "react";
import { DealerBranding } from "@/types/landing";

interface BrandProviderProps {
  branding?: DealerBranding | null;
  children: React.ReactNode;
}

/** Determines if a hex color is light or dark based on perceived luminance (YIQ) */
function isLightColor(hexStr?: string | null): boolean {
  if (!hexStr) return false;
  const hex = hexStr.trim().replace(/^#+/, "");
  if (hex.length !== 3 && hex.length !== 6) return false;
  const fullHex = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return false;
  return (r * 299 + g * 587 + b * 114) / 1000 >= 140;
}

export function BrandProvider({ branding, children }: BrandProviderProps) {
  if (!branding || !branding.colors) {
    return <>{children}</>;
  }

  const { colors } = branding;
  const cleanHex = (val?: string | null) => {
    if (!val) return "";
    const trimmed = val.trim().replace(/^#+/, "#");
    return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  };

  const headerBg = colors.headerBg ? cleanHex(colors.headerBg) : "#09090b";
  const footerBg = colors.footerBg ? cleanHex(colors.footerBg) : "#09090b";

  const isHeaderLight = isLightColor(headerBg);
  const isFooterLight = isLightColor(footerBg);

  const headerFg = isHeaderLight ? "#09090b" : "#ffffff";
  const headerNav = isHeaderLight ? "#52525b" : "rgba(255, 255, 255, 0.92)";
  const headerBorder = isHeaderLight ? "#e4e4e7" : "rgba(255, 255, 255, 0.1)";

  const footerFg = isFooterLight ? "#09090b" : "#ffffff";
  const footerMuted = isFooterLight ? "#52525b" : "#94a3b8";
  const footerLinks = isFooterLight ? "#52525b" : "#cbd5e1";
  const footerBorder = isFooterLight ? "#e4e4e7" : "rgba(255, 255, 255, 0.08)";
  const footerSocialBg = isFooterLight ? "#ffffff" : "rgba(255, 255, 255, 0.08)";
  const footerSocialBorder = isFooterLight ? "#e4e4e7" : "rgba(255, 255, 255, 0.12)";

  const cssVariables = `
    :root {
      ${colors.primary ? `--color-primary: ${cleanHex(colors.primary)};` : ""}
      ${colors.primaryForeground ? `--color-primary-fg: ${cleanHex(colors.primaryForeground)};` : ""}
      ${colors.background ? `--color-background: ${cleanHex(colors.background)};` : ""}
      ${colors.foreground ? `--color-foreground: ${cleanHex(colors.foreground)};` : ""}
      ${colors.accent ? `--color-accent: ${cleanHex(colors.accent)};` : ""}
      ${colors.accentForeground ? `--color-accent-fg: ${cleanHex(colors.accentForeground)};` : ""}
      ${colors.surface ? `--color-surface: ${cleanHex(colors.surface)};` : ""}
      ${colors.muted ? `--color-muted: ${cleanHex(colors.muted)};` : ""}
      --color-header-bg: ${headerBg};
      --color-header-fg: ${headerFg};
      --color-header-nav: ${headerNav};
      --color-header-border: ${headerBorder};
      --color-footer-bg: ${footerBg};
      --color-footer-fg: ${footerFg};
      --color-footer-muted: ${footerMuted};
      --color-footer-links: ${footerLinks};
      --color-footer-border: ${footerBorder};
      --color-footer-social-bg: ${footerSocialBg};
      --color-footer-social-border: ${footerSocialBorder};
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  );
}

