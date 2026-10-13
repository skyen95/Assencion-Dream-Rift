import { Avatar, AVATARS } from "@/components/Avatar";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CHAMPIONS, MATCH_ENERGY, MAX_ENERGY, MAX_LEVEL, OFFERS, RECRUIT_TIER, ROLES, SPECIALTIES, STAT_KEYS, STAT_LABELS,
  STAT_MAX, STAT_MIN, TIERS, TRAININGS, championBonus, createPlayer, loadPlayer, playMatch, rankLabel, rest,
  savePlayer, statCap, train, winChance, xpForLevel, type MatchRecord, type Player, type Role,
} from "@/lib/game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ascension MOBA : Carrière — Simulateur de carrière e-sport" },
      { name: "description", content: "Incarne un joueur de MOBA fictif : entraîne-toi, joue en classé et grimpe de Bronze à Challenger." },
      { property: "og:title", content: "Ascension MOBA : Carrière" },
      { property: "og:description", content: "Simulateur de carrière solo : entraînement, matchs classés, LP et offres pro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Tab = "tableau" | "entrainement" | "champions" | "historique" | "pro" | "regles";
const TABS: { id: Tab; label: string }[] = [
  { id: "tableau", label: "Tableau de bord" },
  { id: "entrainement", label: "Entraînement" },
  { id: "champions", label: "Champions" },
  { id: "historique", label: "Historique" },
  { id: "pro", label: "Carrière pro" },
  { id: "regles", label: "Règles & guide" },
];

function Index() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("tableau");
  const [feedback, setFeedback] = useState<{ text: string; tone: "ok" | "bad" | "info" } | null>(null);
  const [lastMatch, setLastMatch] = useState<MatchRecord | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => { setPlayer(loadPlayer()); setLoaded(true); }, []);
  useEffect(() => { if (loaded) savePlayer(player); }, [player, loaded]);

  if (!loaded)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-4xl font-bold text-primary">ASCENSION MOBA : CARRIÈRE</h1>
        <p className="text-muted-foreground">Chargement de ta carrière…</p>
      </div>
    );
  if (!player) return <Creation onCreate={(p) => { setPlayer(p); setTab("regles"); }} />;

  const doMatch = () => {
    const r = playMatch(player);
    if (r.error) return setFeedback({ text: r.error, tone: "bad" });
    setPlayer(r.player); setLastMatch(r.match!);
    setFeedback({ text: `${r.match!.win ? "VICTOIRE" : "DÉFAITE"} — ${r.match!.lpDelta > 0 ? "+" : ""}${r.match!.lpDelta} LP${r.match!.promo ? " · " + r.match!.promo : ""}`, tone: r.match!.win ? "ok" : "bad" });
  };
  const doRest = () => { const r = rest(player); setPlayer(r.player); setFeedback({ text: r.msg, tone: "info" }); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar id={player.avatar} size={64} className="border-2 border-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">ASCENSION MOBA : CARRIÈRE</h1>
            <p className="text-sm text-muted-foreground">{player.pseudo} · {player.age ?? 16} ans · {player.role} · {SPECIALTIES.find((s) => s.id === player.specialty)?.name} · Jour {player.day}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Chip label="Rang" value={rankLabel(player.rank)} accent />
          <Chip label="Niveau" value={`${player.level}`} />
          <Chip label="Crédits" value={`${player.coins} ₵`} />
          <Chip label="Énergie" value={`${player.energy}/${MAX_ENERGY}`} />
        </div>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <button onClick={doMatch} disabled={player.energy < MATCH_ENERGY} className="btn-gold rounded-lg px-6 py-4 text-xl">
          ▶ JOUER UN MATCH CLASSÉ <span className="text-sm opacity-80">(−{MATCH_ENERGY} énergie · {Math.round(winChance(player) * 100)}% de victoire estimée)</span>
        </button>
        <button onClick={doRest} className="rounded-lg border border-accent px-5 py-4 font-display font-bold text-accent hover:bg-accent/10">☾ SE REPOSER (+60 énergie)</button>
        <button onClick={() => setConfirmReset(true)} className="rounded-lg border border-border px-4 py-4 text-sm text-muted-foreground hover:border-destructive hover:text-destructive">Réinitialiser</button>
      </div>

      {feedback && (
        <div className={`mt-3 rounded-lg border px-4 py-3 font-semibold ${feedback.tone === "ok" ? "border-success text-success" : feedback.tone === "bad" ? "border-destructive text-destructive" : "border-accent text-accent"}`}>
          {feedback.text}
        </div>
      )}

      <nav className="mt-5 flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 font-display text-base font-bold ${tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            {t.label}{t.id === "pro" && player.rank.tier < RECRUIT_TIER ? " 🔒" : ""}
          </button>
        ))}
      </nav>

      <main className="mt-5">
        {tab === "tableau" && <Dashboard p={player} last={lastMatch} />}
        {tab === "entrainement" && <TrainingTab p={player} onTrain={(t) => { const r = train(player, t); setPlayer(r.player); setFeedback({ text: r.msg, tone: r.ok ? "ok" : "bad" }); }} />}
        {tab === "champions" && <ChampionsTab p={player} onPick={(id) => { setPlayer({ ...player, championId: id }); setFeedback({ text: `Champion sélectionné : ${CHAMPIONS.find((c) => c.id === id)!.name}`, tone: "info" }); }} />}
        {tab === "historique" && <History p={player} />}
        {tab === "pro" && <ProTab p={player} onAccept={(id) => { setPlayer({ ...player, offersAccepted: id }); setFeedback({ text: "Offre signée (contexte narratif) — continue à grimper !", tone: "ok" }); }} />}
        {tab === "regles" && <Rules />}
      </main>

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
          <div className="panel max-w-sm p-6">
            <h3 className="text-xl font-bold">Réinitialiser la carrière ?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Toute ta progression sera définitivement supprimée.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setConfirmReset(false)} className="rounded-md border border-border px-4 py-2">Annuler</button>
              <button onClick={() => { setPlayer(null); setConfirmReset(false); setFeedback(null); setLastMatch(null); }} className="rounded-md bg-destructive px-4 py-2 font-semibold text-destructive-foreground">Oui, tout effacer</button>
            </div>
          </div>
        </div>
      )}
      <p className="mt-8 text-center text-xs text-muted-foreground">Sauvegarde automatique dans ce navigateur. Jeu original, univers et équipes entièrement fictifs.</p>
    </div>
  );
}

function Chip({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`panel px-3 py-2 ${accent ? "border-primary" : ""}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-lg font-bold ${accent ? "text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function Bar({ value, max, tone = "primary" }: { value: number; max: number; tone?: "primary" | "accent" | "success" }) {
  const cls = tone === "accent" ? "bg-accent" : tone === "success" ? "bg-success" : "bg-primary";
  return <div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className={`h-full ${cls} transition-all`} style={{ width: `${(value / max) * 100}%` }} /></div>;
}

function StatsPanel({ p }: { p: Player }) {
  const cap = statCap(p.level);
  return (
    <div className="panel p-5">
      <div className="flex items-baseline justify-between"><h2 className="text-xl font-bold">Statistiques</h2><span className="text-xs text-muted-foreground">Plafond actuel : {cap} (max {STAT_MAX})</span></div>
      <div className="mt-4 space-y-3">
        {STAT_KEYS.map((k) => (
          <div key={k}>
            <div className="flex justify-between text-sm"><span>{STAT_LABELS[k]}</span><span className="font-bold">{p.stats[k]}</span></div>
            <Bar value={p.stats[k] - STAT_MIN} max={STAT_MAX - STAT_MIN} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Dashboard({ p, last }: { p: Player; last: MatchRecord | null }) {
  const champ = CHAMPIONS.find((c) => c.id === p.championId)!;
  const wr = p.totalGames ? Math.round((p.wins / p.totalGames) * 100) : 0;
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="panel p-5 lg:col-span-2">
        <div className="mb-5 flex items-center gap-4 rounded-lg bg-muted p-3">
          <Avatar id={p.avatar} size={88} className="border-2 border-primary" />
          <div className="text-sm">
            <div className="font-display text-2xl font-bold">{p.pseudo}</div>
            <div>Âge : <b>{p.age ?? 16} ans</b> · Poste : <b>{p.role}</b></div>
            <div>Spécialité : <b>{SPECIALTIES.find((s) => s.id === p.specialty)?.name}</b></div>
          </div>
        </div>
        <h2 className="text-xl font-bold">Progression</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-sm text-muted-foreground">Classement</div>
            <div className="font-display text-3xl font-bold text-primary">{rankLabel(p.rank)}</div>
            <div className="mt-2"><Bar value={p.rank.tier >= 6 ? Math.min(p.rank.lp, 300) : p.rank.lp} max={p.rank.tier >= 6 ? 300 : 100} /></div>
            <div className="mt-2 flex flex-wrap gap-1">
              {TIERS.map((t, i) => <span key={t} className={`rounded px-1.5 py-0.5 text-[10px] ${i === p.rank.tier ? "bg-primary text-primary-foreground" : i < p.rank.tier ? "bg-secondary text-foreground" : "bg-muted text-muted-foreground"}`}>{t}</span>)}
            </div>
          </div>
          <div className="space-y-3">
            <div><div className="flex justify-between text-sm"><span>Niveau {p.level}{p.level >= MAX_LEVEL ? " (max)" : ""}</span><span>{p.xp}/{xpForLevel(p.level)} XP</span></div><Bar value={p.xp} max={xpForLevel(p.level)} tone="accent" /></div>
            <div><div className="flex justify-between text-sm"><span>Énergie</span><span>{p.energy}/{MAX_ENERGY}</span></div><Bar value={p.energy} max={MAX_ENERGY} tone="success" /></div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded bg-muted p-2"><div className="font-bold">{p.totalGames}</div><div className="text-xs text-muted-foreground">Parties</div></div>
              <div className="rounded bg-muted p-2"><div className="font-bold">{wr}%</div><div className="text-xs text-muted-foreground">Victoires</div></div>
              <div className="rounded bg-muted p-2"><div className={`font-bold ${p.streak > 0 ? "text-success" : p.streak < 0 ? "text-destructive" : ""}`}>{p.streak > 0 ? `+${p.streak}` : p.streak}</div><div className="text-xs text-muted-foreground">Série</div></div>
            </div>
          </div>
        </div>
        <div className="mt-5 rounded-lg bg-muted p-3 text-sm">Champion actuel : <b className="text-primary">{champ.glyph} {champ.name}</b> — bonus d'affinité {championBonus(p, champ) >= 0 ? "+" : ""}{championBonus(p, champ)}</div>
        {last && (
          <div className={`mt-4 rounded-lg border p-4 ${last.win ? "border-success" : "border-destructive"}`}>
            <div className="text-xs uppercase text-muted-foreground">Dernier match</div>
            <div className={`font-display text-2xl font-bold ${last.win ? "text-success" : "text-destructive"}`}>{last.win ? "VICTOIRE" : "DÉFAITE"} · {last.lpDelta > 0 ? "+" : ""}{last.lpDelta} LP</div>
            <div className="mt-1 text-sm">{last.champion} · KDA {last.k}/{last.d}/{last.a} · Impact {last.impact}/100 · +{last.xp} XP · +{last.coins} ₵</div>
            {last.promo && <div className="mt-1 font-semibold text-primary">{last.promo}</div>}
          </div>
        )}
        <h3 className="mt-5 font-bold">Journal</h3>
        <ul className="mt-2 max-h-40 space-y-1 overflow-auto text-sm text-muted-foreground">{p.log.map((l, i) => <li key={i}>• {l}</li>)}</ul>
      </div>
      <StatsPanel p={p} />
    </div>
  );
}

function TrainingTab({ p, onTrain }: { p: Player; onTrain: (t: (typeof TRAININGS)[number]) => void }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">
        {TRAININGS.map((t) => {
          const disabled = p.energy < t.energy || p.coins < t.cost;
          return (
            <div key={t.id} className="panel flex flex-col p-4">
              <h3 className="text-lg font-bold">{t.name}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
              <p className="mt-2 text-sm">Gain : <b>{STAT_LABELS[t.stat]}{t.secondary ? ` + ${STAT_LABELS[t.secondary]}` : ""}</b> +{t.gain[0]}–{t.gain[1]}</p>
              <p className="text-sm text-muted-foreground">Coût : {t.energy} énergie{t.cost ? ` · ${t.cost} ₵` : ""} · +10 XP</p>
              <button disabled={disabled} onClick={() => onTrain(t)} className="btn-gold mt-3 rounded-md px-3 py-2">S'entraîner</button>
            </div>
          );
        })}
        <p className="text-xs text-muted-foreground sm:col-span-2">Rendements décroissants au-delà de 65 et 80. Le plafond de stat augmente avec ton niveau (60 + 2×niveau, max 95).</p>
      </div>
      <StatsPanel p={p} />
    </div>
  );
}

function ChampionsTab({ p, onPick }: { p: Player; onPick: (id: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {CHAMPIONS.map((c) => {
        const sel = c.id === p.championId; const b = championBonus(p, c);
        return (
          <div key={c.id} className={`panel p-4 ${sel ? "border-primary" : ""}`}>
            <div className="text-4xl text-primary">{c.glyph}</div>
            <h3 className="mt-1 text-xl font-bold">{c.name}</h3>
            <p className="text-xs text-muted-foreground">{c.title}</p>
            <p className="mt-2 text-sm">Rôles : {c.roles.join(", ")}</p>
            <p className="text-sm">Stat clé : {STAT_LABELS[c.stat]}</p>
            <p className="text-sm">Maîtrise : {p.mastery[c.id] ?? 0} parties</p>
            <p className={`mt-1 font-bold ${b >= 0 ? "text-success" : "text-destructive"}`}>Affinité {b >= 0 ? "+" : ""}{b}</p>
            <button disabled={sel} onClick={() => onPick(c.id)} className="btn-gold mt-3 w-full rounded-md px-3 py-2">{sel ? "Sélectionné" : "Choisir"}</button>
          </div>
        );
      })}
    </div>
  );
}

function History({ p }: { p: Player }) {
  if (!p.history.length) return <div className="panel p-6 text-muted-foreground">Aucun match joué. Lance ton premier match classé !</div>;
  return (
    <div className="panel overflow-x-auto p-4">
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground"><tr><th className="p-2">Résultat</th><th>Champion</th><th>KDA</th><th>Impact</th><th>LP</th><th>Rang après</th></tr></thead>
        <tbody>
          {p.history.map((m) => (
            <tr key={m.id} className="border-t border-border">
              <td className={`p-2 font-bold ${m.win ? "text-success" : "text-destructive"}`}>{m.win ? "Victoire" : "Défaite"}</td>
              <td>{m.champion}</td><td>{m.k}/{m.d}/{m.a}</td><td>{m.impact}</td>
              <td className={m.lpDelta > 0 ? "text-success" : "text-destructive"}>{m.lpDelta > 0 ? "+" : ""}{m.lpDelta}</td>
              <td>{m.rankAfter}{m.promo ? <span className="ml-2 text-primary">★</span> : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex h-16 items-end gap-1">
        {[...p.history].reverse().map((m) => <div key={m.id} title={`${m.lpDelta} LP`} className={`flex-1 rounded-t ${m.win ? "bg-success" : "bg-destructive"}`} style={{ height: `${Math.min(100, Math.abs(m.lpDelta) * 3)}%` }} />)}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">10 derniers matchs (du plus ancien au plus récent)</p>
    </div>
  );
}

function ProTab({ p, onAccept }: { p: Player; onAccept: (id: string) => void }) {
  const unlocked = p.rank.tier >= RECRUIT_TIER;
  return (
    <div className="space-y-4">
      <div className="panel p-5">
        <h2 className="text-xl font-bold">Carrière pro</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {unlocked ? "Les recruteurs fictifs remarquent ton classement. Signer une offre est un jalon narratif : la compétition pro jouable n'est pas incluse dans ce prototype." : `Recrutement débloqué à partir de ${TIERS[RECRUIT_TIER]} IV. Ton rang : ${rankLabel(p.rank)}.`}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {OFFERS.map((o) => {
          const ok = p.rank.tier >= o.minTier; const signed = p.offersAccepted === o.id;
          return (
            <div key={o.id} className={`panel p-4 ${ok ? "" : "opacity-50"} ${signed ? "border-primary" : ""}`}>
              <h3 className="text-lg font-bold">{o.team}</h3>
              <p className="text-sm text-muted-foreground">{o.region} · requis : {TIERS[o.minTier]}</p>
              <p className="mt-2 text-sm">{o.desc}</p>
              <p className="mt-1 text-sm">Salaire fictif : {o.salary} ₵ / mois</p>
              <button disabled={!ok || signed} onClick={() => onAccept(o.id)} className="btn-gold mt-3 rounded-md px-3 py-2">{signed ? "Contrat signé" : ok ? "Signer l'offre" : "🔒 Verrouillé"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Rules() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="panel p-5">
        <h2 className="text-xl font-bold text-primary">Guide de démarrage</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
          <li>Choisis un champion adapté à ton rôle (onglet Champions) pour un bonus d'affinité.</li>
          <li>Joue quelques matchs classés : en Bronze, l'adversité est faible.</li>
          <li>Utilise l'énergie restante pour t'entraîner sur les stats importantes de ton rôle.</li>
          <li>Repose-toi quand l'énergie baisse : un nouveau jour commence et tu gagnes 40 ₵.</li>
          <li>Dépense tes crédits en coaching ou bootcamp pour des gains plus forts.</li>
        </ol>
      </div>
      <div className="panel p-5">
        <h2 className="text-xl font-bold text-primary">Règles</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          <li>Chaque match coûte {MATCH_ENERGY} énergie. Victoire ≈ +18 à +30 LP, défaite ≈ −12 à −20 LP.</li>
          <li>100 LP = division suivante. Diamant I → Maître. Maître 200 LP → Grand Maître, GM 300 LP → Challenger.</li>
          <li>Les chances dépendent de tes stats pondérées par rôle, du champion, de l'aléa et du niveau adverse qui augmente avec ton rang.</li>
          <li>Énergie sous 20 : impossible de jouer. Séries de défaites : le mental baisse.</li>
          <li>Stats entre {STAT_MIN} et {STAT_MAX}. Plafond lié au niveau (XP gagnée en jouant et en s'entraînant).</li>
          <li>Carrière pro : offres fictives débloquées dès le Diamant.</li>
        </ul>
      </div>
    </div>
  );
}

function Creation({ onCreate }: { onCreate: (p: Player) => void }) {
  const [pseudo, setPseudo] = useState("");
  const [role, setRole] = useState<Role>("Mid");
  const [spec, setSpec] = useState("duelliste");
  const [champ, setChamp] = useState("vexmor");
  const [avatar, setAvatar] = useState("a1");
  const champs = CHAMPIONS.filter((c) => c.roles.includes(role));
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center text-4xl font-bold text-primary">ASCENSION MOBA : CARRIÈRE</h1>
      <p className="mt-2 text-center text-muted-foreground">Crée ton joueur et grimpe de Bronze IV jusqu'à Challenger.</p>
      <div className="panel mt-8 space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-primary/50 bg-muted p-4">
          <Avatar id={avatar} size={72} className="border-2 border-primary" />
          <div className="flex-1 space-y-1 text-sm">
            <div className="font-display text-xl font-bold">{pseudo.trim() || "Ton joueur"}</div>
            <div>Âge : <b className="text-primary">16 ans</b></div>
            <div>Rang de départ : <b className="text-primary">Bronze IV · 0 LP</b> — tout nouveau joueur commence ici.</div>
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold">Portrait</span>
          <div className="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-8" role="radiogroup" aria-label="Portrait">
            {AVATARS.map((a) => (
              <button key={a.id} role="radio" aria-checked={avatar === a.id} onClick={() => setAvatar(a.id)}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-1 transition ${avatar === a.id ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]" : "border-transparent opacity-70 hover:opacity-100"}`}>
                <Avatar id={a.id} size={60} />
                <span className="text-xs">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="text-sm font-semibold">Pseudo</span>
          <input value={pseudo} maxLength={16} onChange={(e) => setPseudo(e.target.value)} placeholder="Ex. NovaStrike" className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:border-primary" />
        </label>
        <div>
          <span className="text-sm font-semibold">Poste (à 16 ans)</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ROLES.map((r) => <button key={r} onClick={() => { setRole(r); setChamp(CHAMPIONS.find((c) => c.roles.includes(r))?.id ?? "kaelra"); }} className={`rounded-md border px-4 py-2 font-display font-bold ${role === r ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{r}</button>)}
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold">Spécialité</span>
          <div className="mt-2 flex flex-col gap-2" role="radiogroup" aria-label="Spécialité">
            {SPECIALTIES.map((s) => {
              const on = spec === s.id;
              return (
                <button key={s.id} role="radio" aria-checked={on} onClick={() => setSpec(s.id)}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition ${on ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground"}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-primary" : "border-muted-foreground"}`}>{on && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}</span>
                  <span className="w-6 shrink-0 text-center text-xl text-primary">{s.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{s.name}</span>
                    <span className="block text-xs text-muted-foreground">{s.impact}</span>
                  </span>
                  <span className="shrink-0 rounded bg-secondary px-2 py-1 text-xs font-semibold text-primary">{s.desc.replace(" au départ", "")}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <span className="text-sm font-semibold">Champion de départ</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {champs.map((c) => <button key={c.id} onClick={() => setChamp(c.id)} className={`rounded-md border px-3 py-2 ${champ === c.id ? "border-primary text-primary" : "border-border"}`}>{c.glyph} {c.name}</button>)}
          </div>
        </div>
        <button disabled={pseudo.trim().length < 2} onClick={() => onCreate(createPlayer(pseudo.trim(), role, spec, champ, avatar))} className="btn-gold w-full rounded-lg py-3 text-lg">COMMENCER MA CARRIÈRE</button>
      </div>
    </div>
  );
}