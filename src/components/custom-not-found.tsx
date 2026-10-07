"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, ArrowLeft, Car, Phone } from "lucide-react";

interface CustomNotFoundProps {
  tenantSlug?: string;
  businessName?: string;
  phone?: string;
}

export function CustomNotFound({
  tenantSlug,
  businessName = "naszym serwisie",
  phone,
}: CustomNotFoundProps) {
  const pathname = usePathname() || "";
  const pathParts = pathname.split("/").filter(Boolean);
  
  // Try to extract tenantSlug from URL path if not explicitly provided
  // (ignores reserved system paths)
  const isPlatformDomainSubpath = pathParts.length > 0 && 
    !["admin", "api", "_next", "images"].includes(pathParts[0]);
    
  const effectiveTenantSlug = tenantSlug || (isPlatformDomainSubpath ? pathParts[0] : null);

  const isTenant = Boolean(effectiveTenantSlug);
  const homeHref = isTenant ? `/${effectiveTenantSlug}` : "/";
  const valuationHref = isTenant ? `/${effectiveTenantSlug}/skup-aut` : "/skup-aut";

  const primaryBtnLabel = isTenant
    ? "Wróć do strony głównej komisu"
    : "Wróć na stronę główną";

  const secondaryBtnLabel = isTenant
    ? "Bezpłatna wycena auta"
    : "Skontaktuj się z nami";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 30%, #0f172a 0%, #060810 100%)",
        color: "#ffffff",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          padding: "48px 32px",
          borderRadius: "28px",
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Glowing Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "999px",
            background: "rgba(22, 134, 224, 0.15)",
            border: "1px solid rgba(22, 134, 224, 0.4)",
            color: "#38bdf8",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          <AlertCircle size={18} />
          Błąd 404 - Strona nie istnieje
        </div>

        {/* Big 404 Display */}
        <h1
          style={{
            fontSize: "clamp(64px, 12vw, 96px)",
            fontWeight: 900,
            margin: "0 0 12px",
            lineHeight: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontSize: "clamp(22px, 4vw, 28px)",
            fontWeight: 800,
            color: "#ffffff",
            margin: "0 0 16px",
          }}
        >
          Przepraszamy, tej strony nie ma
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#94a3b8",
            lineHeight: 1.6,
            margin: "0 0 36px",
          }}
        >
          Adres, pod który próbujesz wejść w {businessName}, jest niepoprawny lub strona została przeniesiona pod inny adres.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            alignItems: "center",
          }}
        >
          <Link
            href={homeHref}
            style={{
              width: "100%",
              minHeight: "52px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              borderRadius: "14px",
              background: "#1686E0",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 25px rgba(22, 134, 224, 0.4)",
              transition: "transform 0.2s ease",
            }}
          >
            <ArrowLeft size={18} />
            {primaryBtnLabel}
          </Link>

          <Link
            href={valuationHref}
            style={{
              width: "100%",
              minHeight: "52px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              borderRadius: "14px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
          >
            <Car size={18} />
            {secondaryBtnLabel}
          </Link>

          {isTenant && phone && (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              style={{
                width: "100%",
                minHeight: "48px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                borderRadius: "14px",
                color: "#94a3b8",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              <Phone size={16} />
              Zadzwoń do nas: {phone}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
