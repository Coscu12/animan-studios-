// sets/dormitorio.js — modern bedroom at night: big window with moon + city, bed, nightstand lamp off. The phone is the key light.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const dormGround = () => E.H * V(0.8, 0.68);
export const PHONE_GLOW = '#9fd8ff';
export function dormitorio(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = dormGround(), CX = E.W / 2;
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.5), shade(M.wall, -0.2)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    const wx = CX + V(120, -260), wy = GY - V(640, 980), ww = V(560, 520), wh = V(420, 520);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(M.wall, -0.6), bar: 12 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h);
      if (!o.mood || o.mood === 'night') { FX.stars(g, t, { area: [x, y, w, h * 0.6], count: 40 }); FX.moon(g, x + w * 0.72, y + h * 0.25, 30); }
      else FX.sun(g, x + w * 0.5, y + h * 0.78, 50, '#fff6e0', M.key, 4);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.55, color: shade(M.wall, -0.55), windowColor: alpha(M.practical, 0.8), lit: 0.3, seed: 12 });
    });
    FX.godRays(g, wx + ww * 0.7, wy + wh * 0.3, { count: 6, angle: Math.PI * 0.62, spread: 0.5, len: 1300, color: M.key, a: o.mood && o.mood !== 'night' ? 0.09 : 0.04, t });
    o.wall?.(g, wx, wy, ww, wh, M);
    // poster + shelf
    rr(g, CX - V(760, 440), GY - V(600, 1100), 180, 240, 6); g.fillStyle = shade(M.wall, -0.35); g.fill();
    g.fillStyle = shade(M.wall, 0.05); g.fillRect(CX - V(540, 440), GY - V(380, 700), 260, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, 0.05), shade(M.dark, -0.4)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.3)', 0.08);
    FX.pool(g, CX + V(380, 0), GY + 40, 520, 70, M.key, 0.1);
  });
  return { GY, CX, M };
}
// bed seen from the side; returns the mattress top y
export function cama(g, x, GY, w = 620, M) {
  const frame = shade(M.wall, -0.65);
  g.fillStyle = frame; g.fillRect(x - w / 2, GY - 110, w, 110); g.fillRect(x - w / 2 - 16, GY - 250, 30, 250);
  rr(g, x - w / 2 + 10, GY - 150, w - 10, 50, 18); g.fillStyle = shade('#3a4a8a', -0.35); g.fill();
  rr(g, x - w / 2 + 24, GY - 176, 130, 36, 14); g.fillStyle = shade('#cfd6f0', -0.45); g.fill();
  return GY - 150;
}
export function phoneGlow(g, x, y, a = 1) { glow(g, x, y, 260, PHONE_GLOW, 0.35 * a); glow(g, x, y, 70, '#ffffff', 0.4 * a); }

// desk with a laptop; returns the screen centre. lit = screen glow 0..1
export function escritorio(g, x, GY, M, o = {}) {
  const c = shade(M.wall, -0.7), top = GY - 150;
  rr(g, x - 190, top - 12, 380, 16, 6); g.fillStyle = c; g.fill(); seg(g, [[x - 170, top], [x - 170, GY]], 10, c); seg(g, [[x + 170, top], [x + 170, GY]], 10, c);
  const lx = x + (o.lx ?? 30), sw = 150, sh = 96, lit = o.lit ?? 1;
  g.save(); g.translate(lx, top - 12); g.rotate(-0.12); rr(g, -sw / 2, -sh, sw, sh, 6); g.fillStyle = shade(c, 0.1); g.fill();
  g.fillStyle = alpha(o.screen || '#bfe6ff', 0.3 + 0.6 * lit); g.fillRect(-sw / 2 + 8, -sh + 8, sw - 16, sh - 16); g.restore();
  seg(g, [[lx - 80, top - 14], [lx + 60, top - 14]], 6, shade(c, 0.15));
  glow(g, lx - 10, top - 60, 220, o.screen || '#bfe6ff', 0.3 * lit);
  if (o.phone) { rr(g, x - 140, top - 22, 40, 10, 3); g.fillStyle = '#0a0a10'; g.fill(); if (o.phoneLit) glow(g, x - 120, top - 22, 60, PHONE_GLOW, 0.6 * o.phoneLit); }
  if (o.mug) { rr(g, x - 90, top - 42, 26, 30, 5); g.fillStyle = '#e8e2d8'; g.fill(); }
  return { top, screen: [lx - 10, top - 60] };
}
