import { ImageResponse } from "next/og";

export const alt =
  "CJ Turrentine for Vance County Commissioner District 3 — A public servant. A proven record.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFFDF7",
          color: "#0E1B2A",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px",
            width: "61%",
          }}
        >
          <div
            style={{
              color: "#145DA0",
              display: "flex",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            On the ballot November 3, 2026
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 900,
              letterSpacing: -4,
              lineHeight: 0.98,
            }}
          >
            <span>A public servant.</span>
            <span>A proven record.</span>
          </div>
          <div
            style={{
              borderTop: "2px solid #0E1B2A",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              justifyContent: "space-between",
              paddingTop: 18,
              textTransform: "uppercase",
            }}
          >
            <span>CJ Turrentine</span>
            <span style={{ color: "#B3322A" }}>District 3</span>
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#145DA0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            padding: "52px",
            position: "relative",
            width: "39%",
          }}
        >
          <div
            style={{
              color: "#FFFDF7",
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Proof in the work
          </div>
          <div
            style={{
              alignItems: "center",
              border: "2px solid #FFFDF7",
              color: "#FFFDF7",
              display: "flex",
              fontSize: 170,
              fontWeight: 900,
              height: 330,
              justifyContent: "center",
              letterSpacing: -14,
              width: "100%",
            }}
          >
            CJ
          </div>
          <div
            style={{
              color: "#F0B429",
              display: "flex",
              fontSize: 26,
              fontWeight: 900,
              textTransform: "uppercase",
            }}
          >
            Vance County
          </div>
        </div>
      </div>
    ),
    size,
  );
}
