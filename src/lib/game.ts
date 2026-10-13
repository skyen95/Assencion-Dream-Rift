export type Role = "Top" | "Jungle" | "Mid" | "Carry" | "Support";
export type StatKey = "mecaniques" | "farm" | "vision" | "macro" | "mental";
export const ROLES: Role[] = ["Top", "Jungle", "Mid", "Carry", "Support"];
export const STAT_LABELS: Record<StatKey, string> = {
  mecaniques: "Mécaniques", farm: "Farm", vision: "Vision", macro: "Macro", mental: "Mental",
};
export const STAT_KEYS = Object.keys(STAT_LABELS) as StatKey[];
export const STAT_MIN = 30;
export const STAT_MAX = 95;

export const SPECIALTIES: { id: string; name: string; desc: string; impact: string; icon: string; stat: StatKey }[] = [
  { id: "duelliste", name: "Duelliste", icon: "⚔", desc: "+6 Mécaniques au départ", impact: "Gagne plus souvent les combats en 1 contre 1 et les affrontements d'équipe.", stat: "mecaniques" },
  { id: "economiste", name: "Économiste", icon: "◎", desc: "+6 Farm au départ", impact: "Accumule l'or plus vite : idéal pour Carry et Top.", stat: "farm" },
  { id: "eclaireur", name: "Éclaireur", icon: "◉", desc: "+6 Vision au départ", impact: "Anticipe les embuscades et sécurise la carte : idéal pour Support.", stat: "vision" },
  { id: "stratege", name: "Stratège", icon: "♜", desc: "+6 Macro au départ", impact: "Meilleures rotations et objectifs : idéal pour Jungle.", stat: "macro" },
  { id: "roc", name: "Roc mental", icon: "⛨", desc: "+6 Mental au départ", impact: "Reste stable sous pression et limite les séries de défaites.", stat: "mental" },
];
export const START_AGE = 16;

// Poids d'impact de chaque stat selon le rôle
export const ROLE_WEIGHTS: Record<Role, Record<StatKey, number>> = {
  Top: { mecaniques: 0.3, farm: 0.25, vision: 0.1, macro: 0.15, mental: 0.2 },
  Jungle: { mecaniques: 0.2, farm: 0.15, vision: 0.2, macro: 0.3, mental: 0.15 },
  Mid: { mecaniques: 0.35, farm: 0.2, vision: 0.1, macro: 0.2, mental: 0.15 },
  Carry: { mecaniques: 0.3, farm: 0.35, vision: 0.05, macro: 0.15, mental: 0.15 },
  Support: { mecaniques: 0.15, farm: 0.05, vision: 0.35, macro: 0.25, mental: 0.2 },
};

export interface Champion { id: string; name: string; title: string; roles: Role[]; stat: StatKey; glyph: string }
export const CHAMPIONS: Champion[] = [
  { id: "kaelra", name: "Kaelra", title: "Lame des cendres", roles: ["Top", "Mid"], stat: "mecaniques", glyph: "⚔" },
  { id: "orvhal", name: "Orvhal", title: "Colosse de basalte", roles: ["Top", "Support"], stat: "mental", glyph: "⛰" },
  { id: "sylith", name: "Sylith", title: "Traqueuse des brumes", roles: ["Jungle"], stat: "macro", glyph: "☾" },
  { id: "vexmor", name: "Vexmor", title: "Archiviste du vide", roles: ["Mid"], stat: "mecaniques", glyph: "✦" },
  { id: "tahlen", name: "Tahlen", title: "Arbalétrier solaire", roles: ["Carry"], stat: "farm", glyph: "☀" },
  { id: "nyria", name: "Nyria", title: "Gardienne des marées", roles: ["Support", "Mid"], stat: "vision", glyph: "≈" },
  { id: "grimvar", name: "Grimvar", title: "Chasseur de reliques", roles: ["Jungle", "Top"], stat: "farm", glyph: "⚒" },
  { id: "elyss", name: "Elyss", title: "Oracle prismatique", roles: ["Support", "Carry"], stat: "vision", glyph: "◈" },
];

export const TIERS = ["Fer", "Bronze", "Argent", "Or", "Platine", "Diamant", "Maître", "Grand Maître", "Challenger"];
const DIVS = ["IV", "III", "II", "I"];
// Rang linéaire : index = tier*4 + div (0..3) pour Fer..Diamant ; Maître+ sans divisions
export interface Rank { tier: number; div: number; lp: number }
export const rankLabel = (r: Rank) => (r.tier >= 6 ? `${TIERS[r.tier]} ${r.lp} LP` : `${TIERS[r.tier]} ${DIVS[r.div]} · ${r.lp} LP`);
export const rankScore = (r: Rank) => (r.tier >= 6 ? 24 + (r.tier - 6) * 4 + r.lp / 100 : r.tier * 4 + r.div + r.lp / 100);
// Difficulté adverse : moyenne de stats attendue selon le rang
export const opponentLevel = (r: Rank) => 34 + rankScore(r) * 1.9;

export interface Training { id: string; name: string; desc: string; stat: StatKey; energy: number; cost: number; gain: [number, number]; secondary?: StatKey }
export const TRAININGS: Training[] = [
  { id: "aim", name: "Session de combos", desc: "Drills de réflexes en salle d'entraînement", stat: "mecaniques", energy: 20, cost: 0, gain: [1, 3] },
  { id: "cs", name: "Exercice de last-hit", desc: "10 min de farm parfait", stat: "farm", energy: 15, cost: 0, gain: [1, 3] },
  { id: "ward", name: "Étude des balises", desc: "Placement de vision et contrôle de carte", stat: "vision", energy: 15, cost: 0, gain: [1, 3] },
  { id: "vod", name: "Analyse de VOD", desc: "Revoir ses parties, comprendre les rotations", stat: "macro", energy: 20, cost: 0, gain: [1, 3] },
  { id: "medit", name: "Préparation mentale", desc: "Gestion du tilt et respiration", stat: "mental", energy: 10, cost: 0, gain: [1, 2] },
  { id: "coach", name: "Coaching privé", desc: "Coach fictif : gros gain Macro + Mental", stat: "macro", secondary: "mental", energy: 25, cost: 250, gain: [3, 5] },
  { id: "bootcamp", name: "Mini bootcamp", desc: "Mécaniques + Farm intensifs", stat: "mecaniques", secondary: "farm", energy: 35, cost: 400, gain: [3, 5] },
];

export interface MatchRecord {
  id: number; win: boolean; champion: string; k: number; d: number; a: number;
  lpDelta: number; impact: number; rankAfter: string; xp: number; coins: number; promo?: string | undefined;
}

export interface Player {
  pseudo: string; role: Role; specialty: string; avatar?: string | undefined; age?: number | undefined;
  stats: Record<StatKey, number>;
  energy: number; coins: number; level: number; xp: number;
  rank: Rank; peakScore: number;
  mastery: Record<string, number>;
  championId: string;
  history: MatchRecord[];
  totalGames: number; wins: number; streak: number;
  day: number; log: string[];
  offersAccepted?: string | undefined;
}

export const MAX_ENERGY = 100;
export const xpForLevel = (lvl: number) => 100 + (lvl - 1) * 60;
export const MAX_LEVEL = 30;

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const rint = (a: number, b: number) => Math.floor(rnd(a, b + 1));
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function createPlayer(pseudo: string, role: Role, specialty: string, championId: string, avatar = "a1"): Player {
  const stats: Record<StatKey, number> = { mecaniques: 40, farm: 40, vision: 40, macro: 40, mental: 40 };
  const sp = SPECIALTIES.find((s) => s.id === specialty);
  if (sp) stats[sp.stat] += 6;
  return {
    pseudo, role, specialty, avatar, age: START_AGE, stats, energy: MAX_ENERGY, coins: 300, level: 1, xp: 0,
    rank: { tier: 1, div: 0, lp: 0 }, peakScore: 4, mastery: {}, championId,
    history: [], totalGames: 0, wins: 0, streak: 0, day: 1,
    log: [`Bienvenue ${pseudo} ! Ta carrière commence en Bronze IV.`],
  };
}

// Plafond : le gain d'entraînement diminue en approchant de 95, et le niveau limite la stat max
export const statCap = (level: number) => Math.min(STAT_MAX, 60 + level * 2);

export function rolePower(p: Player) {
  const w = ROLE_WEIGHTS[p.role];
  return STAT_KEYS.reduce((s, k) => s + p.stats[k] * w[k], 0);
}

export function championBonus(p: Player, champ: Champion) {
  let b = 0;
  if (champ.roles.includes(p.role)) b += 3; else b -= 4;
  b += (p.stats[champ.stat] - 50) * 0.05;
  b += Math.min(4, (p.mastery[champ.id] ?? 0) * 0.2);
  return Math.round(b * 10) / 10;
}

export function winChance(p: Player) {
  const champ = CHAMPIONS.find((c) => c.id === p.championId)!;
  const power = rolePower(p) + championBonus(p, champ);
  const opp = opponentLevel(p.rank);
  const fatigue = p.energy < 20 ? -4 : 0;
  const diff = power - opp + fatigue;
  return clamp(0.5 + diff * 0.025, 0.12, 0.85);
}

export function train(p: Player, t: Training): { player: Player; msg: string; ok: boolean } {
  if (p.energy < t.energy) return { player: p, ok: false, msg: `Pas assez d'énergie (${t.energy} requis). Repose-toi.` };
  if (p.coins < t.cost) return { player: p, ok: false, msg: `Pas assez de crédits (${t.cost} requis).` };
  const cap = statCap(p.level);
  const np: Player = { ...p, stats: { ...p.stats } };
  const parts: string[] = [];
  const apply = (k: StatKey) => {
    const cur = np.stats[k];
    if (cur >= cap) { parts.push(`${STAT_LABELS[k]} au plafond (${cap}) pour ton niveau`); return; }
    const factor = cur > 80 ? 0.4 : cur > 65 ? 0.7 : 1;
    const g = Math.max(1, Math.round(rint(t.gain[0], t.gain[1]) * factor));
    np.stats[k] = Math.min(cap, cur + g);
    parts.push(`${STAT_LABELS[k]} +${np.stats[k] - cur} (${np.stats[k]})`);
  };
  apply(t.stat);
  if (t.secondary) apply(t.secondary);
  np.energy -= t.energy;
  np.coins -= t.cost;
  const msg = `${t.name} : ${parts.join(", ")}. −${t.energy} énergie${t.cost ? `, −${t.cost} ₵` : ""}.`;
  np.log = [msg, ...p.log].slice(0, 30);
  return { player: addXp(np, 10).player, ok: true, msg };
}

export function rest(p: Player): { player: Player; msg: string } {
  const gain = 60;
  const np = { ...p, energy: Math.min(MAX_ENERGY, p.energy + gain), day: p.day + 1, coins: p.coins + 40 };
  const msg = `Jour ${np.day} : repos complet, énergie ${p.energy} → ${np.energy}. +40 ₵ (stream).`;
  np.log = [msg, ...p.log].slice(0, 30);
  return { player: np, msg };
}

function addXp(p: Player, xp: number) {
  const np = { ...p, xp: p.xp + xp };
  let leveled = false;
  while (np.level < MAX_LEVEL && np.xp >= xpForLevel(np.level)) {
    np.xp -= xpForLevel(np.level); np.level++; leveled = true;
  }
  if (np.level >= MAX_LEVEL) np.xp = 0;
  return { player: np, leveled };
}

function applyLp(r: Rank, delta: number): { rank: Rank; promo?: string | undefined } {
  const rank = { ...r };
  rank.lp += delta;
  let promo: string | undefined;
  if (rank.tier >= 6) {
    // Maître+ : LP cumulés, seuils
    if (rank.lp < 0) { rank.tier = 5; rank.div = 3; rank.lp = 75; promo = "Rétrogradé en Diamant I"; }
    else if (rank.tier === 6 && rank.lp >= 200) { rank.tier = 7; rank.lp = 0; promo = "Promu Grand Maître !"; }
    else if (rank.tier === 7 && rank.lp >= 300) { rank.tier = 8; rank.lp = 0; promo = "Promu Challenger !"; }
    else if (rank.tier === 7 && rank.lp < 0) { rank.tier = 6; rank.lp = 150; }
    return { rank, promo };
  }
  if (rank.lp >= 100) {
    rank.lp -= 100;
    if (rank.div < 3) rank.div++; else { rank.tier++; rank.div = 0; }
    promo = `Promotion : ${rank.tier >= 6 ? TIERS[rank.tier] : `${TIERS[rank.tier]} ${DIVS[rank.div]}`} !`;
    if (rank.tier >= 6) rank.lp = 0;
  } else if (rank.lp < 0) {
    if (rank.tier === 0 && rank.div === 0) rank.lp = 0;
    else {
      if (rank.div > 0) rank.div--; else { rank.tier--; rank.div = 3; }
      rank.lp = 75;
      promo = `Rétrogradation : ${TIERS[rank.tier]} ${DIVS[rank.div]}`;
    }
  }
  return { rank, promo };
}

export const MATCH_ENERGY = 20;

export function playMatch(p: Player): { player: Player; match?: MatchRecord; error?: string } {
  if (p.energy < MATCH_ENERGY) return { player: p, error: `Il faut ${MATCH_ENERGY} énergie pour jouer. Repose-toi.` };
  const chance = winChance(p);
  const win = Math.random() < chance;
  const champ = CHAMPIONS.find((c) => c.id === p.championId)!;
  const power = rolePower(p);
  const perf = clamp((power - opponentLevel(p.rank)) / 20 + rnd(-0.6, 0.6) + (win ? 0.4 : -0.4), -1.5, 1.5);
  const killBase: Record<Role, [number, number]> = {
    Top: [2, 7], Jungle: [2, 8], Mid: [3, 10], Carry: [3, 12], Support: [0, 3],
  };
  const [kmin, kmax] = killBase[p.role];
  const k = Math.max(0, Math.round(rnd(kmin, kmax) * (1 + perf * 0.35)));
  const d = Math.max(0, Math.round(rnd(1, 7) * (1 - perf * 0.3)));
  const a = Math.max(0, Math.round(rnd(p.role === "Support" ? 8 : 3, p.role === "Support" ? 20 : 12) * (1 + perf * 0.2)));
  const impact = Math.round(clamp(50 + perf * 30 + (win ? 10 : -10), 5, 100));
  // LP : base + bonus d'impact + série ; plus dur en haut
  const highPenalty = p.rank.tier >= 6 ? 4 : p.rank.tier >= 4 ? 2 : 0;
  let lpDelta = win
    ? Math.round(18 + impact / 10 + Math.min(p.streak, 3) * 2 - highPenalty + rnd(-2, 2))
    : -Math.round(17 - impact / 12 + highPenalty + rnd(-2, 2));
  if (!win && p.rank.tier <= 1) lpDelta = Math.round(lpDelta * 0.8); // indulgence débutant
  const { rank, promo } = applyLp(p.rank, lpDelta);
  const xp = win ? 40 + Math.round(impact / 4) : 20 + Math.round(impact / 6);
  const coins = win ? 60 + Math.round(impact / 2) : 25;
  const newStreak = win ? Math.max(1, p.streak + 1) : Math.min(-1, p.streak - 1);
  let np: Player = {
    ...p, rank, energy: p.energy - MATCH_ENERGY, coins: p.coins + coins,
    totalGames: p.totalGames + 1, wins: p.wins + (win ? 1 : 0), streak: newStreak,
    mastery: { ...p.mastery, [champ.id]: (p.mastery[champ.id] ?? 0) + 1 },
    stats: { ...p.stats },
  };
  // Défaites répétées : le mental baisse légèrement ; victoires l'augmentent un peu
  if (newStreak <= -3 && np.stats.mental > STAT_MIN) np.stats.mental -= 1;
  if (newStreak >= 3 && np.stats.mental < statCap(p.level)) np.stats.mental += 1;
  np.peakScore = Math.max(p.peakScore, rankScore(rank));
  const lv = addXp(np, xp);
  np = lv.player;
  const match: MatchRecord = {
    id: Date.now(), win, champion: champ.name, k, d, a, lpDelta, impact,
    rankAfter: rankLabel(rank), xp, coins, promo: [promo, lv.leveled ? `Niveau ${np.level} !` : ""].filter(Boolean).join(" · ") || undefined,
  };
  np.history = [match, ...p.history].slice(0, 10);
  np.log = [`${win ? "Victoire" : "Défaite"} avec ${champ.name} (${k}/${d}/${a}) ${lpDelta > 0 ? "+" : ""}${lpDelta} LP${promo ? " — " + promo : ""}`, ...p.log].slice(0, 30);
  return { player: np, match };
}

export interface Offer { id: string; team: string; region: string; salary: number; minTier: number; desc: string }
export const OFFERS: Offer[] = [
  { id: "o1", team: "Nébula Rising", region: "Ligue Académie Ouest", salary: 1800, minTier: 5, desc: "Équipe académie cherchant un remplaçant motivé." },
  { id: "o2", team: "Ferrocrâne Gaming", region: "Division 2 Nord", salary: 3200, minTier: 6, desc: "Titulaire en division 2, objectif montée." },
  { id: "o3", team: "Aube Écarlate", region: "Ligue Majeure Continentale", salary: 7500, minTier: 7, desc: "Une organisation de premier plan suit ton classement." },
  { id: "o4", team: "Zénith Prime", region: "Circuit Mondial", salary: 15000, minTier: 8, desc: "Offre élite réservée aux Challenger." },
];
export const RECRUIT_TIER = 5; // Diamant

const KEY = "ascension-moba-carriere-v1";
export function loadPlayer(): Player | null {
  try {
    const s = localStorage.getItem(KEY);
    if (!s) return null;
    const p = JSON.parse(s) as Player;
    return { ...p, avatar: p.avatar ?? "a1", age: p.age ?? START_AGE };
  } catch { return null; }
}
export function savePlayer(p: Player | null) {
  if (p) localStorage.setItem(KEY, JSON.stringify(p)); else localStorage.removeItem(KEY);
}