/**
 * Returns a clean relative URL path for a tenant route.
 * On custom domain (e.g. custom tenant domain): returns clean path like "/", "/skup-aut", "/samochody", "/polityka-prywatnosci"
 * On platform domain (e.g. vroomdealer.pl, vroomdealer.vercel.app, localhost): returns "/[dealerSlug]", "/[dealerSlug]/skup-aut", "/[dealerSlug]/samochody"
 */
export function getTenantUrl(
  tenantSlug: string,
  path: string = "",
  customDomain?: string | null,
  isCustomDomainProp?: boolean
): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  let customDomainActive = isCustomDomainProp;

  // On client side: inspect window.location.hostname dynamically
  if (typeof window !== "undefined") {
    const host = window.location.hostname.toLowerCase().replace(/^www\./, "");
    const isPlatform =
      host === "vroomdealer.pl" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".vercel.app");

    customDomainActive = !isPlatform;
  }

  if (customDomainActive) {
    return cleanPath || "/";
  }

  if (cleanPath === "/") {
    return `/${tenantSlug}`;
  }

  return `/${tenantSlug}${cleanPath}`;
}
