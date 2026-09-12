import React from "react";
import { DealerBranding } from "@/types/landing";

interface BrandProviderProps {
  branding?: DealerBranding | null;
  children: React.ReactNode;
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
      ${colors.headerBg ? `--color-header-bg: ${cleanHex(colors.headerBg)};` : ""}
      ${colors.footerBg ? `--color-footer-bg: ${cleanHex(colors.footerBg)};` : ""}
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
      {children}
    </>
  );
}
