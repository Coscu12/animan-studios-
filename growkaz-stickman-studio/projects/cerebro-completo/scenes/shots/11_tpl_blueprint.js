// shots/11_tpl_blueprint.js — blueprint/graphic templates: chapter cards, big lines, tips, brain states, Skinner, balance, attention data, etc.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, seg, circle, ring, rr, poly, glow, alpha, shade, text, FONTS, rng } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { dormitorio } from '../sets/dormitorio.js';
import { sabana } from '../sets/sabana.js';
import { brain, pathway, spark, rewardIcon, label } from '../sets/cerebro.js';
import { wt, at, outA } from '../sets/util.js';
import { icon, ICOL } from './10_tpl_people.js';

const BP = (g, t) => { UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); };
const zoom = (g, t, info, z0 = 1, z1 = 1.06) => { const z = lerp(z0, z1, ease.inOut(t / info.dur)); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };
const lf = (g, x, y, s, pose, color) => UI.lineFigure(g, { x, y, s, pose: POSES[pose] || pose, color: color || UI.bpStroke() });
const T = {};

T.chapter = (g, t, info) => {
  const p = info, cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -8 * t };
  if (p.bg === 'room') dormitorio(g, t, cam); else if (p.bg === 'dawn') dormitorio(g, t, cam, { mood: 'golden' }); else if (p.bg === 'sabana') sabana(g, t, cam, { mood: 'dusk', sunX: 0, treeX: E.W / 2 - V(820, 380) }); else BP(g, t);
  veil(g, '#03100c', 0.35); FX.dust(g, t, { count: 40, color: '#ffe2a0', a: 0.3 });
  UI.titleCard(g, t, { lines: p.lines, dur: info.dur, y: E.H * V(0.45, 0.4) });
};
T.bigText = (g, t, info) => {
  const p = info; if (p.bg === 'room') { blurLayer(g, 12, (g) => dormitorio(g, t, { z: 1.3 })); veil(g, '#03100c', 0.55); } else if (p.bg === 'dawn') { blurLayer(g, 12, (g) => dormitorio(g, t, { z: 1.3 }, { mood: 'golden' })); veil(g, '#03100c', 0.45); } else BP(g, t);
  g.save(); zoom(g, t, info, 1.0, 1.05);
  const L = p.lines, n = L.length, gap = V(120, 130), y0 = E.H / 2 - ((n - 1) * gap) / 2;
  L.forEach(([w, str, col, size], i) => { const tt = wt(w, info), a = ease.out(prog(t, tt - 0.1, tt + 0.35)) * outA(t, info); if (a <= 0) return; const c = col ? S().ui[col] : S().ui.cream; const sz = Math.min(size || V(80, 70), (E.W * 0.88) / Math.max(1, str.length * 0.62)); g.save(); g.translate(E.W / 2, y0 + i * gap); g.scale(0.9 + 0.1 * ease.outBack(clamp(a)), 0.9 + 0.1 * ease.outBack(clamp(a))); text(g, str, 0, 0, { size: sz, color: c, glow: 24, glowColor: alpha(c, 0.6), spacing: 3, alpha: a }); g.restore(); });
  if (p.strike) { const tt = wt(p.strike, info), k = ease.out(prog(t, tt, tt + 0.3)); if (k > 0) { seg(g, [[E.W * 0.2, E.H * 0.3], [E.W * 0.2 + k * E.W * 0.6, E.H * 0.7]], 12, S().ui.accent); } }
  g.restore();
};
T.tip = (g, t, info) => {
  const p = info, ui = S().ui; BP(g, t); g.save(); zoom(g, t, info, 1.04, 1.0);
  const a = ease.outBack(prog(t, 0, 0.5)); const nx = E.W * V(0.3, 0.5), ny = E.H * V(0.5, 0.36);
  glow(g, nx, ny, 380, ui.gold, 0.35 * a); ring(g, nx, ny, 190 * a, 8, ui.gold); text(g, String(p.n), nx, ny + 10, { size: 240 * a, color: ui.gold, glow: 40, glowColor: alpha(ui.gold, 0.8), font: FONTS.title, weight: 700 });
  const ta = ease.out(prog(t, wt(p.titleAt ?? 0.6, info) - 0.1, wt(p.titleAt ?? 0.6, info) + 0.4));
  (p.title || []).forEach((ln, i) => text(g, ln, E.W * V(0.62, 0.5), E.H * V(0.44, 0.66) + i * V(90, 90), { size: V(70, 64), color: i ? ui.gold : ui.cream, glow: 20, glowColor: alpha(ui.gold, 0.5), spacing: 3, alpha: ta, weight: 700 }));
  g.restore();
};
T.brainState = (g, t, info) => {
  const p = info, ui = S().ui, mode = p.mode || 'calm'; BP(g, t); g.save(); zoom(g, t, info, 1.0, 1.08);
  const bx = E.W / 2, by = E.H * 0.48, r = V(300, 330);
  if (mode === 'overload') { const k = ease.out(prog(t, 0, 0.6)); brain(g, bx, by, r, { col: ui.accent, lit: 0 }); glow(g, bx, by, r * 1.5, ui.accent, 0.25 * k); const cols = ICOL(); for (let i = 0; i < 26; i++) { const an = t * (1.4 + (i % 4) * 0.4) + i, R = r * (1.0 + 0.35 * ((i * 7) % 5) / 5); icon(g, i % 5, bx + Math.cos(an) * R, by + Math.sin(an) * R * 0.75, 22 + (i % 3) * 6, cols[i % 5]); } const [sx, sy] = [Math.sin(t * 40) * 4, Math.cos(t * 37) * 4]; g.translate(sx, sy); }
  else if (mode === 'calm' || mode === 'intact') { brain(g, bx, by, r, { col: UI.bpStroke(), lit: 0.6 + 0.2 * Math.sin(t * 2) }); pathway(g, bx, by, r, 1); FX.rings(g, bx, by, t, { count: 3, r0: r * 1.1, r1: r * 1.8, color: ui.gold, a: 0.18, speed: 0.5 }); }
  else if (mode === 'plastic' || mode === 'fast' || mode === 'slow') {
    brain(g, bx, by, r, { col: UI.bpStroke(), lit: mode === 'slow' ? 0.5 : 0.2 });
    const rnd = rng(3), col = mode === 'fast' ? ui.accent : ui.gold, sp = mode === 'fast' ? 2.2 : 0.6;
    for (let i = 0; i < 9; i++) { const a0 = rnd() * 6.28, a1 = a0 + 1 + rnd() * 2, r0 = r * (0.2 + rnd() * 0.5), r1 = r * (0.2 + rnd() * 0.5); const P0 = [bx + Math.cos(a0) * r0, by + Math.sin(a0) * r0 * 0.7], P1 = [bx + Math.cos(a1) * r1, by + Math.sin(a1) * r1 * 0.7]; const bend = Math.sin(t * 0.8 + i) * 60 * (mode === 'plastic' ? 1 : 0.3); const C = [(P0[0] + P1[0]) / 2 + bend, (P0[1] + P1[1]) / 2 - 40]; const grow = ease.out(prog(t, i * 0.15, i * 0.15 + 1)); g.strokeStyle = alpha(col, 0.8); g.lineWidth = mode === 'slow' ? 3 + 4 * prog(t, 0, info.dur) : 3; g.setLineDash([600 * grow, 600]); g.beginPath(); g.moveTo(...P0); g.quadraticCurveTo(...C, ...P1); g.stroke(); g.setLineDash([]); const u = ((t * sp + i * 0.13) % 1); const q = [lerp(lerp(P0[0], C[0], u), lerp(C[0], P1[0], u), u), lerp(lerp(P0[1], C[1], u), lerp(C[1], P1[1], u), u)]; if (grow > 0.9) spark(g, q[0], q[1], mode === 'fast' ? 0.35 : 0.5, t + i); }
  }
  if (p.label) label(g, p.label, E.W / 2, E.H * 0.88, { color: p.labelColor ? ui[p.labelColor] : ui.cream, alpha: ease.out(prog(t, wt(p.labelAt ?? 0.4, info), wt(p.labelAt ?? 0.4, info) + 0.4)), size: V(48, 50) });
  g.restore();
};
// Skinner box: a little rat presses a lever, pellets arrive unpredictably
T.skinner = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info, 1.0, 1.06);
  const bx = E.W / 2 - 420, by = E.H * 0.2, bw = 840, bh = 600; g.strokeStyle = c; g.lineWidth = 5; g.strokeRect(bx, by, bw, bh);
  const lx = bx + bw - 140, ly = by + bh - 220; seg(g, [[lx, ly], [lx - 60, ly + (Math.sin(t * 5) > 0.3 ? 20 : 0)]], 10, c); rr(g, lx + 10, ly - 120, 80, 100, 10); g.stroke();
  const rx = lx - 210, ry = by + bh - 60, press = Math.sin(t * 5) > 0.3;
  g.fillStyle = alpha(c, 0.9); g.beginPath(); g.ellipse(rx, ry - 40, 90, 50, 0, 0, 7); g.fill(); circle(g, rx + 90, ry - 60 - (press ? 10 : 0), 34, alpha(c, 0.9)); circle(g, rx + 76, ry - 96 - (press ? 10 : 0), 14, alpha(c, 0.9)); circle(g, rx + 108, ry - 66 - (press ? 10 : 0), 5, ui.bpBg);
  g.strokeStyle = alpha(c, 0.9); g.lineWidth = 5; g.beginPath(); g.moveTo(rx - 90, ry - 40); g.quadraticCurveTo(rx - 170, ry - 10, rx - 200, ry - 70); g.stroke();
  const hits = [0.7, 2.3, 2.9, 5.2, 6.0, 7.9], tA = wt(info.aveces ?? 2.5, info);
  hits.forEach((h, i) => { const k = prog(t, h, h + 0.5); if (k <= 0) return; const px = lx + 50 - k * 40, py = ly - 20 + ease.in(k) * 200; circle(g, px, py, 12, ui.gold); glow(g, px, py, 40, ui.gold, 0.6 * (1 - k)); });
  if (info.label !== false) { text(g, 'A VECES SÍ', E.W * 0.78, E.H * 0.3, { size: 44, color: ui.gold, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, tA, tA + 0.3)) }); text(g, 'A VECES NO', E.W * 0.78, E.H * 0.4, { size: 44, color: ui.accent, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, tA + 0.6, tA + 0.9)) }); }
  g.restore();
};
// predictable vs unpredictable: how long the behaviour persists
T.persist = (g, t, info) => {
  const ui = S().ui; BP(g, t); g.save(); zoom(g, t, info);
  const rows = [['PREDECIBLE', 0.3, UI.bpStroke()], ['IMPREDECIBLE', 0.95, ui.gold]], x = V(260, 100), w = V(1100, 800);
  text(g, 'CUÁNTO TIEMPO SIGUE INTENTANDO', E.W / 2, E.H * 0.25, { size: V(40, 40), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.1, 0.5)) });
  rows.forEach(([lab, v, col], i) => { const y = E.H * (0.45 + i * 0.18), k = ease.out(prog(t, 0.6 + i * 0.5, 2.2 + i * 0.5)); text(g, lab, x, y - 50, { size: V(36, 38), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); rr(g, x, y - 20, w, 40, 20); g.fillStyle = alpha(col, 0.12); g.fill(); rr(g, x, y - 20, Math.max(40, w * v * k), 40, 20); g.fillStyle = col; g.fill(); glow(g, x + w * v * k, y, 60, col, 0.5); });
  g.restore();
};
// slot machine with a figure pulling the lever
T.slot = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info, 1.0, 1.07);
  const mx = E.W * 0.58, my = E.H * 0.48; rr(g, mx - 260, my - 300, 520, 560, 30); g.strokeStyle = c; g.lineWidth = 6; g.stroke(); rr(g, mx - 200, my - 180, 400, 180, 16); g.stroke();
  const pull = (t % 2.4) < 0.4; seg(g, [[mx + 260, my - 60], [mx + 330, my - 60], [mx + 330, pull ? my - 10 : my - 220]], 8, c); circle(g, mx + 330, pull ? my - 10 : my - 220, 22, ui.gold);
  for (let i = 0; i < 3; i++) { const k = Math.floor(t * 12 + i * 4) % 5, stopped = (t % 2.4) > 1.4 + i * 0.25; icon(g, stopped ? [0, 0, 2][i] : k, mx - 130 + i * 130, my - 90, 44, ICOL()[stopped ? [0, 0, 2][i] : k]); }
  lf(g, mx - 520, my + 260, 1.6, pull ? 'reach' : 'stand');
  text(g, 'MÁQUINA TRAGAMONEDAS', mx, my + 340, { size: 34, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
};
// you vs the machine: one small figure vs a wall of servers / teams
T.vs = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info, 1.06, 1.0);
  lf(g, E.W * 0.18, E.H * 0.72, 1.4, 'stand', ui.cream); label(g, 'TÚ', E.W * 0.18, E.H * 0.82, { size: 40 });
  const tE = wt(info.teamsAt ?? 'equipos', info), tD = wt(info.dataAt ?? 'datos', info), tG = wt(info.goalAt ?? 'objetivo', info);
  for (let i = 0; i < 18; i++) { const a = ease.out(prog(t, tE + i * 0.05, tE + 0.3 + i * 0.05)); if (a <= 0) continue; const x = E.W * 0.45 + (i % 6) * 110, y = E.H * 0.42 + Math.floor(i / 6) * 150; g.save(); g.globalAlpha *= a; lf(g, x, y + 60, 0.6, 'explain'); g.restore(); }
  const n = Math.floor(lerp(0, 2400000, ease.in(prog(t, tD, tD + 2)))); if (t > tD) text(g, n.toLocaleString('es') + ' USUARIOS', E.W * 0.7, E.H * 0.22, { size: V(48, 44), color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.5) });
  if (t > tG) UI.bigLine(g, t - tG, { str: 'QUE NO TE VAYAS', dur: info.dur - tG + 0.3, y: E.H * 0.9, size: V(58, 54), color: ui.accent });
  g.restore();
};
// willpower vs engineering bars
T.versus = (g, t, info) => {
  const ui = S().ui; BP(g, t); g.save(); zoom(g, t, info);
  const rows = [[info.aAt ?? 'tienes', 'TU FUERZA DE VOLUNTAD', 0.22, ui.cream], [info.bAt ?? 'ingeniería', 'SU INGENIERÍA', 0.98, ui.accent]], x = V(260, 100), w = V(1300, 860);
  rows.forEach(([wd, lab, v, col], i) => { const tt = wt(wd, info), y = E.H * (0.4 + i * 0.22), k = ease.out(prog(t, tt, tt + 0.9)); if (t < tt - 0.2) return; text(g, lab, x, y - 50, { size: V(38, 40), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); rr(g, x, y - 22, w, 44, 22); g.fillStyle = alpha(col, 0.12); g.fill(); rr(g, x, y - 22, Math.max(44, w * v * k), 44, 22); g.fillStyle = col; g.fill(); });
  g.restore();
};
// pleasure–pain balance (Lembke)
T.balance = (g, t, info) => {
  const p = info, ui = S().ui, c = UI.bpStroke(), mode = p.mode || 'level'; BP(g, t); g.save(); zoom(g, t, info, 1.0, 1.05);
  const cx = E.W / 2, cy = E.H * 0.4, L = V(520, 380);
  const t1 = wt(p.at ?? 0.6, info);
  let ang = 0;
  if (mode === 'tilt') ang = -0.32 * ease.outBack(prog(t, t1, t1 + 0.8));
  else if (mode === 'push') ang = lerp(-0.32, 0.24, ease.inOut(prog(t, t1, t1 + 1.6)));
  else if (mode === 'reset') ang = key(t, [[0, -0.25], [0.8, 0.15], [1.8, 0]]);
  else if (mode === 'flood') ang = -0.3 + 0.08 * Math.sin(t * 7);
  else if (mode === 'stuck') ang = lerp(-0.1, 0.3, ease.inOut(prog(t, t1, t1 + 1.6)));
  else if (mode === 'reference') ang = 0.3;
  else if (mode === 'return') ang = lerp(0.3, 0, ease.inOut(prog(t, t1, t1 + 2.4)));
  poly(g, [[cx, cy], [cx - 70, E.H * 0.82], [cx + 70, E.H * 0.82]], alpha(c, 0.2)); seg(g, [[cx, cy], [cx, E.H * 0.82]], 6, c); seg(g, [[cx - 200, E.H * 0.82], [cx + 200, E.H * 0.82]], 6, c);
  const ex = Math.cos(ang) * L, ey = Math.sin(ang) * L; seg(g, [[cx - ex, cy - ey], [cx + ex, cy + ey]], 8, c); circle(g, cx, cy, 14, ui.gold);
  const pan = (x, y, lab, col) => { seg(g, [[x, y], [x - 90, y + 130]], 3, alpha(c, 0.7)); seg(g, [[x, y], [x + 90, y + 130]], 3, alpha(c, 0.7)); g.strokeStyle = c; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 120, y + 130); g.quadraticCurveTo(x, y + 200, x + 120, y + 130); g.stroke(); text(g, lab, x, y + 240, { size: V(40, 40), color: col, font: FONTS.ui, weight: 900, spacing: 3 }); return [x, y + 150]; };
  const [px, py] = pan(cx - ex, cy - ey, 'PLACER', ui.gold), [dx, dy] = pan(cx + ex, cy + ey, 'DOLOR', ui.accent);
  if (mode === 'tilt' || mode === 'push' || mode === 'flood') { const k = mode === 'flood' ? 1 : ease.out(prog(t, t1 - 0.2, t1 + 0.3)); spark(g, px, py - 30 * k, 1.1 * k, t); }
  if (mode === 'flood') for (let i = 0; i < 6; i++) { const ph = (t * 1.6 + i / 6) % 1; spark(g, px + (i - 3) * 20, lerp(-100, py - 30, ph), 0.6, t + i, 1 - ph * 0.5); }
  if (mode === 'push') { const k = ease.out(prog(t, t1, t1 + 0.6)); for (let i = 0; i < 3; i++) { const yy = dy - 70 - i * 60 - (t * 80) % 60; poly(g, [[dx, yy + 30], [dx - 26, yy - 10], [dx + 26, yy - 10]], alpha(ui.accent, 0.7 * k)); } }
  if (mode === 'stuck' || mode === 'reference') { const k = ease.out(prog(t, mode === 'stuck' ? t1 + 1 : 0.3, (mode === 'stuck' ? t1 + 1 : 0.3) + 0.5)); g.setLineDash([12, 12]); seg(g, [[cx - L - 160, cy], [cx + L + 160, cy]], 3, alpha(c, 0.5 * k)); g.setLineDash([]); text(g, mode === 'reference' ? 'TU NUEVO PUNTO DE REFERENCIA' : 'COMPENSACIÓN CONSTANTE', cx, E.H * 0.13, { size: V(42, 40), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 3, alpha: k }); }
  if (mode === 'return') { const k = ease.out(prog(t, t1 + 2.0, t1 + 2.5)); text(g, 'EQUILIBRIO', cx, E.H * 0.13, { size: V(48, 44), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: k, glow: 16, glowColor: alpha(ui.gold, 0.5) }); }
  g.restore();
};
// attention span data (Gloria Mark)
T.attn = (g, t, info) => {
  const p = info, ui = S().ui; BP(g, t); g.save(); zoom(g, t, info);
  const x = V(300, 120), w = V(1200, 820), max = 160;
  const row = (y, lab, v, col, k) => { text(g, lab, x, y - 50, { size: V(36, 38), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 }); rr(g, x, y - 22, w, 44, 22); g.fillStyle = alpha(col, 0.12); g.fill(); rr(g, x, y - 22, Math.max(44, (w * v * k) / max), 44, 22); g.fillStyle = col; g.fill(); const sec = Math.round(v * k); const str = sec >= 60 ? `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')} MIN` : `${sec} s`; text(g, str, x + (w * v * k) / max + 30, y, { size: V(52, 50), color: col, font: FONTS.ui, weight: 900, align: 'left', glow: 14, glowColor: alpha(col, 0.5) }); };
  text(g, 'ATENCIÓN EN UNA PANTALLA ANTES DE CAMBIAR', E.W / 2, E.H * 0.2, { size: V(36, 36), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  const t1 = wt(p.at1 ?? 0.3, info); row(E.H * 0.45, 'PRINCIPIOS DE LOS 2000', 150, UI.bpStroke(), p.mode === 2 ? 1 : ease.out(prog(t, t1, t1 + 1.6)));
  if (p.mode === 2) { const t2 = wt(p.at2 ?? 0.6, info); row(E.H * 0.67, 'HOY', 47, ui.accent, ease.out(prog(t, t2, t2 + 1.4))); }
  g.restore();
};
// screens switching (a figure hopping between screens) + stopwatch
T.switcher = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const pos = [[0.25, 0.45], [0.5, 0.35], [0.75, 0.45]].map(([u, v]) => [E.W * u, E.H * v]); pos.forEach(([x, y]) => { rr(g, x - 130, y - 80, 260, 160, 14); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); });
  const i = Math.floor(t / 0.9) % 3, j = (i + 1) % 3, k = ease.inOut(prog(t % 0.9, 0.5, 0.9)); const [ax, ay] = pos[i], [bx, by] = pos[j]; spark(g, lerp(ax, bx, k), lerp(ay, by, k) - Math.sin(k * Math.PI) * 120, 1, t);
  UI.readout(g, { label: 'CRONÓMETRO', value: (t % 10).toFixed(1) + ' s', x: E.W / 2, y: E.H * 0.8, align: 'center' });
  g.restore();
};
// attention residue: two task boxes, part of you stays stuck in the previous one
T.residue = (g, t, info) => {
  const p = info, ui = S().ui, c = UI.bpStroke(), mode = p.mode || 'stick'; BP(g, t); g.save(); zoom(g, t, info);
  const A = [E.W * 0.28, E.H * 0.5], B = [E.W * 0.72, E.H * 0.5];
  for (const [[x, y], lab] of [[A, 'TAREA A'], [B, 'TAREA B']]) { rr(g, x - 220, y - 170, 440, 340, 24); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); text(g, lab, x, y + 220, { size: 38, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); }
  if (mode === 'jump' || mode === 'many') { const n = mode === 'many' ? 8 : 1; for (let i = 0; i < n; i++) { const ph = ((t * (mode === 'many' ? 1.5 : 0.6)) + i / n) % 1; const x = lerp(A[0], B[0], ph), y = A[1] - Math.sin(ph * Math.PI) * 240; spark(g, x, y, 0.8, t + i); } if (mode === 'many') { const n2 = Math.floor(lerp(1, 100, ease.in(prog(t, 0.3, info.dur - 0.4)))); UI.badge(g, { str: `x${n2}`, x: E.W / 2 + 80, y: E.H * 0.18, size: 80, a: 1 }); } else { const tc = wt(p.at ?? 1.2, info), k = ease.outBack(prog(t, tc, tc + 0.4)); if (k > 0) text(g, '−', E.W / 2, E.H * 0.2, { size: 120 * k, color: ui.accent, font: FONTS.ui, weight: 900 }); } }
  else { const k = ease.inOut(prog(t, 0.4, 1.6)); lf(g, lerp(A[0], B[0], k), A[1] + 120, 1.2, 'stand', ui.cream); for (let i = 0; i < 5; i++) { const s = 0.5 + 0.3 * Math.sin(t * 2 + i); spark(g, A[0] - 80 + i * 40, A[1] - 40 + Math.sin(t * 3 + i) * 20, 0.5 * s, t + i); } const lt = wt(p.labelAt ?? 1.6, info); text(g, 'RESIDUO', A[0], A[1] - 120, { size: 40, color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, lt, lt + 0.4)) }); }
  g.restore();
};
// fragmented you: a figure sliced into drifting pieces
T.fragment = (g, t, info) => {
  const ui = S().ui; BP(g, t); g.save(); zoom(g, t, info, 1.0, 1.08);
  const k = ease.inOut(prog(t, 0.3, info.dur - 0.3)), x = E.W / 2, y = E.H * 0.78;
  for (let i = 0; i < 6; i++) { g.save(); g.beginPath(); g.rect(0, y - 520 + i * 90, E.W, 90); g.clip(); g.translate((i % 2 ? 1 : -1) * k * (40 + i * 30), -k * i * 10); g.rotate((i % 2 ? 1 : -1) * k * 0.05); lf(g, x, y, 2.4, 'stand', ui.cream); g.restore(); }
  g.restore();
};
T.calendar = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const days = info.days || 30, n = Math.floor(lerp(1, days, ease.inOut(prog(t, wt(info.at ?? 0.4, info), info.dur - 0.3))));
  for (let i = 0; i < days; i++) { const x = E.W / 2 - 3 * 150 + (i % 7) * 150, y = E.H * 0.28 + Math.floor(i / 7) * 120; rr(g, x - 55, y - 45, 110, 90, 12); g.fillStyle = i < n ? alpha(ui.gold, 0.85) : alpha(c, 0.12); g.fill(); text(g, String(i + 1), x, y + 2, { size: 34, color: i < n ? ui.bpBg : alpha(c, 0.6), font: FONTS.ui, weight: 900 }); }
  label(g, 'CON CONSTANCIA', E.W / 2, E.H * 0.92, { color: ui.gold, alpha: ease.out(prog(t, wt('constancia', info, 1), wt('constancia', info, 1) + 0.4)) });
  g.restore();
};
// "you don't need to …" (mountain / river) with a big X
T.nope = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(), mode = info.mode || 'mountain'; BP(g, t); g.save(); zoom(g, t, info);
  if (mode === 'mountain') { poly(g, [[E.W * 0.2, E.H * 0.8], [E.W * 0.45, E.H * 0.25], [E.W * 0.7, E.H * 0.8]], alpha(c, 0.15)); g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); g.moveTo(E.W * 0.2, E.H * 0.8); g.lineTo(E.W * 0.45, E.H * 0.25); g.lineTo(E.W * 0.58, E.H * 0.5); g.lineTo(E.W * 0.65, E.H * 0.42); g.lineTo(E.W * 0.8, E.H * 0.8); g.stroke(); lf(g, E.W * 0.45, E.H * 0.25, 0.7, 'cheer'); }
  else { g.strokeStyle = c; g.lineWidth = 5; for (let i = 0; i < 4; i++) { g.beginPath(); for (let x = 0; x <= E.W; x += 20) g.lineTo(x, E.H * 0.72 + i * 34 + Math.sin(x * 0.01 + t * 2 + i) * 12); g.stroke(); } const k = ease.in(prog(t, 0.3, 1.4)); g.save(); g.translate(lerp(E.W * 0.25, E.W * 0.6, k), lerp(E.H * 0.3, E.H * 0.72, k) - Math.sin(k * Math.PI) * 200); g.rotate(t * 6); rr(g, -30, -55, 60, 110, 12); g.strokeStyle = ui.cream; g.stroke(); g.restore(); lf(g, E.W * 0.2, E.H * 0.66, 1.2, 'reach'); }
  const tx = wt(info.xAt ?? 0.9, info), k = ease.out(prog(t, tx, tx + 0.3)); if (k > 0) { const cx = E.W / 2, cy = E.H / 2; seg(g, [[cx - 260 * k, cy - 260 * k], [cx + 260 * k, cy + 260 * k]], 18, ui.accent); seg(g, [[cx + 260 * k, cy - 260 * k], [cx - 260 * k, cy + 260 * k]], 18, ui.accent); }
  g.restore();
};
T.volume = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const k = 1 - ease.inOut(prog(t, wt(info.at ?? 0.3, info), wt(info.at ?? 0.3, info) + 1.4)) * 0.8, x = E.W * 0.3, w = E.W * 0.4, y = E.H * 0.6;
  rr(g, x, y - 14, w, 28, 14); g.fillStyle = alpha(c, 0.2); g.fill(); rr(g, x, y - 14, w * k, 28, 14); g.fillStyle = ui.gold; g.fill(); circle(g, x + w * k, y, 34, ui.cream);
  for (let i = 0; i < 4; i++) { const a = clamp(k * 4 - i); g.strokeStyle = alpha(ui.cream, a); g.lineWidth = 7; g.beginPath(); g.arc(E.W * 0.26, E.H * 0.38, 40 + i * 36, -0.6, 0.6); g.stroke(); }
  poly(g, [[E.W * 0.2, E.H * 0.34], [E.W * 0.23, E.H * 0.34], [E.W * 0.26, E.H * 0.3], [E.W * 0.26, E.H * 0.46], [E.W * 0.23, E.H * 0.42], [E.W * 0.2, E.H * 0.42]], ui.cream);
  if (info.text) label(g, info.text, E.W / 2, E.H * 0.82, { color: ui.gold, size: V(56, 54), alpha: ease.out(prog(t, 0.3, 0.7)) });
  g.restore();
};
// friction: easy downhill vs blocked uphill
T.friction = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const tF = wt(info.at ?? 'difíciles', info, 1.8), hard = t > tF - 0.2;
  const x0 = E.W * 0.15, y0 = E.H * 0.3, x1 = E.W * 0.75, y1 = E.H * 0.75; seg(g, [[x0, y0], [x1, y1]], 6, c);
  const k = hard ? Math.min(0.45, (t - tF) * 0.4) : (t * 0.6) % 1; const bx = lerp(x0, x1, k), by = lerp(y0, y1, k) - 40; icon(g, 1, bx, by, 36, ui.accent);
  if (hard) { const a = ease.outBack(prog(t, tF - 0.2, tF + 0.3)); rr(g, lerp(x0, x1, 0.5) - 20, lerp(y0, y1, 0.5) - 200 * a, 40, 200 * a, 8); g.fillStyle = ui.gold; g.fill(); text(g, 'FRICCIÓN', lerp(x0, x1, 0.5) + 60, lerp(y0, y1, 0.5) - 160, { size: 44, color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', alpha: a }); }
  else text(g, 'FÁCIL', E.W * 0.6, E.H * 0.35, { size: 44, color: ui.accent, font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.4, 0.8)) });
  g.restore();
};
// top-down plan: desk in one room, phone in another
T.plan = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info, 1.06, 1.0);
  const x = E.W * 0.2, y = E.H * 0.22, w = E.W * 0.6, h = E.H * 0.56; g.strokeStyle = c; g.lineWidth = 6; g.strokeRect(x, y, w, h); seg(g, [[x + w * 0.6, y], [x + w * 0.6, y + h * 0.4]], 6, c); seg(g, [[x + w * 0.6, y + h * 0.65], [x + w * 0.6, y + h]], 6, c);
  rr(g, x + 80, y + 80, 260, 120, 10); g.stroke(); text(g, 'ESCRITORIO', x + 210, y + 240, { size: 30, color: ui.cream, font: FONTS.ui, weight: 900 }); circle(g, x + 210, y + 260 + 60, 30, alpha(ui.cream, 0.8));
  const px = x + w * 0.82, py = y + h * 0.5; rr(g, px - 22, py - 40, 44, 80, 10); g.strokeStyle = ui.accent; g.stroke(); glow(g, px, py, 80, ui.accent, 0.4); text(g, 'TELÉFONO', px, py + 80, { size: 30, color: ui.accent, font: FONTS.ui, weight: 900 });
  const k = ease.inOut(prog(t, 0.6, 2)); g.setLineDash([12, 12]); seg(g, [[x + 240, y + 320], [lerp(x + 240, px - 40, k), lerp(y + 320, py, k)]], 3, alpha(ui.gold, 0.8)); g.setLineDash([]);
  if (k >= 1) label(g, 'LEJOS = MÁS DIFÍCIL', E.W / 2, E.H * 0.9, { color: ui.gold, alpha: ease.out(prog(t, 2, 2.4)) });
  g.restore();
};
// pomodoro timer (with wandering focus dot)
T.timer = (g, t, info) => {
  const p = info, ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const cx = E.W / 2, cy = E.H * 0.48, R = V(240, 260), k = ease.out(prog(t, 0, 0.6)); ring(g, cx, cy, R, 10, alpha(c, 0.3));
  const frac = 1 - (t * 0.02) % 1; g.strokeStyle = ui.gold; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2 * k); g.stroke();
  const secs = 25 * 60 - Math.floor(t); text(g, `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, cx, cy, { size: V(120, 110), color: ui.cream, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.4) });
  if (p.mode === 'wander') { const tw = wt(p.at ?? 'escape', info, 0.4), tb = wt(p.backAt ?? 'regrésala', info, 2.6), out = ease.inOut(prog(t, tw, tw + 0.8)) * (1 - ease.inOut(prog(t, tb, tb + 0.8))); const an = -Math.PI / 2 + frac * Math.PI * 2; const d = R + out * 320; spark(g, cx + Math.cos(an + out) * d, cy + Math.sin(an + out) * d * 0.8, 0.9, t); if (out > 0.3) text(g, '?', cx + Math.cos(an + out) * d + 50, cy + Math.sin(an + out) * d * 0.8 - 40, { size: 50, color: ui.accent, font: FONTS.ui, weight: 900, alpha: out }); }
  g.restore();
};
// growing focus blocks: 25 → 30 → 45 → 60
T.blocks = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const B = [[0.2, 25, '25'], ['treinta', 30, '30'], ['cuarenta', 45, '45'], ['hora', 60, '60']], x = V(260, 100), w = V(1300, 860);
  B.forEach(([wd, v, lab], i) => { const tt = wt(wd, info, 0.2 + i), y = E.H * (0.25 + i * 0.16), k = ease.out(prog(t, tt - 0.1, tt + 0.6)); if (k <= 0) return; rr(g, x, y - 26, Math.max(52, (w * v / 60) * k), 52, 16); g.fillStyle = alpha(i === 3 ? ui.gold : c, 0.85); g.fill(); text(g, lab + ' MIN', x + (w * v / 60) * k + 30, y, { size: V(44, 44), color: i === 3 ? ui.gold : ui.cream, font: FONTS.ui, weight: 900, align: 'left', alpha: k }); });
  g.restore();
};
// reps: a line figure lifting a barbell
T.gym = (g, t, info) => {
  const ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const up = 0.5 - 0.5 * Math.cos(t * Math.PI * 1.2), x = E.W * 0.4, y = E.H * 0.78, s = 2.2;
  lf(g, x, y, s, { ...POSES.stand, eF: [24, -150 - up * 40], hF: [30, -170 - up * 70], eB: [-20, -150 - up * 40], hB: [-26, -170 - up * 70] }, ui.cream);
  const by = y - (170 + up * 70) * s - 6; seg(g, [[x - 200, by], [x + 200, by]], 10, c); for (const sx of [-1, 1]) { rr(g, x + sx * 200 - 22, by - 60, 44, 120, 10); g.fillStyle = ui.gold; g.fill(); }
  const reps = Math.floor(t * 0.6 + 0.4); text(g, `REPETICIÓN ${reps}`, E.W * 0.72, E.H * 0.5, { size: V(52, 50), color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.5) });
  g.restore();
};
// fast vs slow dopamine curves
T.curves = (g, t, info) => {
  const p = info, ui = S().ui, c = UI.bpStroke(); BP(g, t); g.save(); zoom(g, t, info);
  const x0 = V(220, 100), x1 = E.W - V(220, 100), y0 = E.H * 0.78, H = E.H * 0.5; seg(g, [[x0, y0], [x1, y0]], 3, alpha(c, 0.6)); seg(g, [[x0, y0], [x0, y0 - H]], 3, alpha(c, 0.6)); text(g, 'TIEMPO', x1, y0 + 40, { size: 26, color: alpha(c, 0.9), font: FONTS.ui, weight: 900, align: 'right' });
  const draw = (fn, col, k, lab) => { g.strokeStyle = col; g.lineWidth = 7; g.beginPath(); for (let i = 0; i <= 100 * k; i++) { const u = i / 100, x = lerp(x0, x1, u), y = y0 - fn(u) * H; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); if (k > 0.98) text(g, lab, lerp(x0, x1, 0.75), y0 - fn(0.75) * H - 40, { size: V(36, 36), color: col, font: FONTS.ui, weight: 900 }); };
  const fast = (u) => Math.max(-0.15, 0.95 * Math.exp(-((u - 0.12) ** 2) / 0.003) - (u > 0.12 ? 0.15 * Math.min(1, (u - 0.12) * 6) : 0)) + 0.15, slow = (u) => 0.15 + 0.6 * (1 - Math.exp(-u * 3));
  if (p.fast) draw(fast, ui.accent, p.mode === 'fast' ? ease.inOut(prog(t, 0.2, info.dur - 0.3)) : 1, 'RÁPIDA');
  if (p.slow) draw(slow, ui.gold, p.mode === 'slow' ? ease.inOut(prog(t, 0.2, info.dur - 0.2)) : 1, 'LENTA');
  if (p.title) text(g, p.title, E.W / 2, E.H * 0.14, { size: V(46, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.6)) });
  g.restore();
};
// four slow-dopamine activities appearing on their words
T.montage = (g, t, info) => {
  const ui = S().ui; BP(g, t); g.save(); zoom(g, t, info);
  const items = [['ejercicio', 'EJERCICIO', 'jump'], ['habilidad', 'HABILIDAD', 'think'], ['proyecto', 'PROYECTO', 'cheer'], ['conversación', 'CONVERSACIÓN', 'talk']];
  items.forEach(([w, lab, pose], i) => { const tt = wt(w, info, i * 1.2), a = ease.outBack(prog(t, tt - 0.15, tt + 0.3)); if (a <= 0) return; const x = E.W * (0.16 + i * 0.227), y = E.H * 0.62; g.save(); g.globalAlpha *= clamp(a); glow(g, x, y - 200, 160, ui.gold, 0.2); lf(g, x, y, 1.5, pose, ui.gold); if (i === 3) lf(g, x + 100, y, 1.5, 'talk', UI.bpStroke()); text(g, lab, x + (i === 3 ? 50 : 0), y + 80, { size: V(34, 30), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); });
  g.restore();
};
// what changed: talent / intelligence / environment
T.checklist = (g, t, info) => {
  const ui = S().ui; BP(g, t); g.save(); zoom(g, t, info);
  const rows = [['talento', 'TALENTO', false], ['inteligencia', 'INTELIGENCIA', false], ['entorno', 'ENTORNO', true]];
  rows.forEach(([w, lab, yes], i) => { const tt = wt(w, info, 0.4 + i * 1.3), a = ease.out(prog(t, tt - 0.1, tt + 0.3)); if (a <= 0) return; const y = E.H * (0.32 + i * 0.18), x = E.W * 0.36; text(g, lab, x, y, { size: V(64, 58), color: yes ? ui.gold : alpha(ui.cream, 0.7), font: FONTS.title, weight: 700, align: 'left', alpha: a, spacing: 3 }); const mx = E.W * 0.28; if (yes) { g.strokeStyle = ui.gold; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx - 30, y); g.lineTo(mx - 6, y + 26 * a); g.lineTo(mx + 36 * a, y - 30 * a); g.stroke(); glow(g, mx, y, 90, ui.gold, 0.4 * a); } else { seg(g, [[mx - 26, y - 26], [mx - 26 + 52 * a, y - 26 + 52 * a]], 10, ui.accent); seg(g, [[mx + 26, y - 26], [mx + 26 - 52 * a, y - 26 + 52 * a]], 10, ui.accent); } });
  g.restore();
};
T.endCard = (g, t, info) => {
  const ui = S().ui; blurLayer(g, 10, (g) => dormitorio(g, t, { z: 1.2 + 0.03 * t }, { mood: 'golden' })); veil(g, '#03100c', 0.45);
  const L = info.lines || []; L.forEach(([w, str, col], i) => { const tt = wt(w, info), a = ease.out(prog(t, tt - 0.1, tt + 0.5)); if (a <= 0) return; text(g, str, E.W / 2, E.H * (0.36 + i * 0.16), { size: i === 0 ? V(110, 96) : V(60, 56), color: col ? ui[col] : ui.cream, glow: 30, glowColor: alpha(ui.gold, 0.6), spacing: 4, alpha: a * clamp((info.dur - t) / 1.2) }); });
  FX.dust(g, t, { count: 40, color: '#ffe8c0', a: 0.4 });
};

for (const s of E.shots) if (s.params?.tpl && T[s.params.tpl]) registerShot(s.id, { draw: T[s.params.tpl] });
