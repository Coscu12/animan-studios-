// avatar.js — channel profile picture: the dark figure in a purple hoodie on the emerald look, centred for a circular crop.
import { E, S, registerShot, mood, backdrop, glow, circle, ring, alpha, shade, radGrad } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';

const HOOD = { top: 'hoodie', color: '#8a5ad6', head: 'hood', headColor: '#8a5ad6' };
const NOHOOD = { top: 'hoodie', color: '#8a5ad6', head: 'none' };
const CX = E.W / 2, CY = E.H / 2;
function bg(g) {
  const M = mood('dusk'); backdrop(g, [shade(M.dark, -0.3), M.wall, shade(M.dark, -0.4)]);
  g.fillStyle = radGrad(g, CX, CY - 40, 0, 560, [alpha(M.sky[2], 0.9), alpha(M.sky[1], 0.55), alpha(M.dark, 0)]); g.fillRect(0, 0, E.W, E.H);
  FX.godRays(g, CX, CY - 60, { count: 16, angle: -Math.PI / 2, spread: Math.PI * 2, len: 900, color: S().ui.gold, a: 0.05, t: 0 });
  FX.dust(g, 0.6, { count: 60, color: '#e8ffb0', a: 0.45, area: [CX - 540, 0, 1080, E.H] });
}
function spark(g, x, y, s) { const gold = S().ui.gold; glow(g, x, y, 120 * s, gold, 0.8); glow(g, x, y, 40 * s, '#fff8e0', 0.95); circle(g, x, y, 12 * s, '#fffbe8'); }
registerShot('p1', { draw(g) { bg(g); bigFace(g, CX, CY + 60, 250, { outfit: HOOD, expr: 'smile', look: [0, 0], rimColor: S().ui.accent, rimSide: 1 }); } });
registerShot('p2', { draw(g) { bg(g); bigFace(g, CX - 20, CY + 70, 240, { outfit: NOHOOD, expr: 'smirk', look: [0.5, -0.5], rimColor: S().ui.accent, rimSide: 1 }); spark(g, CX + 230, CY - 160, 1.2); ring(g, CX + 230, CY - 160, 60, 3, alpha(S().ui.gold, 0.5)); } });
registerShot('p3', { draw(g) { bg(g); const M = mood('dusk'); FX.pool(g, CX - 330, CY + 360, 300, 40, S().ui.gold, 0.35);
  drawFigure(g, { x: CX - 330, y: CY + 360, s: 2.6, facing: 1, outfit: HOOD, pose: { ...POSES.holdFront, eF: [22, -150], hF: [40, -176] }, expr: 'awe', look: [1, -0.4], rim: { color: S().ui.accent, dir: [0.5, -1], w: 7 } });
  spark(g, CX - 330 + 40 * 2.6 + 30, CY + 360 - 176 * 2.6 - 30, 1.1); } });
