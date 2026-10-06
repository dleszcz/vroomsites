"use client";

import React, { useState, useEffect } from "react";

const CONSENT_KEY = "vd_cookie_consent";

type ConsentState = "pending" | "accepted" | "rejected";

export function useHasConsent(): boolean {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored === "accepted");
  }, []);

  useEffect(() => {
    const handler = () => {
      const stored = localStorage.getItem(CONSENT_KEY);
      setConsent(stored === "accepted");
    };
    window.addEventListener("storage", handler);
    window.addEventListener("vd_consent_change", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("vd_consent_change", handler);
    };
  }, []);

  return consent;
}

interface CookieConsentProps {
  primaryColor?: string;
  privacyPolicyUrl?: string;
}

export function CookieConsent({ primaryColor = "#1686E0", privacyPolicyUrl = "#" }: CookieConsentProps) {
  const [state, setState] = useState<ConsentState>("pending");

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setState("accepted");
    window.dispatchEvent(new Event("vd_consent_change"));
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, "rejected");
    setState("rejected");
    window.dispatchEvent(new Event("vd_consent_change"));
  };

  if (state !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Zgoda na pliki cookies"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        background: "rgba(10, 15, 29, 0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "20px 24px calc(20px + env(safe-area-inset-bottom, 0px))",
        boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          <p
            style={{
              margin: 0,
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Ta strona używa plików cookies oraz narzędzi analitycznych (w tym Meta Pixel)
            w celu poprawy jakości usług i personalizacji treści.{" "}
            <a
              href={privacyPolicyUrl}
              style={{ color: primaryColor, textDecoration: "underline", fontWeight: 600 }}
            >
              Polityka prywatności
            </a>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
          <button
            onClick={handleReject}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Odrzuć
          </button>
          <button
            onClick={handleAccept}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              background: primaryColor,
              border: "none",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 14px ${primaryColor}55`,
            }}
          >
            Akceptuję
          </button>
        </div>
      </div>
    </div>
  );
}
