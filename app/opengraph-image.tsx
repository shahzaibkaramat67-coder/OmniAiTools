import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "OmniAITool – 40+ AI-Powered Tools";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:    "linear-gradient(135deg, #0f1117 0%, #161b27 100%)",
          width:         "100%",
          height:        "100%",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          justifyContent:"center",
          fontFamily:    "sans-serif",
          position:      "relative",
          overflow:      "hidden",
        }}
      >
        {/* Glow */}
        <div style={{
          position:        "absolute",
          top:             "10%",
          left:            "50%",
          transform:       "translateX(-50%)",
          width:           "700px",
          height:          "400px",
          background:      "radial-gradient(ellipse, rgba(36,85,245,0.25) 0%, transparent 70%)",
          borderRadius:    "50%",
        }} />

        {/* Logo */}
        <div style={{
          width:           64,
          height:          64,
          borderRadius:    16,
          background:      "linear-gradient(135deg, #2455f5, #8b5cf6)",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          fontSize:        32,
          fontWeight:      800,
          color:           "white",
          marginBottom:    24,
        }}>
          O
        </div>

        {/* Title */}
        <div style={{
          fontSize:       64,
          fontWeight:     800,
          color:          "white",
          marginBottom:   16,
          textAlign:      "center",
          lineHeight:     1.1,
        }}>
          Omni
          <span style={{ color: "#4d7bff" }}>AI</span>
          Tool
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize:     26,
          color:        "#94a3b8",
          textAlign:    "center",
          maxWidth:     700,
          lineHeight:   1.4,
        }}>
          40+ AI-Powered Tools for Writing, SEO,<br/>Social Media, and More
        </div>

        {/* Tags */}
        <div style={{
          display:      "flex",
          gap:          12,
          marginTop:    36,
          flexWrap:     "wrap",
          justifyContent: "center",
        }}>
          {["Writing", "SEO", "Social Media", "AI Images", "Productivity", "Marketing"].map((tag) => (
            <div key={tag} style={{
              padding:       "8px 18px",
              borderRadius:  999,
              background:    "rgba(36,85,245,0.15)",
              border:        "1px solid rgba(36,85,245,0.35)",
              color:         "#85a8ff",
              fontSize:      16,
              fontWeight:    600,
            }}>
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
