import React, { useEffect, useRef, useState } from 'react';

export type ScreenType = 'home' | 'map' | 'stores' | 'reserve' | 'pin' | 'receipt';

const API = 'http://127.0.0.1:8000/api';

const C = {
  g: '#12502E', g2: '#E6EFE8', bg: '#F2F3EC', card: '#FFFFFF', ink: '#14231A', mute: '#617066',
  line: '#E4E7DE', warnBg: '#FCEFD2', warnTx: '#B27408', red: '#B8402A', redBg: '#F8E1DB', blue: '#2F6FE0',
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;800&family=Noto+Sans+Telugu:wght@400;700&display=swap');
body{margin:0;background:#E1E4DA;font-family:Mukta,"Noto Sans Telugu",system-ui,sans-serif}
input{font-family:inherit}
input:focus{outline:none}
@property --a{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes spin{to{--a:360deg}}
@keyframes pulse{0%{box-shadow:0 0 0 0 #9B5CFF88}100%{box-shadow:0 0 0 16px #9B5CFF00}}
.glow{position:fixed;top:0;bottom:0;left:50%;width:100%;max-width:430px;transform:translateX(-50%);pointer-events:none;z-index:50}
.glow::before{content:"";position:absolute;inset:0;padding:3px;background:conic-gradient(from var(--a),#4F8CFF,#9B5CFF,#FF5CAA,#FFB04F,#4F8CFF);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:spin 6s linear infinite}
.glow::after{content:"";position:absolute;inset:0;box-shadow:inset 0 0 26px 5px #7864ff59,inset 0 0 70px 8px #ff5caa2e}
.micon{animation:pulse 1.2s infinite}
`;

const ICON: Record<string, string> = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  warehouse: 'M3 10l9-6 9 6v10H3z M9 20v-6h6v6',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9',
  pin: 'M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z M12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M21 21l-5-5',
  wheat: 'M12 21V9 M12 9c-2.5 0-4-1.7-4-4 2.5 0 4 1.7 4 4z M12 9c2.5 0 4-1.7 4-4-2.5 0-4 1.7-4 4z M12 15c-2.5 0-4-1.7-4-4 2.5 0 4 1.7 4 4z M12 15c2.5 0 4-1.7 4-4-2.5 0-4 1.7-4 4z',
  weight: 'M7 9h10l2 11H5z M12 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
  cal: 'M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4',
  near: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 2v3 M12 19v3 M2 12h3 M19 12h3',
  shield: 'M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z M9 12l2 2 4-4',
  back: 'M15 18l-6-6 6-6',
  spark: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z',
  check: 'M5 12.5l4.5 4.5L19 7',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z M5 11a7 7 0 0 0 14 0 M12 18v3',
  x: 'M6 6l12 12M18 6L6 18',
};

const Ic = ({ n, size = 18, color = C.g, sw = 1.8 }: { n: string; size?: number; color?: string; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={ICON[n]} />
  </svg>
);

const GUNTUR = { lat: 16.3067, lon: 80.4365 };
const kmFrom = (lat: number, lon: number) => {
  const R = 6371;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(lat - GUNTUR.lat);
  const dLon = rad(lon - GUNTUR.lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(GUNTUR.lat)) * Math.cos(rad(lat)) * Math.sin(dLon / 2) ** 2;
  return Math.max(1, Math.round(2 * R * Math.asin(Math.sqrt(a))));
};
const inr = (n: number) => n.toLocaleString('en-IN');
const isCold = (s: any) => String(s.kind || '').toLowerCase().includes('cold');

const card = { backgroundColor: C.card, border: `1px solid ${C.line}`, borderRadius: '16px' } as const;
const primary = { width: '100%', backgroundColor: C.g, color: '#FFF', border: 'none', padding: '15px', borderRadius: '12px', fontFamily: 'inherit', fontWeight: 800, fontSize: '16px', cursor: 'pointer' } as const;
const outline = { width: '100%', backgroundColor: 'transparent', color: C.g, border: `1.5px solid ${C.g}`, padding: '14px', borderRadius: '12px', fontFamily: 'inherit', fontWeight: 800, fontSize: '16px', cursor: 'pointer' } as const;
const fieldInput = { border: 'none', background: 'transparent', color: C.ink, fontSize: '16px', fontWeight: 800, padding: 0, width: '100%' } as const;

/* ---------- voice assistant data ---------- */
const CROPS = [
  { en: 'Dry chilli', te: 'ఎండు మిరప' },
  { en: 'Turmeric', te: 'పసుపు' },
  { en: 'Groundnut', te: 'వేరుశనగ' },
];

const V: any = {
  en: {
    hi: 'Hello! Which crop do you want to store? Dry chilli, turmeric or groundnut?',
    crop: 'Which crop do you want to store? Dry chilli, turmeric or groundnut?',
    qty: 'How many quintals?',
    mo: 'For how many months? 2, 3 or 6?',
    cf: (c: any, q: any, m: any) => `${c}, ${q} quintals, ${m} months, near Guntur. Shall I search for stores? Say yes or no.`,
    retry: "Sorry, I didn't catch that. Please say it again.",
    intro: (n: any) => `I found ${n} stores.`,
    st: (i: any, s: any, t: any) => `Number ${i}. ${s.name} in ${s.town}. ${s.rate} rupees per quintal per month. Total ${t} rupees.`,
    pick: (n: any) => `Which one do you want? Say a number from 1 to ${n}.`,
    sf: (s: any) => `You chose ${s.name}. Is that right? Say yes or no.`,
    fin: (s: any, c: any, q: any, m: any, f: any, a: any) => `Please check. ${s.name}. ${c}, ${q} quintals, ${m} months. Storage fee ${f} rupees. You pay ${a} rupees now to hold the slot. Shall I take you to payment? Say yes or no.`,
    pin: "Now please enter your UPI PIN yourself. I can't hear it or see it.",
    done: 'Done! Your slot is booked. Your e-receipt is on the screen.',
    none: "No store has that much space. Let's try a smaller quantity.",
    again: "Okay, let's start again.",
    y: 'Yes', n: 'No', sp: 'Speaking…', li: 'Listening…', tp: 'Tap the mic or an option', pn: 'Enter your PIN yourself',
    err: "Microphone isn't available here. Tap an option instead.",
  },
  te: {
    hi: 'నమస్కారం! మీరు ఏ పంట నిల్వ చేయాలనుకుంటున్నారు? ఎండు మిరప, పసుపు లేదా వేరుశనగ?',
    crop: 'మీరు ఏ పంట నిల్వ చేయాలనుకుంటున్నారు? ఎండు మిరప, పసుపు లేదా వేరుశనగ?',
    qty: 'ఎన్ని క్వింటాళ్లు?',
    mo: 'ఎన్ని నెలలు? రెండు, మూడు లేదా ఆరు?',
    cf: (c: any, q: any, m: any) => `${c}, ${q} క్వింటాళ్లు, ${m} నెలలు, గుంటూరు దగ్గర. గోదాములు వెతకమంటారా? అవును లేదా కాదు అని చెప్పండి.`,
    retry: 'క్షమించండి, అర్థం కాలేదు. దయచేసి మళ్లీ చెప్పండి.',
    intro: (n: any) => `${n} గోదాములు దొరికాయి.`,
    st: (i: any, s: any, t: any) => `${i}వ నంబర్. ${s.name}, ${s.town}. క్వింటాకు నెలకు ${s.rate} రూపాయలు. మొత్తం ${t} రూపాయలు.`,
    pick: (n: any) => `ఏది కావాలి? ఒకటి నుండి ${n} వరకు ఒక సంఖ్య చెప్పండి.`,
    sf: (s: any) => `మీరు ${s.name} ఎంచుకున్నారు. సరైనదేనా? అవును లేదా కాదు అని చెప్పండి.`,
    fin: (s: any, c: any, q: any, m: any, f: any, a: any) => `ఒకసారి సరిచూడండి. ${s.name}. ${c}, ${q} క్వింటాళ్లు, ${m} నెలలు. నిల్వ రుసుము ${f} రూపాయలు. స్థలం కోసం ఇప్పుడు ${a} రూపాయలు చెల్లించాలి. చెల్లింపుకు వెళ్లమంటారా? అవును లేదా కాదు అని చెప్పండి.`,
    pin: 'ఇప్పుడు మీ UPI పిన్ మీరే నమోదు చేయండి. నేను వినను, చూడను.',
    done: 'అయిపోయింది! మీ స్థలం బుక్ అయింది. మీ ఈ-రసీదు స్క్రీన్ మీద ఉంది.',
    none: 'ఇంత పరిమాణానికి ఖాళీ ఉన్న గోదాము లేదు. తక్కువ పరిమాణం ప్రయత్నిద్దాం.',
    again: 'సరే, మళ్లీ మొదలుపెడదాం.',
    y: 'అవును', n: 'కాదు', sp: 'చెబుతున్నాను…', li: 'వింటున్నాను…', tp: 'మైక్ లేదా ఎంపికను నొక్కండి', pn: 'పిన్ మీరే నమోదు చేయండి',
    err: 'ఇక్కడ మైక్ పనిచేయడం లేదు. ఒక ఎంపికను నొక్కండి.',
  },
};

const TN: Record<string, number> = {
  'ఒకటి': 1, 'ఒక': 1, 'రెండు': 2, 'మూడు': 3, 'నాలుగు': 4, 'ఐదు': 5, 'అయిదు': 5, 'ఆరు': 6, 'ఏడు': 7, 'ఎనిమిది': 8, 'తొమ్మిది': 9, 'పది': 10,
  'ఇరవై': 20, 'ముప్పై': 30, 'నలభై': 40, 'యాభై': 50, 'అరవై': 60, 'డెబ్బై': 70, 'ఎనభై': 80, 'తొంబై': 90, 'వంద': 100, 'వందలు': 100,
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100,
};

function num(x: string): number | null {
  x = x.replace(/[౦-౯]/g, (d) => String('౦౧౨౩౪౫౬౭౮౯'.indexOf(d)));
  const m = x.match(/\d+/);
  if (m) return +m[0];
  let s = 0;
  let f = false;
  for (const w of x.toLowerCase().split(/[\s,.]+/)) {
    const v = TN[w];
    if (v) {
      f = true;
      s = v === 100 ? (s || 1) * 100 : s + v;
    }
  }
  return f ? s : null;
}
const pQty = (x: string) => { const n = num(x); return n && n > 0 && n <= 5000 ? n : null; };
const pMo = (x: string) => { const n = num(x); return n && [2, 3, 6].includes(n) ? n : null; };
const pCrop = (x: string) => {
  x = x.toLowerCase();
  return /chill|chili|mirch|మిర/.test(x) ? 0 : /turmeric|haldi|పసుపు/.test(x) ? 1 : /ground|peanut|palli|పల్లీ|వేరుశ/.test(x) ? 2 : null;
};
const pYN = (x: string) => {
  x = x.toLowerCase();
  if (/\b(no|nope|wrong|not|kadu|kaadu|vaddu|vaddhu)\b|కాదు|వద్దు|లేదు|తప్పు/.test(x)) return false;
  if (/\b(yes|yeah|yep|yup|ok|okay|sure|correct|right|avunu|avnu|sare|sari|alage)\b|అవును|ఔను|సరే|సరి|అలాగే|కరెక్ట్/.test(x)) return true;
  return null;
};
const pStore = (x: string, ok: any[]) => {
  const n = num(x);
  if (n && n >= 1 && n <= ok.length) return ok[n - 1];
  x = x.toLowerCase();
  const tests: [RegExp, number][] = [[/lakshmi|laxmi|లక్ష్మి/, 1], [/vijaya|విజయ/, 2], [/kisan|కిసాన్|కిషన్/, 3]];
  for (const [r, id] of tests) if (r.test(x)) { const s = ok.find((q) => q.id === id); if (s) return s; }
  return null;
};

/* ---------- AI understanding (calls the backend) ---------- */
// Sends what the farmer said to the backend. Returns the crop index, quintals
// and months it found (null for anything not said), or null if the call fails.
async function understand(text: string): Promise<{ crop: number | null; qty: number | null; months: number | null } | null> {
  try {
    const r = await fetch(`${API}/understand/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const crop = d.crop === 'chilli' ? 0 : d.crop === 'turmeric' ? 1 : d.crop === 'groundnut' ? 2 : null;
    const qty = d.quintals && d.quintals > 0 && d.quintals <= 5000 ? d.quintals : null;
    const months = [2, 3, 6].includes(d.months) ? d.months : null;
    return { crop, qty, months };
  } catch (_) {
    return null;
  }
}

/* ---------- small UI pieces ---------- */
/* ----- Telugu screen labels ----- */
const TE: Record<string, string> = {
  'Storage & Godowns': 'నిల్వ & గోదాములు',
  'Book · Hold': 'బుక్ · హోల్డ్',
  'Book': 'బుక్',
  'Hold': 'హోల్డ్',
  'Warehouse': 'గోదాము',
  'Cold store': 'కోల్డ్ స్టోర్',
  'Maps': 'మ్యాప్',
  'Nearby': 'దగ్గరలో',
  'Near me': 'నా దగ్గర',
  'Guntur, Andhra Pradesh': 'గుంటూరు, ఆంధ్రప్రదేశ్',
  'Crop': 'పంట',
  'Quantity (quintals)': 'పరిమాణం (క్వింటాళ్లు)',
  'Period (months)': 'కాలం (నెలలు)',
  'Period': 'కాలం',
  'SEARCH': 'వెతకండి',
  'Stores near you': 'మీ దగ్గరి గోదాములు',
  'Reserve slot': 'స్లాట్ రిజర్వ్ చేయండి',
  'Enter UPI PIN': 'UPI పిన్ నమోదు చేయండి',
  'Your e-receipt': 'మీ ఇ-రసీదు',
  'Registered': 'నమోదైనది',
  'Filling fast': 'త్వరగా నిండుతోంది',
  'Not enough space': 'స్థలం సరిపోదు',
  'Reserve': 'రిజర్వ్ చేయండి',
  'quintals': 'క్వింటాళ్లు',
  'months': 'నెలలు',
  'quintals free': 'క్వింటాళ్లు ఖాళీ',
  'Insurance': 'బీమా',
  'per quintal': 'క్వింటాలుకు',
  'per quintal / month': 'క్వింటాలుకు / నెలకు',
  'Total': 'మొత్తం',
  'Storage fee': 'నిల్వ రుసుము',
  'Pay now to hold slot (10%)': 'స్లాట్ కోసం ఇప్పుడే చెల్లించండి (10%)',
  'The rest is paid when you take out your produce.': 'మిగతాది మీ పంటను తీసుకెళ్లేటప్పుడు చెల్లించాలి.',
  'Pay with UPI': 'UPI తో చెల్లించండి',
  'Only you enter your PIN. Nobody else hears or sees it.': 'మీ పిన్ మీరే నమోదు చేయండి. ఇతరులు వినలేరు, చూడలేరు.',
  'Warehouse receipt': 'గోదాము రసీదు',
  'Active': 'క్రియాశీలం',
  'Grade': 'గ్రేడ్',
  'Advance paid': 'ముందస్తు చెల్లింపు',
  'No.': 'నం.',
  'Book another slot': 'మరో స్లాట్ బుక్ చేయండి',
  'Schematic map': 'సూచనా పటం',
  'Loading stores…': 'గోదాములు లోడ్ అవుతున్నాయి…',
  'No stores of this type yet.': 'ఈ రకం గోదాములు ఇంకా లేవు.',
  'Mangalagiri': 'మంగళగిరి',
  'Tenali': 'తెనాలి',
  'Guntur': 'గుంటూరు',
};
let CUR = 'en';
const T = (x: string) => (CUR === 'te' && TE[x]) || x;

const Lang = ({ dark, lang, onPick }: { dark?: boolean; lang: string; onPick: (l: string) => void }) => (
  <div style={{ display: 'flex', background: dark ? 'rgba(255,255,255,.2)' : '#EEF0E8', borderRadius: '12px', padding: '3px' }}>
    {[['en', 'EN'], ['te', 'తె']].map(([k, v]) => (
      <button key={k} onClick={() => onPick(k)} style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 800, fontSize: '12px', padding: '6px 10px', borderRadius: '9px', background: lang === k ? '#FFF' : 'transparent', color: lang === k ? C.g : dark ? '#FFF' : C.mute }}>{v}</button>
    ))}
  </div>
);

const SparkBtn = ({ on, dark, onClick }: { on: boolean; dark?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-label="AI mode"
    aria-pressed={on}
    style={{
      width: '38px', height: '38px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: on ? 'none' : `1px solid ${dark ? 'rgba(255,255,255,.35)' : C.line}`,
      background: on ? 'linear-gradient(135deg,#4F8CFF,#9B5CFF 55%,#FF5CAA)' : 'transparent',
    }}
  >
    <Ic n="spark" color={on || dark ? '#FFF' : C.g} />
  </button>
);

const Tile = ({ cold }: { cold: boolean }) => (
  <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: C.g2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <Ic n={cold ? 'snow' : 'warehouse'} size={23} />
  </div>
);

const Pill = ({ bg, color, icon, children }: { bg: string; color: string; icon?: string; children: React.ReactNode }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: bg, color, fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '10px' }}>
    {icon && <Ic n={icon} size={12} color={color} sw={2} />}
    {children}
  </span>
);

const Stepper = ({ done }: { done?: boolean }) => {
  const dot = (state: 'active' | 'idle' | 'done', n: string) => (
    <div style={{ width: '28px', height: '28px', margin: '0 auto', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, background: state === 'done' ? C.g : '#FFF', color: state === 'active' ? C.g : C.mute, border: `2px solid ${state === 'idle' ? C.line : C.g}` }}>
      {state === 'done' ? <Ic n="check" size={14} color="#FFF" sw={2.6} /> : n}
    </div>
  );
  const lab = (t: string, strong: boolean) => <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: strong ? 800 : 600, color: strong ? C.ink : C.mute }}>{t}</div>;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '4px 40px' }}>
      <div style={{ textAlign: 'center', width: '44px' }}>{dot(done ? 'done' : 'active', '1')}{lab(T('Book'), !done)}</div>
      <div style={{ flex: 1, height: '2px', background: done ? C.g : C.line, marginTop: '13px' }} />
      <div style={{ textAlign: 'center', width: '44px' }}>{dot(done ? 'active' : 'idle', '2')}{lab(T('Hold'), !!done)}</div>
    </div>
  );
};

const Line = ({ a, b, green, last }: { a: string; b: string; green?: boolean; last?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: last ? 'none' : `1px solid ${C.line}`, fontSize: '15px' }}>
    <span style={{ color: C.mute }}>{T(a)}</span>
    <span style={{ color: green ? C.g : C.ink, fontWeight: 800, textAlign: 'right' }}>{b}</span>
  </div>
);

const Field = ({ icon, label, last, right, children }: { icon: string; label: string; last?: boolean; right?: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderBottom: last ? 'none' : `1px solid ${C.line}` }}>
    <Ic n={icon} size={20} color={C.mute} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '11px', color: C.mute, fontWeight: 600 }}>{T(label)}</div>
      {children}
    </div>
    {right}
  </div>
);

const Tabs = ({ active, onPick }: { active: 'warehouse' | 'cold_store' | 'maps'; onPick: (t: 'warehouse' | 'cold_store' | 'maps') => void }) => {
  const items: ['warehouse' | 'cold_store' | 'maps', string, string][] = [
    ['warehouse', 'Warehouse', 'warehouse'],
    ['cold_store', 'Cold store', 'snow'],
    ['maps', 'Maps', 'pin'],
  ];
  return (
    <div style={{ display: 'flex', borderBottom: `1px solid ${C.line}` }}>
      {items.map(([k, text, icon]) => {
        const on = active === k;
        return (
          <button key={k} onClick={() => onPick(k)} style={{ flex: 1, background: 'none', border: 'none', borderBottom: `2px solid ${on ? C.g : 'transparent'}`, marginBottom: '-1px', padding: '14px 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 800, color: on ? C.g : C.mute }}>
            <Ic n={icon} size={16} color={on ? C.g : C.mute} />
            {T(text)}
          </button>
        );
      })}
    </div>
  );
};

const CompactCard = ({ s, onPick }: { s: any; onPick: (id: number) => void }) => (
  <div onClick={() => !s.full && onPick(s.id)} style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', cursor: s.full ? 'default' : 'pointer', opacity: s.full ? 0.55 : 1 }}>
    <Tile cold={s.cold} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '15px', fontWeight: 800, color: C.ink }}>{s.name}</div>
      <div style={{ fontSize: '13px', color: C.mute }}>{T(s.location)} · {s.km} km</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: '17px', fontWeight: 800, color: C.ink }}>₹{s.rate}</div>
      <div style={{ fontSize: '12px', color: C.mute }}>{T('per quintal')}</div>
    </div>
  </div>
);

const FullCard = ({ s, onPick }: { s: any; onPick: (id: number) => void }) => (
  <div style={{ ...card, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
      <Tile cold={s.cold} />
      <div>
        <div style={{ fontSize: '15px', fontWeight: 800, color: C.ink }}>{s.name}</div>
        <div style={{ fontSize: '13px', color: C.mute }}>{T(s.location)} · {s.km} km</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {s.registered && <Pill bg={C.g2} color={C.g} icon="shield">{T('Registered')}</Pill>}
      {s.full ? <Pill bg={C.redBg} color={C.red}>{T('Not enough space')}</Pill> : s.fast ? <Pill bg={C.warnBg} color={C.warnTx}>{T('Filling fast')}</Pill> : null}
    </div>
    <div style={{ height: '6px', borderRadius: '3px', background: C.line, overflow: 'hidden' }}>
      <div style={{ width: `${s.usedPct}%`, height: '100%', background: C.g }} />
    </div>
    <div style={{ fontSize: '13px', color: C.mute }}>{inr(s.free)} {T('quintals free')} · {T('Insurance')} ₹{inr(s.insured)}/t</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
      <div>
        <div>
          <span style={{ fontSize: '24px', fontWeight: 800, color: C.ink }}>₹{s.rate}</span>
          <span style={{ fontSize: '13px', color: C.mute }}>{' '}{T('per quintal / month')}</span>
        </div>
        <div style={{ fontSize: '12px', color: C.mute }}>{T('Total')} ₹{inr(s.total)}</div>
      </div>
      <button disabled={s.full} onClick={() => onPick(s.id)} style={{ background: s.full ? C.line : C.g, color: s.full ? C.mute : '#FFF', border: 'none', borderRadius: '12px', padding: '13px 24px', fontFamily: 'inherit', fontWeight: 800, fontSize: '15px', cursor: s.full ? 'not-allowed' : 'pointer' }}>
        {T('Reserve')}
      </button>
    </div>
  </div>
);

const Pin = ({ x, y, cold }: { x: number; y: number; cold: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 0C-8-10-18-20-18-34A18 18 0 0 1 18-34C18-20 8-10 0 0Z" fill={cold ? C.blue : C.g} stroke="#FFF" strokeWidth="2" />
    <g transform="translate(-9 -43) scale(.75)" fill="none" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d={cold ? ICON.snow : ICON.warehouse} />
    </g>
  </g>
);

const MapView = ({ stores }: { stores: any[] }) => {
  const spots = [[225, 62], [78, 150], [300, 210]];
  const pts = stores.slice(0, 3).map((s, i) => ({ s, x: spots[i][0], y: spots[i][1] }));
  const road = pts.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <div style={{ ...card, overflow: 'hidden' }}>
      <svg viewBox="0 0 358 240" width="100%" style={{ display: 'block', background: '#EDF1E9' }}>
        <path d="M0 18C60 4 120 34 180 20S300 6 358 22V46C300 30 240 50 180 42S60 24 0 42Z" fill="#B6D8EC" />
        <polyline points={road} fill="none" stroke="#D9DFD1" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={road} fill="none" stroke="#FFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="52" cy="190" r="14" fill="#BBD3F2" opacity=".8" />
        <circle cx="52" cy="190" r="5.5" fill={C.blue} stroke="#FFF" strokeWidth="2" />
        <text x="52" y="216" textAnchor="middle" fontSize="11" fontWeight="800" fill={C.blue}>You</text>
        {pts.map((p) => <Pin key={p.s.id} x={p.x} y={p.y} cold={p.s.cold} />)}
      </svg>
    </div>
  );
};

/* ---------- the app ---------- */
export function Router() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [activeTab, setActiveTab] = useState<'warehouse' | 'cold_store' | 'maps'>('warehouse');
  const [crop, setCrop] = useState('Dry chilli');
  const [quintals, setQuintals] = useState('20');
  const [months, setMonths] = useState('3');
  const [rawStores, setRawStores] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [pinCode, setPinCode] = useState('');
  const [lang, setLang] = useState('en');

  // AI mode
  const [aiOpen, setAiOpen] = useState(false);
  const [aq, setAq] = useState('');
  const [atx, setAtx] = useState('');
  const [astate, setAstate] = useState('');
  const [achips, setAchips] = useState<{ l: string; v: any }[]>([]);
  const [aerr, setAerr] = useState(false);

  const A = useRef<any>({ on: false, run: 0, nav: false, rec: null, cb: null, parse: null });
  const ctx = useRef<any>({ screen: 'home', crop: 'Dry chilli', qty: 20, months: 3, storeId: null, lang: 'en', stores: [] });

  useEffect(() => {
    fetch(`${API}/stores`)
      .then((r) => {
        if (!r.ok) throw new Error('bad response');
        return r.json();
      })
      .then(setRawStores)
      .catch(() => setError('Could not load stores. Is the backend running?'));
    return () => stopMic();
  }, []);

  const q = Math.max(0, Number(quintals) || 0);
  const m = Math.max(0, Number(months) || 0);

  const stores = rawStores.map((s) => ({
    id: s.id,
    name: s.name,
    town: s.town,
    location: s.town,
    rate: s.rate,
    free: s.free,
    insured: s.insured_per_tonne,
    registered: s.registered,
    cold: isCold(s),
    km: kmFrom(s.lat, s.lon),
    total: s.rate * q * m,
    full: s.free < q,
    fast: s.free >= q && s.free < 200,
    usedPct: Math.min(100, Math.max(0, Math.round(((s.capacity - s.free) / s.capacity) * 100))),
  }));
  ctx.current.stores = stores;
  ctx.current.lang = lang;
  CUR = lang;

  const homeList = stores.filter((s) => (activeTab === 'cold_store' ? s.cold : activeTab === 'warehouse' ? !s.cold : true));
  const selected = stores.find((s) => s.id === selectedId) || stores[0];
  const advance = selected ? Math.round(selected.total * 0.1) : 0;
  const searchOff = !crop.trim() || q < 1 || m < 1;

  /* ----- navigation ----- */
  function go(s: ScreenType) {
    ctx.current.screen = s;
    setCurrentScreen(s);
    window.scrollTo(0, 0);
    if (A.current.on) {
      if (A.current.nav) A.current.nav = false;
      else agent();
    }
  }
  function nav(s: ScreenType) {
    A.current.nav = true;
    go(s);
  }
  function pickTab(t: 'warehouse' | 'cold_store' | 'maps') {
    setActiveTab(t);
    const s: ScreenType = t === 'maps' ? 'map' : 'home';
    ctx.current.screen = s;
    setCurrentScreen(s);
  }
  function pickStore(id: number) {
    ctx.current.storeId = id;
    setSelectedId(id);
    go('reserve');
  }
  function back() {
    if (currentScreen === 'reserve') go('stores');
    else if (currentScreen === 'pin') go('reserve');
    else go('home');
  }
  function changeLang(l: string) {
    ctx.current.lang = l;
    setLang(l);
    if (A.current.on) agent();
  }

  /* ----- voice helpers ----- */
  const vl = () => (ctx.current.lang === 'te' ? 'te-IN' : 'en-IN');
  const E = () => V[ctx.current.lang];
  const cl = () => {
    const c = CROPS.find((x) => x.en.toLowerCase() === String(ctx.current.crop).toLowerCase());
    return c ? (c as any)[ctx.current.lang] : ctx.current.crop;
  };

  function stopMic() {
    try { A.current.rec && A.current.rec.abort(); } catch (_) { /* ignore */ }
    A.current.rec = null;
    try { (window as any).speechSynthesis && (window as any).speechSynthesis.cancel(); } catch (_) { /* ignore */ }
  }

  function say(text: string, cb?: () => void) {
    const id = A.current.run;
    setAq(text);
    setAstate('speak');
    let f = cb;
    const fin = () => {
      if (id === A.current.run && f) {
        const g = f;
        f = undefined;
        g();
      }
    };
    const synth = (window as any).speechSynthesis;
    if (!synth) {
      setTimeout(fin, Math.min(text.length * 60, 5000));
      return;
    }
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = vl();
      const want = ctx.current.lang === 'te' ? 'te' : 'en';
      const v = synth.getVoices().find((x: any) => x.lang.replace('_', '-').toLowerCase().startsWith(want));
      if (v) u.voice = v;
      u.onend = fin;
      u.onerror = fin;
      synth.speak(u);
    } catch (_) { /* ignore */ }
    setTimeout(fin, Math.min(text.length * 110 + 2500, 45000));
  }

  // `parse` may be instant (returns a value) or async (returns a Promise),
  // so the first question can ask the backend AI what the farmer said.
  function listen(parse: (x: string) => any, done: (v: any) => void, n = 0) {
    const id = A.current.run;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setAstate('tap');
      setAerr(true);
      return;
    }
    const r = new SR();
    A.current.rec = r;
    r.lang = vl();
    r.interimResults = true;
    r.maxAlternatives = 3;
    let got = false;
    setAstate('listen');
    setAtx('');
    const retry = () => {
      if (n < 2) say(E().retry, () => listen(parse, done, n + 1));
      else setAstate('tap');
    };
    r.onresult = async (e: any) => {
      if (id !== A.current.run) return;
      const x = e.results[e.results.length - 1];
      setAtx(x[0].transcript);
      if (x.isFinal) {
        got = true;
        let v: any = null;
        for (const a of Array.from(x) as any[]) {
          v = await parse(a.transcript);
          if (v != null) break;
        }
        if (id !== A.current.run) return;
        if (v != null) done(v);
        else retry();
      }
    };
    r.onerror = () => {
      if (id !== A.current.run) return;
      got = true;
      setAerr(true);
      setAstate('tap');
    };
    r.onend = () => {
      if (id === A.current.run && !got) {
        if (n < 1) listen(parse, done, n + 1);
        else setAstate('tap');
      }
    };
    try { r.start(); } catch (_) { setAstate('tap'); }
  }

  function ask(question: string, chips: { l: string; v: any }[], parse: (x: string) => any, done: (v: any) => void) {
    A.current.run++;
    setAchips(chips);
    A.current.cb = done;
    A.current.parse = parse;
    setAtx('');
    setAerr(false);
    stopMic();
    say(question, () => listen(parse, done));
  }

  function chipTap(i: number) {
    const c = achips[i];
    if (!c) return;
    A.current.run++;
    stopMic();
    A.current.cb(c.v);
  }

  function micTap() {
    const was = astate === 'listen';
    A.current.run++;
    stopMic();
    if (was) setAstate('tap');
    else if (A.current.parse) {
      setAerr(false);
      listen(A.current.parse, A.current.cb);
    }
  }

  /* ----- the conversation ----- */
  const YN = () => [{ l: E().y, v: true }, { l: E().n, v: false }];
  const nums = (a: number[]) => a.map((n) => ({ l: String(n), v: n }));

  // First question. The farmer can answer with just the crop, or say everything
  // in one sentence ("20 quintals chilli 3 months"). The backend AI reads it,
  // and the app skips straight to the first detail that is still missing.
  function sCrop(first?: boolean) {
    const parse = async (x: string) => {
      const c = pCrop(x);
      const u = await understand(x);
      if (u && (u.crop != null || u.qty != null || u.months != null)) {
        return { crop: u.crop ?? c, qty: u.qty, months: u.months };
      }
      return c != null ? { crop: c, qty: null, months: null } : null;
    };
    ask(first ? E().hi : E().crop, CROPS.map((c, i) => ({ l: (c as any)[ctx.current.lang], v: i })), parse, (v) => {
      // Tapping a crop chip gives a plain number; speech gives an object.
      const r = typeof v === 'number' ? { crop: v, qty: null, months: null } : v;
      if (r.crop != null) { ctx.current.crop = CROPS[r.crop].en; setCrop(CROPS[r.crop].en); }
      if (r.qty != null) { ctx.current.qty = r.qty; setQuintals(String(r.qty)); }
      if (r.months != null) { ctx.current.months = r.months; setMonths(String(r.months)); }
      if (r.crop == null) sCrop(false);
      else if (r.qty == null) sQty();
      else if (r.months == null) sMo();
      else sCf();
    });
  }
  function sQty() {
    ask(E().qty, nums([10, 20, 50, 100]), pQty, (v) => {
      ctx.current.qty = v;
      setQuintals(String(v));
      sMo();
    });
  }
  function sMo() {
    ask(E().mo, nums([2, 3, 6]), pMo, (v) => {
      ctx.current.months = v;
      setMonths(String(v));
      sCf();
    });
  }
  function sCf() {
    ask(E().cf(cl(), ctx.current.qty, ctx.current.months), YN(), pYN, (v) => {
      if (v) {
        nav('stores');
        sStore();
      } else say(E().again, () => sCrop(false));
    });
  }
  function sStore() {
    const ok = ctx.current.stores.filter((s: any) => s.free >= ctx.current.qty);
    if (!ok.length) {
      say(E().none, () => {
        nav('home');
        sQty();
      });
      return;
    }
    const text = E().intro(ok.length) + ' ' + ok.map((s: any, i: number) => E().st(i + 1, s, s.rate * ctx.current.qty * ctx.current.months)).join(' ') + ' ' + E().pick(ok.length);
    ask(text, ok.map((s: any, i: number) => ({ l: `${i + 1}. ${s.town}`, v: s })), (x) => pStore(x, ok), (s) => sConf(s));
  }
  function sConf(s: any) {
    ask(E().sf(s), YN(), pYN, (v) => {
      if (v) {
        ctx.current.storeId = s.id;
        setSelectedId(s.id);
        nav('reserve');
        sFinal();
      } else sStore();
    });
  }
  function sFinal() {
    const s = ctx.current.stores.find((x: any) => x.id === ctx.current.storeId) || ctx.current.stores[0];
    if (!s) return;
    const fee = s.rate * ctx.current.qty * ctx.current.months;
    const adv = Math.round(fee * 0.1);
    ask(E().fin(s, cl(), ctx.current.qty, ctx.current.months, fee, adv), YN(), pYN, (v) => {
      if (v) {
        nav('pin');
        sPin();
      } else say(E().again, () => {
        nav('home');
        sCrop(false);
      });
    });
  }
  function sPin() {
    A.current.run++;
    stopMic();
    setAchips([]);
    setAtx('');
    A.current.parse = null;
    say(E().pin, () => setAstate('idle'));
  }
  function agent(first?: boolean) {
    if (!A.current.on) return;
    let s = ctx.current.screen;
    if (s === 'map') {
      s = 'home';
      ctx.current.screen = 'home';
      setCurrentScreen('home');
      setActiveTab('warehouse');
    }
    if (s === 'home') sCrop(first);
    else if (s === 'stores') sStore();
    else if (s === 'reserve') sFinal();
    else if (s === 'pin') sPin();
    else {
      A.current.run++;
      stopMic();
      setAchips([]);
      A.current.parse = null;
      setAtx('');
      setAstate('idle');
      setAq(E().done);
    }
  }
  function toggleAI() {
    const on = !A.current.on;
    A.current.on = on;
    setAiOpen(on);
    if (on) agent(true);
    else {
      A.current.run++;
      stopMic();
      setAq('');
      setAtx('');
      setAchips([]);
      setAstate('');
    }
  }

  /* ----- PIN keypad ----- */
  function key(k: string) {
    if (k === '⌫') setPinCode((p) => p.slice(0, -1));
    else setPinCode((p) => (p.length < 6 ? p + k : p));
  }
  useEffect(() => {
    if (pinCode.length !== 6) return;
    const t = setTimeout(() => {
      setPinCode('');
      nav('receipt');
      if (A.current.on) {
        A.current.run++;
        stopMic();
        setAchips([]);
        A.current.parse = null;
        say(E().done, () => setAstate('idle'));
      }
    }, 350);
    return () => clearTimeout(t);
  }, [pinCode]);

  /* ----- layout ----- */
  const hero = currentScreen === 'home' || currentScreen === 'map';
  const titles: Record<string, string> = { stores: T('Stores near you'), reserve: T('Reserve slot'), pin: T('Enter UPI PIN'), receipt: T('Your e-receipt') };
  const pad = { padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' } as const;
  const e = V[lang];
  const status: Record<string, string> = { speak: e.sp, listen: e.li, tap: e.tp, idle: e.pn };

  return (
    <div style={{ width: '100%', maxWidth: '430px', margin: '0 auto', backgroundColor: C.bg, color: C.ink, minHeight: '100vh', fontFamily: 'Mukta, "Noto Sans Telugu", system-ui, sans-serif', boxShadow: '0 20px 60px rgba(0,0,0,.25)', boxSizing: 'border-box', paddingBottom: aiOpen ? '330px' : 0 }}>
      <style>{css}</style>
      {aiOpen && <div className="glow" aria-hidden="true" />}

      {hero ? (
        <div style={{ background: C.g, color: '#FFF', padding: '16px 20px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Ic n="menu" size={24} color="#FFF" />
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <SparkBtn dark on={aiOpen} onClick={toggleAI} />
              <Lang dark lang={lang} onPick={changeLang} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '18px', lineHeight: 1.15 }}>{T('Storage & Godowns')}</div>
          <div style={{ fontSize: '14px', opacity: 0.85, marginTop: '2px' }}>{T('Book · Hold')}</div>
        </div>
      ) : (
        <div style={{ background: '#FFF', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid ${C.line}` }}>
          {currentScreen !== 'receipt' ? (
            <button onClick={back} aria-label="Back" style={{ width: '40px', height: '40px', borderRadius: '12px', border: `1px solid ${C.line}`, background: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="back" size={20} color={C.ink} sw={2.2} />
            </button>
          ) : (
            <div style={{ width: '40px' }} />
          )}
          <div style={{ flex: 1, fontSize: '17px', fontWeight: 800 }}>{titles[currentScreen]}</div>
          <SparkBtn on={aiOpen} onClick={toggleAI} />
          <Lang lang={lang} onPick={changeLang} />
        </div>
      )}

      {error && <div style={{ ...card, margin: '16px', padding: '12px', color: C.red, fontSize: '14px' }}>{error}</div>}

      {/* HOME */}
      {currentScreen === 'home' && (
        <>
          <div style={{ margin: '-28px 16px 0', ...card, boxShadow: '0 8px 24px rgba(0,0,0,.08)', overflow: 'hidden' }}>
            <Tabs active={activeTab} onPick={pickTab} />
            <Field icon="search" label="Nearby" right={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', border: `1px solid ${C.line}`, borderRadius: '20px', padding: '7px 12px', fontSize: '13px', fontWeight: 800, color: C.g }}>
                <Ic n="near" size={14} /> {T('Near me')}
              </span>
            }>
              <div style={{ fontSize: '16px', fontWeight: 800 }}>{T('Guntur, Andhra Pradesh')}</div>
            </Field>
            <Field icon="wheat" label="Crop">
              <input style={fieldInput} value={crop} onChange={(ev) => { setCrop(ev.target.value); ctx.current.crop = ev.target.value; }} placeholder="e.g. Dry chilli" />
            </Field>
            <Field icon="weight" label="Quantity (quintals)">
              <input style={fieldInput} type="number" min="1" value={quintals} onChange={(ev) => { setQuintals(ev.target.value); ctx.current.qty = Number(ev.target.value) || 0; }} />
            </Field>
            <Field icon="cal" label="Period (months)" last>
              <input style={fieldInput} type="number" min="1" value={months} onChange={(ev) => { setMonths(ev.target.value); ctx.current.months = Number(ev.target.value) || 0; }} />
            </Field>
            <div style={{ padding: '4px 16px 16px' }}>
              <button disabled={searchOff} onClick={() => go('stores')} style={{ ...primary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: searchOff ? 0.5 : 1 }}>
                <Ic n="search" size={16} color="#FFF" sw={2.2} /> {T('SEARCH')}
              </button>
            </div>
          </div>

          <div style={pad}>
            <div style={{ fontSize: '17px', fontWeight: 800 }}>{T('Stores near you')}</div>
            {homeList.map((s) => <CompactCard key={s.id} s={s} onPick={pickStore} />)}
            {!error && rawStores.length > 0 && homeList.length === 0 && <div style={{ color: C.mute, fontSize: '14px' }}>{T('No stores of this type yet.')}</div>}
            {!error && rawStores.length === 0 && <div style={{ color: C.mute, fontSize: '14px' }}>{T('Loading stores…')}</div>}
          </div>
        </>
      )}

      {/* MAP */}
      {currentScreen === 'map' && (
        <>
          <div style={{ margin: '-28px 16px 0', ...card, borderRadius: '16px 16px 0 0', boxShadow: '0 8px 24px rgba(0,0,0,.08)', overflow: 'hidden' }}>
            <Tabs active="maps" onPick={pickTab} />
          </div>
          <div style={pad}>
            <MapView stores={stores} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', fontWeight: 800 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.g, display: 'inline-block' }} />{T('Warehouse')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><i style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.blue, display: 'inline-block' }} />{T('Cold store')}</span>
              <span style={{ marginLeft: 'auto', color: C.mute, fontWeight: 600 }}>{T('Schematic map')}</span>
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px' }}>{T('Stores near you')}</div>
            {stores.map((s) => <CompactCard key={s.id} s={s} onPick={pickStore} />)}
          </div>
        </>
      )}

      {/* STORE LIST */}
      {currentScreen === 'stores' && (
        <div style={pad}>
          <Stepper />
          <div style={{ fontSize: '13px', color: C.mute }}>{q} ({T('quintals')}) · {crop} · {m} {T('months')}</div>
          {stores.map((s) => <FullCard key={s.id} s={s} onPick={pickStore} />)}
        </div>
      )}

      {/* RESERVE */}
      {currentScreen === 'reserve' && selected && (
        <div style={pad}>
          <Stepper />
          <div style={{ ...card, padding: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', paddingBottom: '10px' }}>
              <Tile cold={selected.cold} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800 }}>{selected.name}</div>
                <div style={{ fontSize: '13px', color: C.mute }}>{T(selected.location)}</div>
              </div>
            </div>
            <Line a="Crop" b={crop} />
            <Line a="Quantity (quintals)" b={String(q)} />
            <Line a="Period" b={`${m} ${T('months')}`} />
            <Line a="Storage fee" b={`₹${inr(selected.total)}`} />
            <Line a="Pay now to hold slot (10%)" b={`₹${inr(advance)}`} green last />
          </div>
          <div style={{ fontSize: '13px', color: C.mute }}>{T('The rest is paid when you take out your produce.')}</div>
          <button onClick={() => go('pin')} style={primary}>{T('Pay with UPI')} · ₹{inr(advance)}</button>
        </div>
      )}

      {/* PIN */}
      {currentScreen === 'pin' && selected && (
        <div style={pad}>
          <Stepper />
          <div style={{ ...card, padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: C.g2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="shield" size={24} />
            </div>
            <div style={{ fontSize: '14px', color: C.mute }}>{selected.name}</div>
            <div style={{ fontSize: '26px', fontWeight: 800 }}>₹{inr(advance)}</div>
            <div style={{ display: 'flex', gap: '12px', margin: '8px 0' }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <i key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${C.g}`, background: i < pinCode.length ? C.g : 'transparent', display: 'inline-block' }} />
              ))}
            </div>
            <div style={{ fontSize: '14px', color: C.mute }}>{T('Only you enter your PIN. Nobody else hears or sees it.')}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) =>
              k === '' ? <span key={i} /> : (
                <button key={i} onClick={() => key(k)} aria-label={k} style={{ height: '56px', borderRadius: '14px', border: `1px solid ${C.line}`, background: '#FFF', color: C.ink, fontFamily: 'inherit', fontSize: '22px', fontWeight: 600, cursor: 'pointer' }}>{k}</button>
              )
            )}
          </div>
        </div>
      )}

      {/* RECEIPT (demo data for now) */}
      {currentScreen === 'receipt' && selected && (
        <div style={pad}>
          <Stepper done />
          <div style={{ ...card, overflow: 'hidden' }}>
            <div style={{ background: C.g, color: '#FFF', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px dashed #FFF' }}>
              <span style={{ fontSize: '16px', fontWeight: 800 }}>{T('Warehouse receipt')}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(255,255,255,.9)', color: C.g, fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '12px' }}>
                <Ic n="check" size={12} sw={2.6} /> {T('Active')}
              </span>
            </div>
            <div style={{ padding: '4px 16px 10px' }}>
              <Line a={selected.name} b={T(selected.location)} />
              <Line a={crop} b={String(q)} />
              <Line a="Grade" b="A" />
              <Line a="Insurance" b={`₹${inr(selected.insured)}/t`} />
              <Line a="Advance paid" b={`₹${inr(advance)}`} />
              <Line a="No." b="GDM-2026-0418" last />
            </div>
          </div>
          <button onClick={() => go('home')} style={outline}>{T('Book another slot')}</button>
        </div>
      )}

      {/* AI PANEL */}
      {aiOpen && (
        <div role="region" aria-live="polite" aria-label="AI mode" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: '#FFF', borderRadius: '20px 20px 0 0', padding: '14px 16px 18px', zIndex: 60, boxShadow: '0 -10px 30px rgba(0,0,0,.2)', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '52%', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: C.g }}>{status[astate] || ''}</span>
            <button onClick={toggleAI} aria-label="Stop" style={{ width: '36px', height: '36px', borderRadius: '10px', border: `1px solid ${C.line}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic n="x" size={18} color={C.ink} />
            </button>
          </div>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 800, lineHeight: 1.35, maxHeight: '110px', overflow: 'auto' }}>{aq}</p>
          {currentScreen !== 'pin' && (
            <>
              {atx && <p style={{ margin: 0, fontSize: '14px', color: C.mute }}>“{atx}”</p>}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {achips.map((c, i) => (
                  <button key={i} onClick={() => chipTap(i)} style={{ border: `1px solid ${C.line}`, background: C.g2, color: C.ink, borderRadius: '20px', padding: '8px 14px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>{c.l}</button>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className={astate === 'listen' ? 'micon' : ''} onClick={micTap} aria-label="Mic" disabled={astate === 'idle'} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg,#4F8CFF,#9B5CFF 55%,#FF5CAA)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: astate === 'idle' ? 0.4 : 1 }}>
                  <Ic n="mic" size={26} color="#FFF" />
                </button>
              </div>
              {aerr && <p style={{ margin: 0, fontSize: '14px', color: C.mute }}>{e.err}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
