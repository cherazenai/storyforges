import { forwardRef } from "react";
import { User } from "lucide-react";

interface CharacterSheetProps {
  data: Record<string, string>;
}

const CharacterSheet = forwardRef<HTMLDivElement, CharacterSheetProps>(({ data }, ref) => {
  const name = data["Name"] || "Unknown";
  const alias = data["Title / Alias"] || "";
  const race = data["Race"] || "";
  const role = data["Role"] || "";
  const worldSetting = data["World Setting"] || "";
  const personality = data["Personality"] || "";
  const backstory = data["Backstory"] || "";
  const abilities = data["Abilities / Powers"] || "";
  const goal = data["Goal / Motivation"] || data["Goal"] || "";
  const secret = data["Secret"] || "";
  const weakness = data["Weakness"] || "";
  const characterArc = data["Character Arc Potential"] || data["Character Arc"] || "";

  const subtitle = [alias, race, role].filter(Boolean).join(" • ");

  return (
    <div
      ref={ref}
      className="character-sheet"
      style={{
        width: "794px", // A4 width at 96dpi
        minHeight: "1123px",
        background: "#000000",
        color: "#e2e8f0",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorations */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(ellipse at top left, rgba(42, 103, 129, 0.12), transparent 50%), radial-gradient(ellipse at bottom right, rgba(42, 103, 129, 0.08), transparent 50%)",
        pointerEvents: "none",
      }} />

      {/* Corner ornaments */}
      <div style={{
        position: "absolute", top: "16px", left: "16px", width: "60px", height: "60px",
        borderTop: "2px solid rgba(168, 193, 214, 0.3)", borderLeft: "2px solid rgba(168, 193, 214, 0.3)",
        borderTopLeftRadius: "4px",
      }} />
      <div style={{
        position: "absolute", top: "16px", right: "16px", width: "60px", height: "60px",
        borderTop: "2px solid rgba(168, 193, 214, 0.3)", borderRight: "2px solid rgba(168, 193, 214, 0.3)",
        borderTopRightRadius: "4px",
      }} />
      <div style={{
        position: "absolute", bottom: "16px", left: "16px", width: "60px", height: "60px",
        borderBottom: "2px solid rgba(168, 193, 214, 0.3)", borderLeft: "2px solid rgba(168, 193, 214, 0.3)",
        borderBottomLeftRadius: "4px",
      }} />
      <div style={{
        position: "absolute", bottom: "16px", right: "16px", width: "60px", height: "60px",
        borderBottom: "2px solid rgba(168, 193, 214, 0.3)", borderRight: "2px solid rgba(168, 193, 214, 0.3)",
        borderBottomRightRadius: "4px",
      }} />

      <div style={{ position: "relative", padding: "40px 48px" }}>

        {/* ── Header Section ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
          <div style={{ flex: 1 }}>
            {/* StoryForge badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              fontSize: "10px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase" as const,
              color: "#A8C1D6", marginBottom: "16px", opacity: 0.7,
            }}>
              ✦ STORYFORGE CHARACTER SHEET ✦
            </div>

            {/* Character Name */}
            <h1 style={{
              fontSize: "36px", fontWeight: 800, lineHeight: 1.1, margin: "0 0 8px 0",
              background: "linear-gradient(135deg, #e2e8f0, #A8C1D6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}>
              {name}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p style={{
                fontSize: "14px", color: "#A8C1D6", fontWeight: 500,
                letterSpacing: "0.5px", margin: 0,
              }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Portrait Placeholder */}
          <div style={{
            width: "120px", height: "140px", flexShrink: 0, marginLeft: "24px",
            background: "linear-gradient(135deg, rgba(42, 103, 129, 0.2), rgba(26, 26, 31, 0.8))",
            border: "1px solid rgba(168, 193, 214, 0.2)",
            borderRadius: "8px",
            display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center",
            gap: "8px",
          }}>
            <User style={{ width: "40px", height: "40px", color: "rgba(168, 193, 214, 0.3)" }} />
            <span style={{ fontSize: "9px", color: "rgba(168, 193, 214, 0.3)", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" as const }}>
              Portrait
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          height: "1px", margin: "0 0 28px 0",
          background: "linear-gradient(90deg, rgba(168, 193, 214, 0.4), rgba(42, 103, 129, 0.2), transparent)",
        }} />

        {/* ── Info Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "32px" }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
            <InfoField label="Race" value={race} />
            <InfoField label="Role" value={role} />
            <InfoField label="World Setting" value={worldSetting} />
            <InfoField label="Goal" value={goal} />
          </div>
          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
            <InfoField label="Personality" value={personality} />
            <InfoField label="Secret" value={secret} />
            <InfoField label="Weakness" value={weakness} />
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{
          height: "1px", margin: "0 0 28px 0",
          background: "linear-gradient(90deg, transparent, rgba(42, 103, 129, 0.3), transparent)",
        }} />

        {/* ── Main Sections ── */}
        <SheetSection title="Backstory" content={backstory} />
        <SheetSection title="Abilities / Powers" content={abilities} />
        <SheetSection title="Character Arc" content={characterArc} />

        {/* ── Footer ── */}
        <div style={{
          marginTop: "40px", paddingTop: "16px",
          borderTop: "1px solid rgba(168, 193, 214, 0.1)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "9px", color: "rgba(168, 193, 214, 0.3)", letterSpacing: "1.5px", textTransform: "uppercase" as const, fontWeight: 600 }}>
            Generated by StoryForge
          </span>
          <span style={{ fontSize: "9px", color: "rgba(168, 193, 214, 0.2)" }}>
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  );
});

CharacterSheet.displayName = "CharacterSheet";

function InfoField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <div style={{
        fontSize: "9px", fontWeight: 700, letterSpacing: "1.5px",
        textTransform: "uppercase" as const, color: "#A8C1D6", marginBottom: "4px",
      }}>
        {label}
      </div>
      <div style={{
        fontSize: "12px", lineHeight: 1.6, color: "#cbd5e1",
        paddingLeft: "10px", borderLeft: "2px solid rgba(42, 103, 129, 0.4)",
      }}>
        {value}
      </div>
    </div>
  );
}

function SheetSection({ title, content }: { title: string; content: string }) {
  if (!content) return null;
  return (
    <div style={{ marginBottom: "24px" }}>
      <h3 style={{
        fontSize: "12px", fontWeight: 700, letterSpacing: "2px",
        textTransform: "uppercase" as const, color: "#A8C1D6", marginBottom: "10px",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{
          width: "16px", height: "1px",
          background: "linear-gradient(90deg, #2A6781, transparent)",
          display: "inline-block",
        }} />
        {title}
      </h3>
      <div style={{
        fontSize: "12px", lineHeight: 1.8, color: "#94a3b8",
        padding: "12px 16px",
        background: "rgba(26, 26, 31, 0.6)",
        border: "1px solid rgba(168, 193, 214, 0.08)",
        borderRadius: "6px",
        whiteSpace: "pre-wrap" as const,
      }}>
        {content}
      </div>
    </div>
  );
}

export default CharacterSheet;
