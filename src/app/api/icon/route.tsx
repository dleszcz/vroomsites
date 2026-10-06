import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { resolveTenant } from "@/lib/tenant";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantSlug = searchParams.get("tenant") || searchParams.get("slug");
  const isDev = process.env.NODE_ENV === 'development';

  if (!tenantSlug) {
    // Default green VroomDealer platform icon
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(16, 185, 129, 0.4)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: "800",
              color: "#ffffff",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1,
            }}
          >
            V
          </span>
          {isDev && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '8px',
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6px',
              fontWeight: 800,
              color: 'white',
            }}>
              DEV
            </div>
          )}
        </div>
      ),
      { width: 32, height: 32 }
    );
  }

  const tenant = await resolveTenant({ slug: tenantSlug });
  const primaryColor = tenant?.branding?.colors?.primary || "#1686E0";
  
  const letter = (
    tenant?.businessName
      ? tenant.businessName.charAt(0)
      : tenantSlug.charAt(0)
  ).toUpperCase();


  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: primaryColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: "900",
            color: "#ffffff",
            fontFamily: "system-ui, sans-serif",
            lineHeight: 1,
            textShadow: "0 2px 5px rgba(0,0,0,0.4)",
          }}
        >
          {letter}
        </span>
        {isDev && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '6px',
            fontWeight: 800,
            color: 'white',
          }}>
            DEV
          </div>
        )}
      </div>
    ),
    { width: 32, height: 32 }
  );
}
