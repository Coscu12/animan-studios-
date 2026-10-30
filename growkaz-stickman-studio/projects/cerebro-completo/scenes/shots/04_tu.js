// shots/04_tu.js — you, today: the bedroom at night, the phone, the voice, the freeze, the glowing door.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, shade, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { dormitorio, dormGround, cama, phoneGlow, PHONE_GLOW } from '../sets/dormitorio.js';
import { spark } from '../sets/cerebro.js';
import { TU } from '../cast.js';

const wt = (w, info, d = 0.5) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;
const BED_X = () => E.W / 2 - V(260, 60);
// TU sitting on the bed scrolling the phone; returns the phone position
function tuOnBed(g, t, cam, o = {}) {
  const { GY, M } = dormitorio(g, t, cam);
  let ph = [0, 0];
  layer(g, cam, 1, (g) => {
    const top = cama(g, BED_X(), GY, V(620, 560), M), x = BED_X() + V(120, 80), s = V(1.35, 1.45);
    const pose = { ...POSES.sit, eF: [20, -112], hF: [36, -136], eB: [12, -112], hB: [30, -132], head: [10, -174] };
    drawFigure(g, { x, y: top + 72 * s, s, facing: 1, outfit: TU, pose: breathe(pose, t, 0.6), expr: o.expr || 'neutral', look: [0.6, 0.7], prop: 'phone', rim: { color: PHONE_GLOW, dir: [1, -0.2], w: 4.5 }, shadow: false, blink: (t % 3.6) > 3.5 });
    ph = [x + 40 * s, top + 72 * s - 140 * s]; phoneGlow(g, ph[0], ph[1], o.glow ?? 1);
    o.extra?.(g, ph, GY, M);
  });
  return { GY, M, ph };
}

// s02 — "Empecemos por el principio."  the bedroom, night
registerShot('b02', { draw(g, t, info) { tuOnBed(g, t, { z: 1 + 0.06 * ease.inOut(t / info.dur), x: -20 }); FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 }); } });

// s20 — "A la anticipación."  giant face lit by the phone
registerShot('b20', { draw(g, t, info) {
  blurLayer(g, 14, (g) => dormitorio(g, t, { z: 1.5, x: 200, y: -140 })); veil(g, '#050a10', 0.4);
  const r = V(290, 320) * (1 + 0.04 * t), cx = E.W / 2 - V(140, 0), cy = E.H * V(0.54, 0.5);
  glow(g, cx + r * 0.9, cy + r * 0.9, r * 1.4, PHONE_GLOW, 0.35 + 0.08 * Math.sin(t * 5));
  bigFace(g, cx, cy, r, { outfit: TU, expr: 'awe', look: [0.5, 0.6], rimColor: PHONE_GLOW, rimSide: 1, blink: false });
  for (let i = 0; i < 2; i++) { glow(g, cx - r * 0.3 + i * r * 0.6 + r * 0.06, cy - r * 0.12, 18, S().ui.gold, 0.7); }
} });

// s23 — "Es la voz que te dice: «Sigue buscando.»"
registerShot('b23', { draw(g, t, info) {
  const tS = wt('sigue', info, 1.8);
  tuOnBed(g, t, { z: 1.2 + 0.05 * ease.inOut(t / info.dur), x: -140, y: 40 }, { expr: 'neutral', extra: (g, ph) => {
    const hx = BED_X() + V(120, 80) + 14 * V(1.35, 1.45), hy = ph[1] - 50 * V(1.35, 1.45);
    FX.rings(g, hx - 30, hy - 10, t, { count: 3, r0: 40, r1: 160, color: S().ui.gold, a: 0.35 });
    const a = ease.outBack(prog(t, tS - 0.1, tS + 0.3)); if (a > 0) { g.save(); g.translate(hx + V(260, 160), hy - V(140, 160)); g.scale(a, a);
      UI.bubble(g, 0, 0, { w: 420, h: 100, color: alpha('#fff6e0', 0.95), dots: false }); text(g, 'SIGUE BUSCANDO…', 0, 2, { size: 38, color: '#1a1206', font: FONTS.ui, weight: 900, italic: true }); g.restore(); }
  } });
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 });
} });

// s24 — "Algo bueno está por llegar."  insert: the phone screen
registerShot('b24', { draw(g, t, info) {
  blurLayer(g, 18, (g) => dormitorio(g, t, { z: 1.8, x: -200, y: -200 })); veil(g, '#050a10', 0.45);
  const ui = S().ui, pw = V(420, 520), phh = pw * 2.0, px = E.W / 2 - pw / 2, py = E.H * V(0.5, 0.48) - phh / 2 + 40 - 30 * ease.inOut(t / info.dur);
  glow(g, E.W / 2, E.H / 2, 700, PHONE_GLOW, 0.25);
  rr(g, px - 14, py - 14, pw + 28, phh + 28, 54); g.fillStyle = S().ink; g.fill();
  g.save(); rr(g, px, py, pw, phh, 42); g.clip(); g.fillStyle = '#0d1a24'; g.fillRect(px, py, pw, phh);
  const scroll = (t * 520) % 260;
  for (let i = -1; i < 9; i++) { const y = py + i * 260 - scroll + 60; rr(g, px + 24, y, pw - 48, 220, 20); g.fillStyle = alpha(ui.blueprint, 0.12); g.fill(); circle(g, px + 70, y + 46, 22, alpha(ui.cream, 0.3)); rr(g, px + 104, y + 34, pw * 0.45, 20, 10); g.fillStyle = alpha(ui.cream, 0.25); g.fill(); rr(g, px + 44, y + 90, pw - 88, 110, 14); g.fillStyle = alpha(i % 2 ? ui.gold : ui.accent, 0.22); g.fill(); }
  const tB = wt('bueno', info, 0.5); const sp = clamp((t - tB) / 1.2);
  g.fillStyle = alpha('#0d1a24', 0.7 * sp); g.fillRect(px, py, pw, phh);
  if (sp > 0) { g.save(); g.translate(E.W / 2, py + phh * 0.45); g.rotate(t * 6); for (let i = 0; i < 10; i++) { g.rotate(Math.PI / 5); circle(g, 0, -44, 7, alpha(ui.cream, sp * (0.2 + i / 12))); } g.restore(); }
  g.restore();
  const tL = wt('llegar', info, 1.3), nd = ease.outBack(prog(t, tL, tL + 0.3));
  if (nd > 0) { const nx = px + pw - 10, ny = py + 10; glow(g, nx, ny, 90, ui.accent, 0.7 * nd); circle(g, nx, ny, 30 * nd * (1 + 0.1 * Math.sin(t * 10)), ui.accent); text(g, '1', nx, ny + 2, { size: 34 * nd, color: '#ffffff', font: FONTS.ui, weight: 900 }); FX.rings(g, nx, ny, t - tL, { count: 2, r0: 30, r1: 120, color: ui.accent, a: 0.5 }); }
} });

// s29 — "Cuando ya sabes exactamente lo que va a pasar, se calma."  predictable scrolling, flat line
registerShot('b29', { draw(g, t, info) {
  const tC = wt('calma', info, 3.3);
  tuOnBed(g, t, { z: 1.1 + 0.03 * ease.inOut(t / info.dur), x: -80 }, { expr: t > tC ? 'sleepy' : 'neutral', glow: 1 - 0.4 * prog(t, tC - 0.3, tC + 0.6) });
  const ui = S().ui, x0 = E.W - V(560, 760), y = V(150, 180), w = V(420, 560);
  g.save(); g.globalAlpha *= ease.out(prog(t, 0.3, 0.7));
  rr(g, x0 - 30, y - 80, w + 60, 140, 18); g.fillStyle = alpha(ui.bpBg, 0.85); g.fill();
  text(g, 'DOPAMINA', x0, y - 46, { size: 24, color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  g.strokeStyle = ui.gold; g.lineWidth = 4; g.beginPath(); const head = clamp(t / (info.dur - 0.3));
  for (let i = 0; i <= 60; i++) { const u = i / 60; if (u > head) break; const amp = (1 - prog(u, 0.0, 0.7)) * 18; const yy = y + 20 - Math.abs(Math.sin(u * 40)) * amp; i ? g.lineTo(x0 + u * w, yy) : g.moveTo(x0 + u * w, yy); } g.stroke();
  g.restore();
  FX.dust(g, t, { count: 24, color: '#cfe0ff', a: 0.2 });
} });

// s30 — "En otras palabras…"  wide from the window side, slow push
registerShot('b30', { draw(g, t, info) { tuOnBed(g, t, { z: 0.94 + 0.06 * ease.inOut(t / info.dur), x: 120 - 60 * ease.inOut(t / info.dur) }); blurLayer(g, 12, (g) => { g.fillStyle = 'rgba(8,16,14,.85)'; g.fillRect(E.W - 260, -40, 300, E.H + 80); }, null); FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 }); } });

// s31 — "tu cerebro es adicto a la sorpresa."  FREEZE: notification icons hang in the air
function icon(g, kind, x, y, r, col) {
  circle(g, x, y, r, alpha(S().ui.bpBg, 0.9)); ring(g, x, y, r, 4, col);
  if (kind === 0) { g.fillStyle = col; g.beginPath(); g.moveTo(x, y + r * 0.45); g.bezierCurveTo(x - r * 0.9, y - r * 0.1, x - r * 0.35, y - r * 0.75, x, y - r * 0.25); g.bezierCurveTo(x + r * 0.35, y - r * 0.75, x + r * 0.9, y - r * 0.1, x, y + r * 0.45); g.fill(); }
  else if (kind === 1) { g.fillStyle = col; g.beginPath(); g.moveTo(x - r * 0.25, y - r * 0.4); g.lineTo(x + r * 0.45, y); g.lineTo(x - r * 0.25, y + r * 0.4); g.closePath(); g.fill(); }
  else if (kind === 2) { rr(g, x - r * 0.5, y - r * 0.35, r, r * 0.6, r * 0.2); g.fillStyle = col; g.fill(); g.beginPath(); g.moveTo(x - r * 0.3, y + r * 0.2); g.lineTo(x - r * 0.4, y + r * 0.5); g.lineTo(x, y + r * 0.25); g.fill(); }
  else text(g, '?', x, y + 2, { size: r * 1.2, color: col, font: FONTS.ui, weight: 900 });
}
registerShot('b31', { draw(g, t, info) {
  const cam = { z: 1.15 + 0.03 * t, r: -0.02 + 0.01 * t, x: -120, y: 30 };
  tuOnBed(g, 0.4, cam, { expr: 'awe' });
  layer(g, cam, 1, (g) => { const r = rng(5), cols = [S().ui.accent, S().ui.gold, PHONE_GLOW, S().ui.cream];
    for (let i = 0; i < 14; i++) { const x = BED_X() + 120 + (r() - 0.3) * 1300, y = E.H * (0.12 + r() * 0.55); icon(g, i % 4, x + Math.sin(t * 0.5 + i) * 4, y + Math.cos(t * 0.4 + i) * 4, 26 + r() * 22, cols[i % 4]); } });
  FX.drops(g, t, { count: 40, color: '#d8e4ff', rMax: 8, drift: 3 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  const tS = wt('sorpresa', info, 1.6); UI.bigLine(g, Math.max(0, t - tS + 0.1), { str: 'ADICTO A LA SORPRESA', dur: info.dur - tS + 0.6, y: E.H * V(0.86, 0.8), size: V(64, 60) });
} });

// s33 — "Hoy… es la puerta por donde entra todo lo que te distrae."  the glowing doorway
registerShot('b33', { draw(g, t, info) {
  const M = mood('night'), ui = S().ui, GY = dormGround(), tP = wt('puerta', info, 1.4), tD = wt('distrae', info, 3.7);
  const cam = { z: 1.0 + 0.08 * ease.inOut(t / info.dur), x: 0 };
  layer(g, cam, 0.5, (g) => { g.fillStyle = linGradBg(g); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); });
  const dx = E.W * V(0.62, 0.5), dw = V(300, 320), dh = V(560, 640), open = ease.inOut(prog(t, tP - 0.4, tP + 0.8));
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = shade(M.floor, -0.5); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    glow(g, dx, GY - dh / 2, dh * 1.3 * (0.3 + open), PHONE_GLOW, 0.4 * open);
    g.fillStyle = shade(M.wall, -0.7); g.fillRect(dx - dw / 2 - 24, GY - dh - 24, dw + 48, dh + 24);
    g.fillStyle = alpha('#eaf6ff', 0.15 + 0.85 * open); g.fillRect(dx - dw / 2, GY - dh, dw * open, dh);
    g.fillStyle = shade(M.wall, -0.4); g.fillRect(dx - dw / 2 + dw * open, GY - dh, dw * (1 - open), dh);
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha(PHONE_GLOW, 0.18 * open); g.beginPath(); g.moveTo(dx - dw / 2, GY); g.lineTo(dx - dw / 2 + dw * open, GY); g.lineTo(dx - V(900, 500), E.H * 1.4); g.lineTo(dx - V(1500, 700), E.H * 1.4); g.closePath(); g.fill(); g.restore();
  });
  layer(g, cam, 1, (g) => {
    const r = rng(11), cols = [ui.accent, ui.gold, PHONE_GLOW, ui.cream];
    for (let i = 0; i < 22; i++) { const st = tP + 0.6 + r() * (info.dur - tP - 1.2), k = clamp((t - st) / 1.6); if (k <= 0) continue;
      const ex = E.W * V(0.22, 0.3) + (r() - 0.5) * 300, ey = GY - 300 + (r() - 0.5) * 300;
      const x = lerp(dx, ex, ease.in(k)), y = lerp(GY - dh * (0.2 + r() * 0.6), ey, ease.in(k)); icon(g, i % 4, x, y, (18 + r() * 16) * (0.6 + k), alpha(cols[i % 4], 1)); }
    drawFigure(g, { x: E.W * V(0.24, 0.3), y: GY, s: V(1.45, 1.5), facing: 1, outfit: TU, pose: breathe(posesAt(t, [[0, POSES.phone], [tD - 0.3, POSES.handsOnHead]]), t), expr: t > tD - 0.3 ? 'worried' : 'awe', prop: t < tD - 0.3 ? 'phone' : null, rim: { color: PHONE_GLOW, dir: [1, -0.3], w: 5 } });
  });
  FX.dust(g, t, { count: 40, color: '#cfe8ff', a: 0.3 });
} });
function linGradBg(g) { const M = mood('night'); const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, shade(M.wall, -0.75)); gr.addColorStop(1, shade(M.wall, -0.5)); return gr; }
