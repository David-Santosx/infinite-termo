import { ImageResponse } from "next/og";

export const alt = "Infinite Termo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TILES = [
  { letter: "T", color: "#22a663" },
  { letter: "E", color: "#e0a43a" },
  { letter: "R", color: "#2a2a2f" },
  { letter: "M", color: "#22a663" },
  { letter: "O", color: "#22a663" },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#121214",
        color: "#fff",
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: 6 }}>INFINITE TERMO</div>
      <div style={{ display: "flex", gap: 20, marginTop: 56 }}>
        {TILES.map((tile, i) => (
          <div
            key={i}
            style={{
              width: 128,
              height: 128,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: tile.color,
              borderRadius: 14,
              fontSize: 80,
              fontWeight: 700,
            }}
          >
            {tile.letter}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 40, marginTop: 56, opacity: 0.85 }}>Termo sem limite diário</div>
    </div>,
    size,
  );
}
