// Portraits originaux dessinés en SVG intégré : aucun chargement réseau, affichage garanti.
export interface AvatarPreset { id: string; name: string; skin: string; hair: string; bg: string; accent: string; style: "court" | "long" | "crete" | "capuche" | "chignon" | "rase" | "meches" | "casque" }

export const AVATARS: AvatarPreset[] = [
  { id: "a1", name: "Braise", skin: "oklch(0.78 0.08 60)", hair: "oklch(0.3 0.05 40)", bg: "oklch(0.35 0.12 30)", accent: "oklch(0.82 0.15 85)", style: "court" },
  { id: "a2", name: "Givre", skin: "oklch(0.88 0.04 70)", hair: "oklch(0.92 0.02 240)", bg: "oklch(0.35 0.1 230)", accent: "oklch(0.8 0.12 210)", style: "long" },
  { id: "a3", name: "Volt", skin: "oklch(0.55 0.08 50)", hair: "oklch(0.75 0.17 130)", bg: "oklch(0.3 0.08 150)", accent: "oklch(0.85 0.18 130)", style: "crete" },
  { id: "a4", name: "Ombre", skin: "oklch(0.7 0.07 55)", hair: "oklch(0.22 0.03 280)", bg: "oklch(0.25 0.06 290)", accent: "oklch(0.7 0.15 300)", style: "capuche" },
  { id: "a5", name: "Aurore", skin: "oklch(0.62 0.08 45)", hair: "oklch(0.6 0.18 350)", bg: "oklch(0.32 0.1 350)", accent: "oklch(0.78 0.15 350)", style: "chignon" },
  { id: "a6", name: "Roc", skin: "oklch(0.45 0.06 45)", hair: "oklch(0.2 0.02 40)", bg: "oklch(0.3 0.05 60)", accent: "oklch(0.75 0.12 60)", style: "rase" },
  { id: "a7", name: "Nova", skin: "oklch(0.83 0.06 65)", hair: "oklch(0.7 0.15 55)", bg: "oklch(0.3 0.09 260)", accent: "oklch(0.82 0.15 85)", style: "meches" },
  { id: "a8", name: "Spectre", skin: "oklch(0.75 0.06 60)", hair: "oklch(0.4 0.02 250)", bg: "oklch(0.22 0.03 250)", accent: "oklch(0.72 0.14 200)", style: "casque" },
];

export function Avatar({ id, size = 64, className = "" }: { id?: string | undefined; size?: number; className?: string }) {
  const a = AVATARS.find((x) => x.id === id) ?? AVATARS[0]!;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={`rounded-lg ${className}`} role="img" aria-label={`Portrait ${a.name}`}>
      <rect width="100" height="100" fill={a.bg} />
      <circle cx="50" cy="50" r="46" fill="none" stroke={a.accent} strokeOpacity="0.35" strokeWidth="2" />
      {a.style === "capuche" && <path d="M18 100 Q18 22 50 18 Q82 22 82 100 Z" fill={a.hair} />}
      {a.style === "long" && <path d="M24 92 Q20 30 50 24 Q80 30 76 92 Z" fill={a.hair} />}
      {/* buste / maillot */}
      <path d="M16 100 Q20 76 50 74 Q80 76 84 100 Z" fill={a.accent} opacity="0.9" />
      <path d="M40 76 L50 88 L60 76" fill="none" stroke={a.bg} strokeWidth="3" />
      <rect x="43" y="60" width="14" height="16" fill={a.skin} />
      <ellipse cx="50" cy="48" rx="18" ry="21" fill={a.skin} />
      {a.style === "court" && <path d="M32 44 Q32 24 50 24 Q68 24 68 44 Q60 32 50 34 Q40 32 32 44 Z" fill={a.hair} />}
      {a.style === "long" && <path d="M32 46 Q32 26 50 26 Q68 26 68 46 Q58 34 44 36 Z" fill={a.hair} />}
      {a.style === "crete" && <path d="M44 34 L46 12 L50 30 L54 10 L56 34 Q50 30 44 34 Z" fill={a.hair} />}
      {a.style === "capuche" && <path d="M30 44 Q34 26 50 26 Q66 26 70 44 Q60 36 50 36 Q40 36 30 44 Z" fill={a.hair} />}
      {a.style === "chignon" && <><circle cx="50" cy="20" r="9" fill={a.hair} /><path d="M32 44 Q32 25 50 25 Q68 25 68 44 Q62 32 50 32 Q38 32 32 44 Z" fill={a.hair} /></>}
      {a.style === "rase" && <path d="M33 40 Q34 27 50 27 Q66 27 67 40 Q50 34 33 40 Z" fill={a.hair} opacity="0.85" />}
      {a.style === "meches" && <path d="M31 46 Q30 22 52 24 Q70 26 69 42 L62 34 L58 42 L52 32 L46 42 L40 34 Z" fill={a.hair} />}
      {a.style === "casque" && <><path d="M30 44 Q30 22 50 22 Q70 22 70 44 Z" fill={a.hair} /><rect x="26" y="42" width="6" height="14" rx="3" fill={a.accent} /><rect x="68" y="42" width="6" height="14" rx="3" fill={a.accent} /><path d="M32 56 Q36 64 44 64" fill="none" stroke={a.accent} strokeWidth="2" /></>}
      <circle cx="43" cy="50" r="2.2" fill={a.bg} />
      <circle cx="57" cy="50" r="2.2" fill={a.bg} />
      <path d="M45 59 Q50 62 55 59" fill="none" stroke={a.bg} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M38 44 L47 45 M53 45 L62 44" stroke={a.hair} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}