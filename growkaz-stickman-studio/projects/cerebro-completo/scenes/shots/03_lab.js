// shots/03_lab.js — the scientists: Berridge (warm lab) and Schultz (cool lab, monitors).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, wordTime, seg, circle, rr, glow, alpha, shade, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { laboratorio } from '../sets/laboratorio.js';
import { brain } from '../sets/cerebro.js';
import { BERRIDGE, SCHULTZ } from '../cast.js';

const wt = (w, info, d = 0.5) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;
const nameTag = (g, t, name, role, start, x, y) => {
  const a = ease.out(prog(t, start, start + 0.4)); if (a <= 0) return; const ui = S().ui;
  g.save(); g.globalAlpha *= a; seg(g, [[x, y - 40], [x, y + 50]], 4, ui.gold);
  text(g, name, x + 24, y - 10, { size: V(46, 48), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  text(g, role, x + 26, y + 34, { size: V(24, 28), color: ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 }); g.restore();
};

// s14 — "...se pensó que la dopamina era la molécula del placer."  Berridge at a board: PLACER?
registerShot('b14', { draw(g, t, info) {
  const cam = { z: 1 + 0.06 * ease.inOut(t / info.dur), x: -30 + 20 * ease.inOut(t / info.dur) };
  const { GY, M } = laboratorio(g, t, cam, { mood: 'interiorWarm' });
  const bx = E.W / 2 + V(170, 0), by = GY - V(520, 900), tP = wt('placer', info, 3.7);
  layer(g, cam, 0.8, (g) => {
    rr(g, bx - 230, by - 150, 460, 300, 12); g.fillStyle = shade(M.dark, -0.2); g.fill(); g.strokeStyle = alpha(M.practical, 0.4); g.lineWidth = 4; g.stroke();
    brain(g, bx - 70, by - 10, 90, { col: alpha('#e8f0ff', 0.85), w: 3 });
    const a = ease.out(prog(t, tP - 0.1, tP + 0.3)); text(g, 'PLACER?', bx + 110, by + 10, { size: 52, color: S().ui.gold, font: FONTS.ui, weight: 900, alpha: a, glow: 14, glowColor: alpha(S().ui.gold, 0.6) });
    if (a > 0) glow(g, bx + 110, by + 10, 120, S().ui.gold, 0.25 * a);
  });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 - V(260, 160), y: GY, s: V(1.4, 1.5), facing: 1, outfit: BERRIDGE, pose: breathe(posesAt(t, [[0, POSES.stand], [0.8, POSES.point], [tP + 0.6, POSES.think]]), t), expr: t > tP + 0.6 ? 'thinking' : 'smile', prop: { type: 'pointer' }, rim: { color: M.rim, dir: [0.4, -1] } }));
  blurLayer(g, 10, (g) => { g.fillStyle = 'rgba(40,70,50,.75)'; rr(g, 60, E.H - 320, 110, 300, 24); g.fill(); g.fillStyle = 'rgba(230,160,60,.5)'; rr(g, E.W - 220, E.H - 260, 120, 240, 30); g.fill(); }, cam, 1.6);
  FX.dust(g, t, { count: 40 });
} });

// s15 — "Pero la ciencia ha ido mostrando algo más interesante."  Berridge's giant face
registerShot('b15', { draw(g, t, info) {
  blurLayer(g, 14, (g) => laboratorio(g, t, { z: 1.5, x: 220, y: -160 }, { mood: 'interiorWarm' })); veil(g, '#08120c', 0.35);
  const M = mood('interiorWarm'), r = V(290, 320) * (1 + 0.03 * t), tI = wt('interesante', info, 2.6);
  bigFace(g, E.W / 2 - V(120, 0), E.H * V(0.62, 0.55), r, { outfit: BERRIDGE, expr: t < tI - 0.3 ? 'thinking' : 'awe', rimColor: M.rim, rimSide: 1, blink: (t % 3.2) > 3.1 });
  if (t > tI - 0.3) FX.sparkle(g, E.W / 2 + V(260, 200), E.H * V(0.3, 0.3), 26 + 6 * Math.sin(t * 8), S().ui.gold, clamp((t - tI + 0.3) * 3));
  FX.dust(g, t, { count: 20 });
} });

// s16 — "El neurocientífico Kent Berridge"  medium at the bench, name tag
registerShot('b16', { draw(g, t, info) {
  const cam = { z: 1.25 + 0.05 * ease.inOut(t / info.dur), x: 120 - 40 * ease.inOut(t / info.dur), y: 60 };
  const { GY, M } = laboratorio(g, t, cam, { mood: 'interiorWarm' });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2 + V(120, 60), y: GY, s: V(1.5, 1.6), facing: -1, outfit: BERRIDGE, pose: breathe(POSES.holdFront, t), expr: 'neutral', prop: 'paper', look: [-0.3, 0.3], rim: { color: M.rim, dir: [0, -1] }, blink: (t % 2.9) > 2.8 }));
  nameTag(g, t, 'KENT BERRIDGE', 'NEUROCIENTÍFICO', wt('kent', info, 1.2) - 0.1, V(180, 120), E.H * V(0.3, 0.2));
  FX.dust(g, t, { count: 30 });
} });

// s25 — "Wolfram Schultz, otro investigador,"  cool lab at night, monitor glow
registerShot('b25', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.06 * ease.inOut(t / info.dur), x: 40 };
  const { GY, M } = laboratorio(g, t, cam, { mood: 'interiorCool' });
  layer(g, cam, 1, (g) => {
    FX.screen(g, { x: E.W / 2 + V(80, -40), y: GY - V(330, 360), w: 260, h: 170, glowC: '#7fd0d6', a: 0.35 }, (g, x, y, w, h) => { for (let i = 0; i < 26; i++) seg(g, [[x + 12 + i * 9, y + h - 20], [x + 12 + i * 9, y + h - 20 - (8 + Math.abs(Math.sin(i * 3.3 + Math.floor(t * 4))) * 26)]], 3, '#7fd0d6'); });
    drawFigure(g, { x: E.W / 2 - V(140, 160), y: GY, s: V(1.4, 1.5), facing: 1, outfit: SCHULTZ, pose: breathe(POSES.think, t), expr: 'thinking', look: [1, -0.2], rim: { color: '#9fe0ff', dir: [1, -0.3] }, blink: (t % 3.4) > 3.3 });
  });
  nameTag(g, t, 'WOLFRAM SCHULTZ', 'INVESTIGADOR', 0.5, V(160, 120), E.H * V(0.22, 0.16));
  FX.dust(g, t, { count: 30, color: '#cfe8ff' });
} });

// s26 — "observó en sus experimentos que las neuronas de dopamina"  OTS onto the monitor
registerShot('b26', { draw(g, t, info) {
  const cam = { z: 1.6 + 0.08 * ease.inOut(t / info.dur), x: 120, y: -40 };
  const { GY, M } = laboratorio(g, t, cam, { mood: 'interiorCool' });
  layer(g, cam, 1, (g) => FX.screen(g, { x: E.W / 2 + V(80, -40), y: GY - V(330, 360), w: 260, h: 170, glowC: '#7fd0d6', a: 0.45 }, (g, x, y, w, h) => {
    const head = (t * 0.35) % 1; for (let i = 0; i < 26; i++) { const u = i / 25; if (u > head + 0.02 && t < 2.5) continue; seg(g, [[x + 12 + i * 9, y + h - 20], [x + 12 + i * 9, y + h - 20 - (6 + Math.abs(Math.sin(i * 2.7)) * 30)]], 3, '#7fd0d6'); }
    text(g, 'NEURONAS DA', x + w / 2, y + 18, { size: 14, color: '#bff4ff', font: FONTS.ui, weight: 900, spacing: 2 }); }));
  blurLayer(g, 12, (g) => drawFigure(g, { x: E.W * V(0.22, 0.2), y: E.H * 1.32, s: V(4.2, 4.6), facing: 1, outfit: SCHULTZ, pose: POSES.stand, expr: 'thinking', rim: { color: '#9fe0ff', dir: [1, -0.4], w: 6 } }));
  FX.dust(g, t, { count: 30, color: '#cfe8ff' });
} });
