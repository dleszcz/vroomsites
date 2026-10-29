"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface AutoplacFeedBannerProps {
  feedUrl: string;
}

export function AutoplacFeedBanner({ feedUrl }: AutoplacFeedBannerProps) {
  const [copiedFeed, setCopiedFeed] = useState(false);

  const handleCopyFeed = async () => {
    if (!feedUrl) return;
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopiedFeed(true);
      setTimeout(() => setCopiedFeed(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (!feedUrl) return null;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        background: "rgba(14, 165, 233, 0.08)",
        border: "1px solid rgba(14, 165, 233, 0.25)",
        borderRadius: "12px",
        padding: "14px 18px",
        marginBottom: "20px",
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "#38bdf8",
            marginBottom: "3px",
          }}
        >
          Oficjalny Feed XML do portalu Autoplac.pl
        </div>
        <div
          style={{
            fontSize: "12px",
            fontFamily: "monospace",
            color: "#94a3b8",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {feedUrl}
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopyFeed}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "#1e293b",
          border: "1px solid #334155",
          color: "#e2e8f0",
          fontSize: "12px",
          fontWeight: "600",
          borderRadius: "8px",
          padding: "6px 12px",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {copiedFeed ? (
          <>
            <Check style={{ width: "14px", height: "14px", color: "#10b981" }} />
            <span>Skopiowano</span>
          </>
        ) : (
          <>
            <Copy style={{ width: "14px", height: "14px" }} />
            <span>Kopiuj link do Autoplac</span>
          </>
        )}
      </button>
    </div>
  );
}
