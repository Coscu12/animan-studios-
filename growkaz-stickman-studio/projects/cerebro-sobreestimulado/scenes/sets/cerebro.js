// sets/cerebro.js — blueprint line-art helpers: brain side view, reward pathway, neuron/synapse, the gold dopamine spark.
import { E, V, S, seg, circle, ring, glow, alpha, clamp, lerp, ease, prog, text, FONTS } from '/engine/core.js';

// draw a polyline/curve list with a "drawing on" reveal (p 0..1)
function strokeReveal(g, build, p, w, col) {
  if (p <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  g.setLineDash([4000 * p, 4000]); g.beginPath(); build(g); g.stroke(); g.restore();
}
// brain facing left, centred at (x, y), radius-ish r. p = draw-on progress, fill = gold inner glow 0..1
export function brain(g, x, y, r, o = {}) {
  const { p = 1, col = S().ui.blueprint, w = 5, lit = 0 } = o;
  const P = (u, v) => [x + u * r, y + v * r];
  if (lit > 0) { glow(g, x, y, r * 1.6, S().ui.gold, 0.35 * lit); }
  strokeReveal(g, (g) => {                                  // outer cortex
    const pts = [[-1.0, 0.1], [-1.02, -0.3], [-0.8, -0.68], [-0.4, -0.9], [0.1, -0.92], [0.55, -0.78], [0.9, -0.45], [1.0, -0.05], [0.88, 0.3], [0.6, 0.45], [0.3, 0.42], [0.05, 0.5], [-0.35, 0.48], [-0.75, 0.4], [-1.0, 0.1]];
    g.moveTo(...P(...pts[0])); for (let i = 1; i < pts.length; i++) { const a = P(...pts[i - 1]), b = P(...pts[i]); g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); } g.lineTo(...P(-1.0, 0.1));
  }, p, w, col);
  strokeReveal(g, (g) => {                                  // cerebellum + stem
    g.moveTo(...P(0.55, 0.45)); g.quadraticCurveTo(...P(0.95, 0.42), ...P(0.85, 0.68)); g.quadraticCurveTo(...P(0.62, 0.8), ...P(0.42, 0.62));
    g.moveTo(...P(0.22, 0.45)); g.quadraticCurveTo(...P(0.25, 0.75), ...P(0.18, 1.0)); g.moveTo(...P(0.38, 0.5)); g.quadraticCurveTo(...P(0.4, 0.75), ...P(0.34, 1.0));
  }, clamp(p * 1.3 - 0.3), w * 0.9, col);
  strokeReveal(g, (g) => {                                  // sulci
    for (const s of [[[-0.7, -0.5], [-0.45, -0.3], [-0.6, -0.05]], [[-0.25, -0.75], [-0.1, -0.45], [-0.3, -0.2]], [[0.15, -0.8], [0.25, -0.5], [0.05, -0.25]], [[0.55, -0.6], [0.45, -0.3], [0.65, -0.1]], [[-0.8, 0.15], [-0.5, 0.2], [-0.2, 0.3]], [[0.0, 0.1], [0.3, 0.05], [0.6, 0.2]]]) { g.moveTo(...P(...s[0])); g.quadraticCurveTo(...P(...s[1]), ...P(...s[2])); }
  }, clamp(p * 1.5 - 0.5), w * 0.6, alpha(col, 0.6));
}
// reward pathway nodes (relative to brain): VTA (midbrain) -> nucleus accumbens -> prefrontal cortex
export const PATH = [[0.25, 0.32], [-0.25, 0.12], [-0.72, -0.2]];
export function pathway(g, x, y, r, p, o = {}) {
  const gold = S().ui.gold, pts = PATH.map(([u, v]) => [x + u * r, y + v * r]);
  for (let i = 0; i < pts.length - 1; i++) {
    const k = clamp(p * (pts.length - 1) - i); if (k <= 0) continue;
    const [ax, ay] = pts[i], [bx, by] = pts[i + 1];
    seg(g, [[ax, ay], [lerp(ax, bx, k), lerp(ay, by, k)]], 6, alpha(gold, 0.9)); glow(g, lerp(ax, bx, k), lerp(ay, by, k), 40, gold, 0.8);
  }
  pts.forEach(([px, py], i) => { const on = clamp(p * (pts.length - 1) - i + 1); if (on <= 0) return; glow(g, px, py, 80 * on, gold, 0.6); circle(g, px, py, 12 * ease.outBack(clamp(on * 2)), gold); });
  return pts;
}
// the dopamine spark
export function spark(g, x, y, s = 1, t = 0, a = 1) {
  const gold = S().ui.gold; glow(g, x, y, 90 * s, gold, 0.7 * a); glow(g, x, y, 30 * s, '#fff8e0', 0.9 * a);
  circle(g, x, y, 9 * s, alpha('#fffbe8', a));
  for (let i = 0; i < 4; i++) { const an = t * 2 + i * Math.PI / 2; seg(g, [[x + Math.cos(an) * 16 * s, y + Math.sin(an) * 16 * s], [x + Math.cos(an) * 30 * s, y + Math.sin(an) * 30 * s]], 3 * s, alpha(gold, 0.7 * a)); }
}
// gift/reward icon
export function rewardIcon(g, x, y, r, col) {
  g.strokeStyle = col; g.lineWidth = 6; g.lineJoin = 'round'; g.strokeRect(x - r, y - r * 0.6, r * 2, r * 1.5); g.strokeRect(x - r * 1.12, y - r * 0.95, r * 2.24, r * 0.4);
  seg(g, [[x, y - r * 0.95], [x, y + r * 0.9]], 6, col);
  g.beginPath(); g.ellipse(x - r * 0.35, y - r * 1.15, r * 0.35, r * 0.2, -0.4, 0, 7); g.ellipse(x + r * 0.35, y - r * 1.15, r * 0.35, r * 0.2, 0.4, 0, 7); g.stroke();
}
// hexagon ring for the molecule
export function hex(g, x, y, r, col, w = 5, p = 1) {
  g.save(); g.strokeStyle = col; g.lineWidth = w; g.lineJoin = 'round'; g.setLineDash([r * 6 * p, r * 7]); g.beginPath();
  for (let i = 0; i <= 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.restore();
}
// glowing word label
export function label(g, str, x, y, o = {}) { text(g, str, x, y, { size: V(46, 50), color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, ...o }); }
// scarcity meter: label + short bar
export function scarcity(g, t, str, v, o = {}) {
  const ui = S().ui, x = o.x ?? V(120, 90), y = o.y ?? E.H - V(170, 520), w = V(520, 700), a = ease.out(prog(t, o.start ?? 0.3, (o.start ?? 0.3) + 0.4)) * clamp((o.dur - t) / 0.3);
  if (a <= 0) return; g.save(); g.globalAlpha *= a;
  text(g, str, x, y - 44, { size: V(34, 40), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  g.fillStyle = alpha(ui.cream, 0.12); g.beginPath(); g.roundRect(x, y - 14, w, 28, 14); g.fill();
  const k = ease.out(prog(t, (o.start ?? 0.3) + 0.2, (o.start ?? 0.3) + 1.0)) * v;
  g.fillStyle = ui.accent; g.beginPath(); g.roundRect(x, y - 14, Math.max(28, w * k), 28, 14); g.fill(); glow(g, x + w * k, y, 40, ui.accent, 0.6);
  text(g, o.tag || 'ESCASA', x + w + 24, y, { size: V(30, 34), color: ui.accent, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: clamp((t - (o.start ?? 0.3) - 0.8) / 0.3) });
  g.restore();
}
