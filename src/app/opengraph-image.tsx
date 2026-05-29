import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Oto Grade — Hasarlı Araç Alım Merkezi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "24px" }}>
          <span style={{ fontSize: "88px", fontWeight: "600", color: "#111111", letterSpacing: "-4px" }}>
            Oto
          </span>
          <span style={{ fontSize: "88px", fontWeight: "600", color: "#E8380D", letterSpacing: "-4px" }}>
            &nbsp;Grade
          </span>
        </div>
        <p
          style={{
            fontSize: "32px",
            color: "#555555",
            margin: "0",
            textAlign: "center",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          Kazalı, Pert, Yanmış, Sel Hasarlı ve Hurda Araç Alımı
        </p>
        <p style={{ fontSize: "24px", color: "#aaaaaa", marginTop: "24px", margin: "24px 0 0" }}>
          Türkiye Geneli · Ücretsiz Teklif · 1 Saatte Dönüş
        </p>
      </div>
    ),
    { ...size }
  );
}
