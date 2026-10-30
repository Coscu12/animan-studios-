// shots/02_cerebro.js — blueprint science: the brain, the reward system, dopamine, wanting vs liking, prediction error.
import { E, V, S, registerShot, ease, prog, key, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, text, FONTS } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { brain, pathway, PATH, spark, rewardIcon, hex, label } from '../sets/cerebro.js';

const wt = (w, info, d = 0.5) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;
const zoomCam = (g, t, info, z0 = 1, z1 = 1.06) => { const z = lerp(z0, z1, ease.inOut(t / info.dur)); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };

// s03 — "Tu cerebro fue diseñado para un mundo que ya no existe."
registerShot('s03', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info);
  const c = UI.bpStroke(), gold = S().ui.gold, bx = E.W * V(0.36, 0.5), by = E.H * V(0.48, 0.36), r = V(230, 260);
  brain(g, bx, by, r, { p: ease.inOut(prog(t, 0, 1.4)), col: c });
  label(g, 'TU CEREBRO', bx, by + r * 1.3, { alpha: ease.out(prog(t, 0.4, 0.8)), size: V(40, 46) });
  const tM = wt('mundo', info, 2.0), k = ease.inOut(prog(t, tM - 0.3, tM + 0.6));
  const sx = E.W * V(0.76, 0.5), sy = E.H * V(0.46, 0.76);
  g.setLineDash([10, 12]); seg(g, [[bx + r * V(1.1, 0), by + r * V(0, 1.15)], [lerp(bx + r * V(1.1, 0), sx - V(150, 0), k), lerp(by + r * V(0, 1.15), sy - V(0, 150), k)]], 3, alpha(c, 0.6)); g.setLineDash([]);
  if (k > 0.6) {
    const a = clamp((k - 0.6) / 0.4); g.save(); g.globalAlpha *= a;
    ring(g, sx, sy, 130, 4, c); g.save(); g.beginPath(); g.arc(sx, sy, 126, 0, 7); g.clip();
    glow(g, sx, sy + 20, 120, gold, 0.5); circle(g, sx, sy + 20, 40, alpha(gold, 0.9)); g.fillStyle = alpha(c, 0.35); g.fillRect(sx - 140, sy + 50, 280, 100);
    for (const dx of [-60, 70]) { seg(g, [[sx + dx, sy + 50], [sx + dx, sy - 10]], 5, c); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.ellipse(sx + dx, sy - 16, 34, 8, 0, 0, 7); g.stroke(); }
    g.restore(); label(g, 'LA SABANA', sx, sy + 175, { size: V(34, 40) });
    const tE = wt('existe', info, 3.0); if (t > tE) { const x = ease.out(prog(t, tE, tE + 0.3)); seg(g, [[sx - 110 * x, sy - 110 * x], [sx + 110 * x, sy + 110 * x]], 8, S().ui.accent); }
    g.restore();
  }
  g.restore();
} });

// s11 — "tu cerebro desarrolló un sistema brillante."  reward pathway lights up
registerShot('s11', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info, 1.05, 1.12);
  const c = UI.bpStroke(), bx = E.W / 2, by = E.H * V(0.48, 0.42), r = V(320, 360), tS = wt('sistema', info, 1.4);
  const p = ease.inOut(prog(t, tS - 0.4, tS + 1.2));
  brain(g, bx, by, r, { col: c, lit: p * 0.7 });
  const pts = pathway(g, bx, by, r, p);
  const names = ['ÁREA TEGMENTAL', 'NÚCLEO ACCUMBENS', 'CORTEZA PREFRONTAL'];
  pts.forEach(([x, y], i) => UI.callout(g, t, { at: [x, y], to: [x + (i === 2 ? -V(120, 60) : V(160, 120)), y + (i === 0 ? V(150, 170) : -V(160, 200) + i * 40)], str: names[i], start: tS - 0.3 + i * 0.45, size: V(26, 30) }));
  g.restore();
  if (p > 0.95) UI.badge(g, { str: 'SISTEMA DE RECOMPENSA', a: ease.out(prog(t, tS + 1.1, tS + 1.5)), size: V(34, 38) });
} });

// s12 — "Ese sistema tiene un mensajero químico."  synapse macro, sparks jump the gap
registerShot('s12', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info, 1.0, 1.08);
  const c = UI.bpStroke(), cx = E.W / 2, cy = E.H / 2, gap = V(60, 70);
  g.strokeStyle = c; g.lineWidth = 5;
  // presynaptic terminal (left) / postsynaptic (right)
  g.beginPath(); g.moveTo(-50, cy - 90); g.lineTo(cx - 320, cy - 90); g.quadraticCurveTo(cx - gap - 20, cy - 220, cx - gap, cy); g.quadraticCurveTo(cx - gap - 20, cy + 220, cx - 320, cy + 90); g.lineTo(-50, cy + 90); g.stroke();
  g.beginPath(); g.moveTo(E.W + 50, cy - 200); g.lineTo(cx + 300, cy - 200); g.quadraticCurveTo(cx + gap - 30, cy - 200, cx + gap, cy); g.quadraticCurveTo(cx + gap - 30, cy + 200, cx + 300, cy + 200); g.lineTo(E.W + 50, cy + 200); g.stroke();
  for (let i = -3; i <= 3; i++) { rr(g, cx + gap + 4, cy + i * 44 - 10, 22, 20, 6); g.fillStyle = alpha(c, 0.5); g.fill(); }
  for (let i = 0; i < 5; i++) ring(g, cx - gap - 120 + (i % 2) * 40, cy - 80 + i * 40, 18, 3, alpha(c, 0.6));
  const tM = wt('mensajero', info, 1.2);
  for (let i = 0; i < 14; i++) { const ph = ((t - tM + 0.4) * 0.8 + i / 14) % 1; if (t < tM - 0.4) break; const x = lerp(cx - gap - 30, cx + gap + 8, ph), y = cy + Math.sin(i * 2.3) * 140 * (1 - Math.abs(ph - 0.5)); spark(g, x, y, 0.45, t + i, clamp(1 - ph * 0.5)); }
  g.restore();
  label(g, 'MENSAJERO QUÍMICO', E.W / 2, E.H * V(0.86, 0.8), { alpha: ease.out(prog(t, tM, tM + 0.4)), color: S().ui.gold, glow: 16, glowColor: alpha(S().ui.gold, 0.6) });
} });

// s13 — "Se llama dopamina."  molecule + title
registerShot('s13', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, tD = wt('dopamina', info, 0.8);
  g.save(); const z = 1 + 0.05 * t; g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const mx = E.W / 2 - V(0, 0), my = E.H * V(0.4, 0.38), r = V(70, 80), p = ease.inOut(prog(t, 0, 1.2));
  hex(g, mx - r * 0.9, my, r, c, 5, p);
  seg(g, [[mx - r * 0.9 + r * 0.87, my - r * 0.5], [mx + r * 0.6, my - r * 1.0]], 5, alpha(c, p)); seg(g, [[mx + r * 0.6, my - r * 1.0], [mx + r * 1.4, my - r * 0.5]], 5, alpha(c, p)); seg(g, [[mx + r * 1.4, my - r * 0.5], [mx + r * 2.2, my - r * 1.0]], 5, alpha(c, p));
  if (p > 0.6) { text(g, 'NH₂', mx + r * 2.6, my - r * 1.1, { size: V(34, 38), color: c, font: FONTS.ui, weight: 900, alpha: clamp((p - 0.6) / 0.4) }); for (const [dx, dy] of [[-1.77, -0.5], [-1.77, 0.5]]) { const x = mx - r * 0.9 + dx * r, y = my + dy * r; seg(g, [[x + r * 0.03, y], [x - r * 0.5, y + dy * r * 0.5]], 5, alpha(c, (p - 0.6) / 0.4)); text(g, 'OH', x - r * 0.9, y + dy * r * 0.7, { size: V(30, 34), color: c, font: FONTS.ui, weight: 900, alpha: clamp((p - 0.6) / 0.4) }); } }
  const a = ease.out(prog(t, tD - 0.1, tD + 0.4));
  if (a > 0) { glow(g, E.W / 2, E.H * V(0.68, 0.62), 500, gold, 0.25 * a); text(g, 'DOPAMINA', E.W / 2, E.H * V(0.68, 0.62), { size: V(130, 120) * (0.9 + 0.1 * ease.outBack(a)), color: gold, glow: 30, glowColor: alpha(gold, 0.8), spacing: 10, alpha: a }); }
  g.restore();
  FX.dust(g, t, { count: 30, color: gold, a: 0.3 });
} });

// shared board for s17/s18: QUERER vs DISFRUTAR
function wantLike(g, t, o) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold;
  const L = [E.W * V(0.28, 0.5), E.H * V(0.46, 0.3)], R = [E.W * V(0.72, 0.5), E.H * V(0.46, 0.66)];
  if (!E.vertical) { g.setLineDash([12, 14]); seg(g, [[E.W / 2, E.H * 0.18], [E.W / 2, E.H * 0.8]], 3, alpha(c, 0.4)); g.setLineDash([]); }
  const aL = ease.outBack(prog(t, o.tQ - 0.1, o.tQ + 0.4)), aR = ease.outBack(prog(t, o.tD - 0.1, o.tD + 0.4));
  const hl = o.hl ?? 0;
  if (aL > 0) { g.save(); g.globalAlpha *= clamp(aL); const col = hl > 0 ? gold : c; if (hl > 0) glow(g, L[0], L[1], 300, gold, 0.25 * hl);
    UI.lineFigure(g, { x: L[0] - 40, y: L[1] + 140, s: 1.3, pose: POSES.reach, color: col }); glow(g, L[0] + 120, L[1] - 150, 60, gold, 0.6); circle(g, L[0] + 120, L[1] - 150, 16, gold);
    text(g, 'QUERER', L[0], L[1] + 220, { size: V(64, 66), color: col, font: FONTS.ui, weight: 900, spacing: 4, glow: hl ? 20 : 0, glowColor: alpha(gold, 0.6) }); g.restore(); }
  if (aR > 0) { g.save(); g.globalAlpha *= clamp(aR) * (1 - 0.45 * hl);
    UI.lineFigure(g, { x: R[0], y: R[1] + 140, s: 1.3, pose: POSES.relaxed, color: c }); for (let i = 0; i < 3; i++) FX.sparkle(g, R[0] - 90 + i * 90, R[1] - 170 - (i % 2) * 30, 12, c, 0.6);
    text(g, 'DISFRUTAR', R[0], R[1] + 220, { size: V(64, 66), color: c, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  return { L, R };
}
// s17 — "distinguió entre dos cosas: querer y disfrutar."
registerShot('s17', { draw(g, t, info) { g.save(); zoomCam(g, t, info, 1.04, 1.0); wantLike(g, t, { tQ: wt('querer', info, 1.7), tD: wt('disfrutar', info, 2.5) }); g.restore(); } });
// s18 — "Y descubrió que la dopamina está mucho más ligada al querer."
registerShot('s18', { draw(g, t, info) {
  g.save(); zoomCam(g, t, info, 1.0, 1.05);
  const tQ = wt('querer', info, 3.0), hl = ease.inOut(prog(t, tQ - 0.6, tQ + 0.2));
  const { L } = wantLike(g, t, { tQ: -1, tD: -1, hl });
  const tDa = wt('dopamina', info, 1.2);
  for (let i = 0; i < 8; i++) { const ph = clamp((t - tDa) * 0.7 - i * 0.08); if (ph <= 0 || ph >= 1) continue; const x = lerp(E.W / 2, L[0] + 60, ease.inOut(ph)), y = lerp(-40, L[1] - 40, ease.inOut(ph)) + Math.sin(ph * 6 + i) * 40; spark(g, x, y, 0.5, t + i, 1 - ph * 0.3); }
  g.restore();
  const ui = S().ui; [['QUERER', 0.92, ui.gold], ['DISFRUTAR', 0.25, UI.bpStroke()]].forEach(([lab, v, col], i) => {
    const p = ease.out(prog(t, tDa + 0.6 + i * 0.3, tDa + 1.6 + i * 0.3)), x = V(500, 120), y = E.H - V(150, 320) + i * 62, w = V(760, 700);
    text(g, lab, x, y, { size: V(30, 34), color: col, font: FONTS.ui, weight: 900, align: 'left', spacing: 2, alpha: clamp(p * 3) });
    rr(g, x + V(220, 240), y - 14, w, 28, 14); g.fillStyle = alpha(col, 0.15); g.fill(); if (p > 0) { rr(g, x + V(220, 240), y - 14, Math.max(28, w * v * p), 28, 14); g.fillStyle = col; g.fill(); } });
} });

// s21 — "La dopamina no es la recompensa."
registerShot('s21', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info, 1.0, 1.06);
  const c = UI.bpStroke(), rx = E.W * V(0.66, 0.5), ry = E.H * V(0.48, 0.42), sx = E.W * V(0.3, 0.5), sy = E.H * V(0.48, 0.72);
  rewardIcon(g, rx, ry, V(110, 120), c); label(g, 'RECOMPENSA', rx, ry + V(200, 220), { size: V(40, 44) });
  spark(g, sx, sy + Math.sin(t * 2) * 10, 1.4, t); label(g, 'DOPAMINA', sx, sy + V(140, 130), { size: V(40, 44), color: S().ui.gold });
  const tN = wt('no', info, 0.9), k = ease.out(prog(t, tN, tN + 0.3));
  if (k > 0) { const mx = (sx + rx) / 2, my = (sy + ry) / 2; seg(g, [[mx - 60 * k, my - 60 * k], [mx + 60 * k, my + 60 * k]], 12, S().ui.accent); seg(g, [[mx + 60 * k, my - 60 * k], [mx - 60 * k, my + 60 * k]], 12, S().ui.accent); }
  g.restore();
} });

// s22 — "Es la promesa de la recompensa."  the spark runs ahead along the path
registerShot('s22', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info, 1.06, 1.0);
  const c = UI.bpStroke(), gold = S().ui.gold, x0 = E.W * V(0.12, 0.2), x1 = E.W * V(0.78, 0.8), y = E.H * V(0.5, 0.5);
  const path = (u) => [lerp(x0, x1, u), y - Math.sin(u * Math.PI) * V(160, 260)];
  g.setLineDash([12, 14]); g.strokeStyle = alpha(c, 0.5); g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 60; i++) { const [px, py] = path(i / 60); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.setLineDash([]);
  rewardIcon(g, x1 + V(90, 0), y - V(0, 120), V(70, 80), alpha(c, 0.7));
  const u = ease.inOut(prog(t, 0.2, info.dur - 0.4)) * 0.92, [px, py] = path(u);
  for (let i = 1; i <= 6; i++) { const [qx, qy] = path(Math.max(0, u - i * 0.03)); glow(g, qx, qy, 30, gold, 0.3 * (1 - i / 7)); }
  spark(g, px, py, 1.2, t);
  const tP = wt('promesa', info, 0.5);
  label(g, 'LA PROMESA', px, py - V(110, 120), { color: gold, glow: 18, glowColor: alpha(gold, 0.7), alpha: ease.out(prog(t, tP, tP + 0.35)) });
  g.restore();
} });

// shared firing chart (Schultz): baseline spikes, optional burst at tB
function firingChart(g, t, o) {
  const c = UI.bpStroke(), gold = S().ui.gold, x0 = V(220, 100), x1 = E.W - V(220, 100), y = E.H * V(0.62, 0.5), H = V(300, 420);
  seg(g, [[x0, y], [x1, y]], 3, alpha(c, 0.6)); seg(g, [[x0, y], [x0, y - H - 30]], 3, alpha(c, 0.6));
  text(g, 'ACTIVIDAD DE LAS NEURONAS DE DOPAMINA', x0, y - H - 60, { size: V(26, 30), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  const n = 46, head = clamp(t / (o.sweep ?? 2.6));
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1); if (u > head) break; const x = lerp(x0 + 30, x1 - 30, u);
    const burst = o.burstU != null && Math.abs(u - o.burstU) < 0.06, quiet = o.quietFrom != null && u > o.quietFrom;
    const h = burst ? H * (0.75 + 0.25 * Math.sin(i * 7.1)) : quiet ? H * 0.04 : H * (0.12 + 0.1 * Math.abs(Math.sin(i * 3.7)));
    seg(g, [[x, y], [x, y - h]], burst ? 7 : 4, burst ? gold : c); if (burst) glow(g, x, y - h, 40, gold, 0.6);
  }
  return { x0, x1, y, H };
}
// s27 — "reaccionan con más fuerza ante lo inesperado."
registerShot('s27', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info, 1.0, 1.05);
  const tI = wt('inesperado', info, 2.0), sweep = tI / 0.62;
  const ch = firingChart(g, t, { burstU: 0.62, sweep });
  const bx = lerp(ch.x0 + 30, ch.x1 - 30, 0.62);
  UI.callout(g, t, { at: [bx, ch.y - ch.H * 0.95], to: [bx + V(160, 60), ch.y - ch.H - V(10, 60)], str: '¡INESPERADO!', start: tI, color: S().ui.gold, size: V(40, 44) });
  g.restore();
} });
// s28 — "Cuando una recompensa supera lo que esperabas, el sistema se enciende."
registerShot('s28', { draw(g, t, info) {
  UI.blueprint(g); FX.dust(g, t, { count: 24, color: S().ui.blueprint, a: 0.25 }); g.save(); zoomCam(g, t, info, 1.0, 1.04);
  const c = UI.bpStroke(), gold = S().ui.gold, tS = wt('supera', info, 1.3), tE = wt('enciende', info, 3.8);
  const x = E.W * V(0.3, 0.5), base = E.H * V(0.78, 0.5), H = V(420, 420), w = V(150, 170);
  const exp = 0.55, got = 0.55 + 0.4 * ease.outBack(prog(t, tS, tS + 0.9));
  text(g, 'LO QUE ESPERABAS', x - w * 1.3, base - H * exp - 30, { size: V(26, 30), color: alpha(c, 0.9), font: FONTS.ui, weight: 900, align: 'right', spacing: 2, alpha: ease.out(prog(t, 0.2, 0.6)) });
  g.setLineDash([12, 10]); seg(g, [[x - w * 1.2, base - H * exp], [x + w * 1.2, base - H * exp]], 4, c); g.setLineDash([]);
  rr(g, x - w / 2, base - H * got, w, H * got, 14); g.fillStyle = alpha(gold, 0.85); g.fill(); glow(g, x, base - H * got, 120, gold, 0.5);
  text(g, 'RECOMPENSA', x, base + 44, { size: V(30, 34), color: gold, font: FONTS.ui, weight: 900, spacing: 2 });
  const bx = E.W * V(0.7, 0.5), by = E.H * V(0.46, 0.22), on = ease.out(prog(t, tE - 0.15, tE + 0.4));
  if (!E.vertical || true) { brain(g, bx, by, V(230, 170), { col: c, lit: on }); pathway(g, bx, by, V(230, 170), on); if (on > 0) FX.rings(g, bx, by, t - tE, { count: 3, r0: 120, r1: 420, color: gold, a: 0.5 * on }); }
  g.restore();
} });
