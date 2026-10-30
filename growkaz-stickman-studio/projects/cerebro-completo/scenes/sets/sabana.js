// sets/sabana.js — the ancestral savanna: giant low sun, flat-topped acacias, rolling hills, dry grass. Optional campfire.
import { E, V, mood, layer, backdrop, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const sabanaGround = () => E.H * V(0.8, 0.68);

// flat-topped acacia silhouette
export function acacia(g, x, y, s = 1, color = '#120e14', fruit = null) {
  seg(g, [[x, y], [x - 6 * s, y - 120 * s], [x - 40 * s, y - 190 * s]], 12 * s, color);
  seg(g, [[x - 6 * s, y - 120 * s], [x + 50 * s, y - 196 * s]], 10 * s, color);
  seg(g, [[x - 4 * s, y - 150 * s], [x + 6 * s, y - 210 * s]], 8 * s, color);
  g.fillStyle = color;
  for (const [dx, dy, rx, ry] of [[-60, -205, 110, 26], [50, -212, 120, 28], [0, -226, 150, 30], [-10, -240, 90, 20]]) { g.beginPath(); g.ellipse(x + dx * s, y + dy * s, rx * s, ry * s, 0, 0, 7); g.fill(); }
  if (fruit) for (const [dx, dy] of fruit.pts || [[-80, -186], [-30, -196], [40, -190], [96, -194], [10, -204]]) {
    glow(g, x + dx * s, y + dy * s, 34 * s * (fruit.glow ?? 1), fruit.color, 0.6 * (fruit.a ?? 1));
    circle(g, x + dx * s, y + dy * s, 9 * s, fruit.color);
    circle(g, x + dx * s - 3 * s, y + dy * s - 3 * s, 3 * s, alpha('#ffffff', 0.7));
  }
}
export function bush(g, x, y, s = 1, color = '#16101a') {
  for (const [dx, dy, r] of [[-30, -22, 26], [0, -34, 32], [32, -24, 24], [12, -14, 22]]) circle(g, x + dx * s, y + dy * s, r * s, color);
  for (let i = 0; i < 5; i++) seg(g, [[x + (-24 + i * 12) * s, y - 30 * s], [x + (-40 + i * 20) * s, y - (64 + (i % 2) * 14) * s]], 3 * s, color);
}
export function campfire(g, x, y, t, s = 1, M) {
  FX.pool(g, x, y + 6, 360 * s, 70 * s, M.practical, 0.35);
  glow(g, x, y - 40 * s, 260 * s, '#ff9a3a', 0.45);
  for (let i = 0; i < 3; i++) seg(g, [[x - 40 * s, y - (4 + i * 4) * s], [x + 40 * s, y - (10 - i * 4) * s]], 9 * s, '#1a0f0c');
  const fl = (k, h, c) => { const sw = Math.sin(t * 9 + k * 2) * 6 * s; poly(g, [[x - 26 * s + k * 10 * s, y - 8 * s], [x + sw + k * 6 * s, y - h * s], [x + 26 * s + k * 4 * s, y - 8 * s]], c); };
  fl(-1, 70 + Math.sin(t * 7) * 10, '#ff7a2a'); fl(1, 60 + Math.sin(t * 6 + 1) * 10, '#ff9a3a'); fl(0, 46 + Math.sin(t * 11) * 8, '#ffe08a');
  const r = rng(9); for (let i = 0; i < 10; i++) { const ph = (t * 0.6 + r()) % 1; circle(g, x + (r() - 0.5) * 60 * s + Math.sin(t * 3 + i) * 8, y - (60 + ph * 220) * s, 2.5 * s * (1 - ph), alpha('#ffc06a', 1 - ph)); }
}

export function sabana(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = sabanaGround(), CX = E.W / 2;
  const sunX = CX + (o.sunX ?? V(380, 120)), sunY = GY - V(250, 520);
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    if (o.mood === 'night') FX.moon(g, sunX, sunY - V(200, 300), V(46, 50));
    else { FX.sun(g, sunX, sunY, V(150, 170), '#fff3dc', M.key, 3.2); FX.godRays(g, sunX, sunY, { count: 12, angle: -Math.PI / 2, spread: Math.PI * 1.7, len: 1500, a: 0.05, t }); }
    FX.clouds(g, { y: GY - V(760, 1300), h: 220, color: shade(M.key, 0.3), a: 0.12, seed: 4 });
  });
  layer(g, cam, 0.3, (g) => {
    FX.hills(g, { y: GY - V(40, 120), amp: 110, color: mix(M.sky[1], M.dark, 0.55), seed: 3, freq: 0.002 });
    for (const [x, s] of [[-500, 0.5], [420, 0.45], [1380, 0.55], [2300, 0.5]]) acacia(g, x, GY - V(60, 130), s, mix(M.sky[1], M.dark, 0.7));
  });
  layer(g, cam, 0.6, (g) => {
    FX.hills(g, { y: GY - 10, amp: 60, color: shade(M.dark, 0.1), seed: 7, freq: 0.003 });
    if (o.bigTree !== false) acacia(g, o.treeX ?? CX - V(560, 300), GY + 4, V(1.6, 1.5), shade(M.dark, -0.3), o.fruit);
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 20, 0, GY + 400, [shade(M.floor, 0.05), shade(M.dark, -0.3)]); g.fillRect(-E.W, GY - 6, E.W * 3, E.H * 2);
    const r = rng(17); g.strokeStyle = alpha(shade(M.dark, -0.4), 0.9); g.lineWidth = 3; g.beginPath();
    for (let i = 0; i < 220; i++) { const x = -E.W + r() * E.W * 3, y = GY + r() ** 2 * 300, h = 12 + r() * 26; g.moveTo(x, y); g.lineTo(x + (r() - 0.5) * 14, y - h); } g.stroke();
    if (o.mood !== 'night') FX.pool(g, sunX, GY + 20, 700, 60, M.key, 0.12);
    if (o.fire) campfire(g, o.fire[0], GY + (o.fire[1] || 0), t, o.fireS || 1, M);
  });
  return { GY, CX, M, sunX, sunY };
}
