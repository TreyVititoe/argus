import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Argus — Procurement intelligence for the public sector";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "radial-gradient(60% 50% at 18% 0%, rgb(214 232 220) 0%, transparent 70%), radial-gradient(50% 40% at 90% 18%, rgb(231 222 201) 0%, transparent 75%), rgb(252 250 245)",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "rgb(50 50 48)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: "#4A7A67",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#F2EBDD",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  width: 2.5,
                  height: 8,
                  borderRadius: 1.25,
                  background: "#4A7A67",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 6,
                  width: 2.5,
                  height: 8,
                  borderRadius: 1.25,
                  background: "#4A7A67",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: "#4A7A67",
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>Argus</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#4A7A67",
              marginBottom: 18,
            }}
          >
            Procurement intelligence for the public sector
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: -2,
              maxWidth: 980,
            }}
          >
            Stop looking at spreadsheets,{" "}
            <span style={{ fontStyle: "italic", color: "#4A7A67" }}>it&apos;s 2026</span>.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgb(115 115 110)",
          }}
        >
          <div>argus.bz</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div>9 states</div>
            <div>33,912 transactions</div>
            <div>8 yrs of history</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
