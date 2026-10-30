// thumbs.js — five YouTube thumbnails: huge 2-line outlined text left, big character close-up right, one loud effect, blurred night bokeh.
import { E, S, blurLayer, registerShot, mood, rr, seg, circle, ring, glow, alpha, shade, mix, radGrad, linGrad, text, measure, FONTS, rng, poly } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';

const HERO = { top: 'hoodie', color: '#8a5ad6', head: 'hood', headColor: '#8a5ad6' };
const W = () => E.W, H = () => E.H;
// blurred night city with bokeh, tinted emerald
function bokeh(g, tint = '#0a2a1e') {
  g.fillStyle = linGrad(g, 0, 0, 0, H(), ['#03120c', tint, '#020a07']); g.fillRect(0, 0, W(), H());
  blurLayer(g, 10, (g) => FX.skyline(g, { x: -40, y: H() * 1.02, w: W() + 80, minH: 300, maxH: 900, minW: 120, maxW: 260, color: '#06180f', windowColor: alpha('#ffd45a', 0.55), lit: 0.35, seed: 7 }));
  const r = rng(3); for (let i = 0; i < 40; i++) { const x = r() * W(), y = r() * H(), rad = 10 + r() * 40; g.fillStyle = alpha(['#ffd45a', '#7dffb0', '#c6ff3d', '#ff9a5a'][i % 4], 0.08 + r() * 0.12); g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill(); }
  for (let i = 0; i < 70; i++) { const x = r() * W(), y = r() * H(); seg(g, [[x, y], [x - 8, y + 34]], 2, alpha('#cfe8ff', 0.18)); }
}
// big outlined thumbnail text (white line + yellow line)
function title(g, lines, o = {}) {
  const x = o.x ?? 70, y0 = o.y ?? 230, size = o.size ?? 190, gap = o.gap ?? size * 0.98;
  lines.forEach((ln, i) => {
    const col = i === lines.length - 1 ? (o.c2 || '#ffe14a') : '#ffffff', sz = Math.min(o.sizes?.[i] ?? size, (o.maxW ?? 1050) / Math.max(1, measure(g, ln, size, FONTS.title, 700) / size)), y = y0 + i * gap;
    text(g, ln, x + 10, y + 14, { size: sz, font: FONTS.title, weight: 700, align: 'left', color: 'rgba(0,0,0,.55)', stroke: 34, strokeColor: 'rgba(0,0,0,.55)' });
    text(g, ln, x, y, { size: sz, font: FONTS.title, weight: 700, align: 'left', color: col, stroke: 30, strokeColor: '#0b0f0c' });
  });
}
// smug glowing eyes overlay on a front bigFace (half-closed lids)
function eyes(g, cx, cy, r, col = '#c6ff3d', lid = 0.5, tilt = 0.18) {
  for (const sd of [-1, 1]) { const ex = cx + sd * r * 0.34, ey = cy - r * 0.16; circle(g, ex, ey, r * 0.24, S().ink); }   // hide the stock eyes
  for (const sd of [-1, 1]) { const ex = cx + sd * r * 0.34, ey = cy - r * 0.16, er = r * 0.15;
    glow(g, ex, ey, r * 0.3, col, 0.5);
    g.save(); g.translate(ex, ey); g.rotate(sd * tilt); g.beginPath(); g.rect(-er * 1.2, -er + er * 2 * lid * 0.8, er * 2.4, er * 2); g.clip(); circle(g, 0, 0, er, '#f4ffe0'); g.restore();
    g.save(); g.translate(ex, ey); g.rotate(sd * tilt); seg(g, [[-er * 1.3, -er + er * 2 * lid * 0.8], [er * 1.3, -er + er * 2 * lid * 0.8]], r * 0.06, '#f4ffe0'); g.restore(); }
}
function smirk(g, cx, cy, r) { g.fillStyle = S().ink; g.beginPath(); g.ellipse(cx, cy + r * 0.32, r * 0.42, r * 0.2, 0, 0, 7); g.fill(); g.strokeStyle = '#f4ffe0'; g.lineWidth = r * 0.07; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - r * 0.25, cy + r * 0.32); g.quadraticCurveTo(cx + r * 0.1, cy + r * 0.45, cx + r * 0.32, cy + r * 0.2); g.stroke(); }
function phone(g, x, y, s = 1, rot = 0, screen = '#9fd8ff') {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  glow(g, 0, 0, 260, screen, 0.55); rr(g, -70, -135, 140, 270, 22); g.fillStyle = '#05080a'; g.fill();
  rr(g, -60, -122, 120, 244, 14); g.fillStyle = linGrad(g, 0, -122, 0, 122, ['#d8f4ff', screen]); g.fill();
  for (let i = 0; i < 4; i++) { rr(g, -48, -105 + i * 58, 96, 44, 10); g.fillStyle = alpha('#0b2a3a', 0.25); g.fill(); }
  g.restore();
}
function icon(g, kind, x, y, r, col) {
  circle(g, x, y, r, '#0b1a14'); ring(g, x, y, r, r * 0.14, col); g.fillStyle = col;
  if (kind === 0) { g.beginPath(); g.moveTo(x, y + r * 0.45); g.bezierCurveTo(x - r * 0.9, y - r * 0.1, x - r * 0.35, y - r * 0.75, x, y - r * 0.25); g.bezierCurveTo(x + r * 0.35, y - r * 0.75, x + r * 0.9, y - r * 0.1, x, y + r * 0.45); g.fill(); }
  else if (kind === 1) { g.beginPath(); g.moveTo(x - r * 0.25, y - r * 0.4); g.lineTo(x + r * 0.45, y); g.lineTo(x - r * 0.25, y + r * 0.4); g.closePath(); g.fill(); }
  else if (kind === 2) { rr(g, x - r * 0.5, y - r * 0.35, r, r * 0.6, r * 0.2); g.fill(); }
  else text(g, kind === 3 ? '?' : '!', x, y + 2, { size: r * 1.2, color: col, font: FONTS.ui, weight: 900 });
}
function badge(g, x, y, n) { glow(g, x, y, 70, '#ff4a3a', 0.7); circle(g, x, y, 38, '#ff3b30'); ring(g, x, y, 38, 6, '#0b0f0c'); text(g, String(n), x, y + 2, { size: 40, color: '#fff', font: FONTS.ui, weight: 900 }); }
function face(g, cx, cy, r, expr = 'neutral', rim = '#c6ff3d') { bigFace(g, cx, cy, r, { outfit: HERO, expr, look: [0, 0], rimColor: rim, rimSide: 1 }); }
function hands(g, cx, cy, s = 1) { for (const sd of [-1, 1]) { const x = cx + sd * 150 * s, y = cy; seg(g, [[x + sd * 160 * s, y + 260 * s], [x, y + 40 * s]], 120 * s, '#8a5ad6'); circle(g, x, y, 62 * s, S().ink); for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + sd * (0.2 + i * 0.32); seg(g, [[x, y], [x + Math.cos(a) * 85 * s, y + Math.sin(a) * 85 * s]], 24 * s, S().ink); } } }

// 1 — "NO ESTÁS ROTO."  smug face, phone exploding with notifications
registerShot('m1', { draw(g) { bokeh(g);
  const cx = 1380, cy = 560, r = 330; face(g, cx, cy, r, 'neutral'); eyes(g, cx, cy, r, '#c6ff3d', 0.55); smirk(g, cx, cy, r);
  phone(g, 960, 830, 1.15, -0.18); const cols = ['#ff4a3a', '#ffd45a', '#7dffb0', '#9fd8ff']; [[820, 600, 0], [1090, 560, 2], [760, 760, 1], [1150, 760, 3]].forEach(([x, y, k], i) => icon(g, k, x, y, 50, cols[i])); badge(g, 1030, 690, 99);
  title(g, ['NO ESTÁS', 'ROTO.'], { y: 250, size: 200 }); } });
// 2 — "47 SEGUNDOS."  shocked face, giant stopwatch
registerShot('m2', { draw(g) { bokeh(g, '#2a0f0a');
  const cx = 1420, cy = 600, r = 330; face(g, cx, cy, r, 'shocked', '#ffd45a');
  const sx = 880, sy = 780, R = 200; glow(g, sx, sy, 380, '#ff6f61', 0.4); circle(g, sx, sy, R, '#0b0f0c'); ring(g, sx, sy, R, 26, '#ffd02a'); rr(g, sx - 40, sy - R - 70, 80, 60, 12); g.fillStyle = '#ffd02a'; g.fill();
  g.strokeStyle = '#ff3b30'; g.lineWidth = 30; g.lineCap = 'butt'; g.beginPath(); g.arc(sx, sy, R - 40, -Math.PI / 2, -Math.PI / 2 + (47 / 60) * Math.PI * 2); g.stroke(); seg(g, [[sx, sy], [sx - 120, sy - 90]], 14, '#ffffff'); circle(g, sx, sy, 18, '#ffffff');
  title(g, ['TU ATENCIÓN:', '47 SEG.'], { y: 230, size: 170, sizes: [150, 200], maxW: 1000 }); } });
// 3 — "SOBRE-ESTIMULADO."  face with electric overload
registerShot('m3', { draw(g) { bokeh(g);
  const cx = 1380, cy = 570, r = 320; glow(g, cx, cy, 560, '#7dffb0', 0.35); face(g, cx, cy, r, 'neutral');
  for (const s of [-1, 1]) { const ex = cx + s * r * 0.34, ey = cy - r * 0.16; glow(g, ex, ey, r * 0.5, '#9fe8ff', 0.8); g.strokeStyle = '#f4ffe0'; g.lineWidth = 10; g.beginPath(); for (let a = 0; a < 12; a += 0.25) { const rr2 = 4 + a * 7; g.lineTo(ex + Math.cos(a) * rr2, ey + Math.sin(a) * rr2); } g.stroke(); }
  g.strokeStyle = '#f4ffe0'; g.lineWidth = 20; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 8; i++) g.lineTo(cx - r * 0.35 + i * r * 0.0875, cy + r * 0.38 + (i % 2 ? -20 : 20)); g.stroke();
  for (let i = 0; i < 6; i++) FX.lightning(g, { seed: 11 + i, x1: cx + Math.cos(i) * 240, y1: cy - 240 + Math.sin(i * 2) * 80, x2: cx + Math.cos(i) * 520, y2: cy - 120 + Math.sin(i * 3) * 300, color: '#9fe8ff', w: 5, branches: 2, jag: 70 });
  const cols = ['#ff4a3a', '#ffd45a', '#7dffb0', '#9fd8ff']; for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.6; icon(g, i % 5, cx + Math.cos(a) * 470, cy + Math.sin(a) * 380, 40, cols[i % 4]); }
  title(g, ['SOBRE-', 'ESTIMULADO.'], { y: 250, size: 180, maxW: 900 }); } });
// 4 — "NO LO TOQUES."  hands around a crackling phone (dopamine lightning)
registerShot('m4', { draw(g) { bokeh(g);
  const cx = 1340, cy = 400, r = 290; face(g, cx, cy, r, 'neutral', '#ffd45a'); eyes(g, cx, cy, r, '#ffd45a', 0.7, 0.3); smirk(g, cx, cy, r);
  const px = 1340, py = 820; glow(g, px, py, 420, '#ffd45a', 0.55); for (let i = 0; i < 7; i++) FX.lightning(g, { seed: 30 + i, x1: px, y1: py, x2: px + Math.cos(i * 0.9) * 360, y2: py + Math.sin(i * 0.9) * 220 - 60, color: '#ffe680', w: 5, branches: 2, jag: 60 });
  phone(g, px, py, 0.95, 0.12, '#ffe9a0'); hands(g, px, py + 20, 1.1);
  title(g, ['NO LO', 'TOQUES.'], { y: 250, size: 210 }); } });
// 5 — "TE ESTÁN HACKEANDO."  face lit by the phone, dopamine spark pulled on a string
registerShot('m5', { draw(g) { bokeh(g, '#0a1a2a');
  const cx = 1400, cy = 560, r = 320; glow(g, cx - 40, cy + 300, 500, '#9fd8ff', 0.5); face(g, cx, cy, r, 'neutral', '#9fd8ff'); eyes(g, cx, cy, r, '#9fd8ff', 0.85, 0.05);
  g.fillStyle = S().ink; g.beginPath(); g.ellipse(cx, cy + r * 0.32, r * 0.42, r * 0.2, 0, 0, 7); g.fill(); g.strokeStyle = '#f4ffe0'; g.lineWidth = r * 0.07; g.beginPath(); g.moveTo(cx - r * 0.2, cy + r * 0.35); g.lineTo(cx + r * 0.2, cy + r * 0.35); g.stroke();
  const sx = 960, sy = 500;   glow(g, sx, sy, 220, '#ffd45a', 0.85); glow(g, sx, sy, 70, '#fff8e0', 1); circle(g, sx, sy, 28, '#fffbe8'); text(g, 'DOPAMINA', sx, sy + 120, { size: 52, color: '#ffd02a', font: FONTS.ui, weight: 900, stroke: 10, strokeColor: '#0b0f0c' });
  phone(g, 1180, 930, 1.0, -0.25);
  title(g, ['TU CEREBRO', 'TE ENGAÑA.'], { y: 230, size: 170, maxW: 900 }); } });
